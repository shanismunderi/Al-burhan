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

const accessCodeSchema = z
  .string()
  .min(4)
  .max(16)
  .regex(/^[A-Z0-9]+$/, "Use A–Z and 0–9 only");

const createParticipantSchema = z.object({
  member1_name: z.string().min(1).max(120),
  member2_name: z.string().min(1).max(120),
  access_code: z.string().optional(),
});

export const createParticipant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const parsed = createParticipantSchema.safeParse(d);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message || "Invalid input data");
    }
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const m1 = data.member1_name.trim();
    const m2 = data.member2_name.trim();
    const teamName = `${m1} & ${m2}`;
    let code = (data.access_code ?? "").trim().toUpperCase();
    if (code) {
      const parsed = accessCodeSchema.safeParse(code);
      if (!parsed.success) {
        throw new Error(parsed.error.errors[0]?.message || "Invalid access code format");
      }
      const { data: clash } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("access_code", code)
        .maybeSingle();
      if (clash) throw new Error("That access code is already in use — pick another.");
    } else {
      code = generateCode();
      for (let i = 0; i < 5; i++) {
        const { data: clash } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("access_code", code)
          .maybeSingle();
        if (!clash) break;
        code = generateCode();
      }
    }
    const email = emailForCode(code);
    const password = code;

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username: code, display_name: teamName },
    });
    if (error || !created.user) {
      throw new Error(error?.message ?? "Failed to create team");
    }
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        access_code: code,
        display_name: teamName,
        username: code,
        member1_name: m1,
        member2_name: m2,
      })
      .eq("id", created.user.id);

    if (updateError) {
      throw new Error(updateError.message ?? "Failed to update profile");
    }

    return { ok: true, user_id: created.user.id, access_code: code, display_name: teamName };
  });

export const updateAccessCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const parsed = z
      .object({ user_id: z.string().uuid(), access_code: accessCodeSchema })
      .safeParse(d);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message || "Invalid input data");
    }
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const code = data.access_code.toUpperCase();
    const { data: clash } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("access_code", code)
      .maybeSingle();
    if (clash && clash.id !== data.user_id) {
      throw new Error("That access code is already in use.");
    }
    const newEmail = emailForCode(code);
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      email: newEmail,
      password: code,
      email_confirm: true,
      user_metadata: { username: code },
    });
    if (authErr) throw new Error(authErr.message);
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ access_code: code, username: code })
      .eq("id", data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true, access_code: code };
  });

export const deleteParticipant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    // 1. Attempt to delete the auth user first.
    // If the service role key is present and valid, this will succeed and cascade delete everything.
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);

    // Check if the user's profile still exists in profiles (meaning auth delete was skipped or failed)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", data.user_id)
      .maybeSingle();

    if (profile) {
      // 2. Delete cheat events
      const { error: cheatErr } = await supabaseAdmin.from("cheat_events").delete().eq("user_id", data.user_id);
      if (cheatErr) console.warn("Failed to delete cheat events:", cheatErr.message);

      // 3. Fetch and delete attempts and attempt answers
      const { data: attempts } = await supabaseAdmin
        .from("quiz_attempts")
        .select("id")
        .eq("user_id", data.user_id);

      if (attempts && attempts.length > 0) {
        const attemptIds = attempts.map((a: any) => a.id);
        await supabaseAdmin.from("attempt_answers").delete().in("attempt_id", attemptIds);
        await supabaseAdmin.from("quiz_attempts").delete().in("id", attemptIds);
      }

      // 4. Delete user roles
      const { error: rolesErr } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
      if (rolesErr) console.warn("Failed to delete user roles:", rolesErr.message);

      // 5. Delete profile (this will trigger auth.users deletion via the DB trigger if using Supabase)
      const { error: profileErr } = await supabaseAdmin.from("profiles").delete().eq("id", data.user_id);
      if (profileErr) throw new Error(`Failed to delete profile: ${profileErr.message}`);
    }

    return { ok: true };
  });

// Manual grading for descriptive answers
export const gradeAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        answer_id: z.string().uuid(),
        manual_score: z.number().min(0).max(1000),
      })
      .parse(d),
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
      const qIds = (all ?? []).map((a: any) => a.question_id);
      const { data: qs } = await supabaseAdmin
        .from("questions")
        .select("id, marks, question_type")
        .in("id", qIds.length ? qIds : ["00000000-0000-0000-0000-000000000000"]);
      const qMap = Object.fromEntries((qs ?? []).map((q: any) => [q.id, q]));
      let score = 0;
      let correct = 0;
      (all ?? []).forEach((a: any) => {
        const q = qMap[a.question_id];
        if (!q) return;
        if (q.question_type === "mcq" || q.question_type === "one_word") {
          if (a.is_correct) {
            score += Number(q.marks);
            correct += 1;
          }
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
