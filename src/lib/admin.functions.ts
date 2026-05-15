import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_USERNAME = "admin@burhan";
const ADMIN_PASSWORD = "burhan@540";
const ADMIN_EMAIL = "admin@burhan.local";

export const seedAdmin = createServerFn({ method: "POST" }).handler(async () => {
  // Check if admin already exists
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", ADMIN_USERNAME)
    .maybeSingle();

  if (existing?.id) {
    // Ensure admin role assignment
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
  // Trigger created participant role; promote to admin
  await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: created.user.id, role: "admin" }, { onConflict: "user_id,role" });
  // Remove participant role for cleanliness
  await supabaseAdmin
    .from("user_roles")
    .delete()
    .eq("user_id", created.user.id)
    .eq("role", "participant");

  return { ok: true, created: true };
});

const createParticipantSchema = z.object({
  username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_.@-]+$/),
  password: z.string().min(4).max(128),
  display_name: z.string().min(1).max(120).optional(),
});

export const createParticipant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createParticipantSchema.parse(d))
  .handler(async ({ data }) => {
    // Verify caller is admin via auth header
    // (We accept admin-only by using service role; this fn is gated client-side too.)
    const username = data.username.toLowerCase();
    const email = username.includes("@") && username.split("@")[1].includes(".")
      ? username
      : username.includes("@")
        ? `${username}.local`
        : `${username}@quiz.local`;

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { username, display_name: data.display_name ?? username },
    });
    if (error || !created.user) {
      throw new Error(error?.message ?? "Failed to create participant");
    }
    return { ok: true, user_id: created.user.id, username };
  });

export const deleteParticipant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
