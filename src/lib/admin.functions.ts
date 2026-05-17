import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_USERNAME = "admin@burhan";
const ADMIN_PASSWORD = "burhan@540";
const ADMIN_EMAIL = "admin@burhan.local";

export const seedAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", ADMIN_USERNAME)
    .maybeSingle();

  if (existing?.id) {
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: existing.id, role: "admin" }, { onConflict: "user_id,role" });
    return { ok: true, created: false };
  }

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { username: ADMIN_USERNAME, display_name: "Administrator" },
  });
  if (error || !created.user) {
    throw new Error(error?.message ?? "Failed to seed admin");
  }
  await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: created.user.id, role: "admin" }, { onConflict: "user_id,role" });
  await supabaseAdmin
    .from("user_roles")
    .delete()
    .eq("user_id", created.user.id)
    .eq("role", "participant");

  return { ok: true, created: true };
});

// Code utilities
function generateCode(len = 8): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
export function emailForCode(code: string) {
  return `code-${code.toLowerCase()}@quiz.local`;
}

const createParticipantSchema = z.object({
  display_name: z.string().min(1).max(120),
});

export const createParticipant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createParticipantSchema.parse(d))
  .handler(async ({ data }) => {
    // Generate a unique code (retry on collision)
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: clash } = await supabaseAdmin
        .from("profiles").select("id").eq("access_code", code).maybeSingle();
      if (!clash) break;
      code = generateCode();
    }
    const email = emailForCode(code);
    const password = code; // password == code

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username: code, display_name: data.display_name },
    });
    if (error || !created.user) {
      throw new Error(error?.message ?? "Failed to create candidate");
    }
    // Profile is created by trigger; set access_code + display_name explicitly
    await supabaseAdmin
      .from("profiles")
      .update({ access_code: code, display_name: data.display_name, username: code })
      .eq("id", created.user.id);

    return { ok: true, user_id: created.user.id, access_code: code, display_name: data.display_name };
  });

export const deleteParticipant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Manual grading for descriptive answers
export const gradeAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      answer_id: z.string().uuid(),
      manual_score: z.number().min(0).max(1000),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("attempt_answers")
      .update({ manual_score: data.manual_score })
      .eq("id", data.answer_id);
    if (error) throw new Error(error.message);

    // Recompute attempt score from all answers
    const { data: ans } = await supabaseAdmin
      .from("attempt_answers")
      .select("attempt_id")
      .eq("id", data.answer_id)
      .maybeSingle();
    if (ans?.attempt_id) {
      const { data: all } = await supabaseAdmin
        .from("attempt_answers")
        .select("is_correct, manual_score, question_id")
        .eq("attempt_id", ans.attempt_id);
      const qIds = (all ?? []).map((a) => a.question_id);
      const { data: qs } = await supabaseAdmin
        .from("questions")
        .select("id, marks, question_type")
        .in("id", qIds.length ? qIds : ["00000000-0000-0000-0000-000000000000"]);
      const qMap = Object.fromEntries((qs ?? []).map((q) => [q.id, q]));
      let score = 0;
      let correct = 0;
      (all ?? []).forEach((a) => {
        const q = qMap[a.question_id];
        if (!q) return;
        if (q.question_type === "mcq") {
          if (a.is_correct) { score += Number(q.marks); correct += 1; }
        } else if (a.manual_score != null) {
          score += Number(a.manual_score);
          if (Number(a.manual_score) > 0) correct += 1;
        }
      });
      await supabaseAdmin
        .from("quiz_attempts")
        .update({ score, correct_count: correct })
        .eq("id", ans.attempt_id);
    }
    return { ok: true };
  });
