import { createServerFn } from "@tanstack/react-start";
import { runQuery, runRpc, supabase, supabaseAdmin } from "./db.server";
import crypto from "crypto";

export const executeDbQuery = createServerFn({ method: "POST" })
  .inputValidator((query: any) => query as any)
  .handler(async ({ data: query }) => {
    return runQuery(query);
  });

export const authSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { email: string; password_hash_or_code: string })
  .handler(async ({ data }) => {
    if (!supabase) {
      const db = (await import("./db.server")).readDb();
      const email = data.email.trim().toLowerCase();
      const user = db.users.find((u: any) => u.email.trim().toLowerCase() === email);
      if (!user || user.password !== data.password_hash_or_code) {
        return { error: { message: "Invalid login credentials" } };
      }

      const sessionToken = crypto.randomUUID();
      const session = {
        access_token: sessionToken,
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: crypto.randomUUID(),
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          created_at: user.created_at,
        },
      };
      return { data: { session, user: session.user } };
    }

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password_hash_or_code,
      });
      if (error) {
        return { error: { message: error.message } };
      }
      return { data: authData };
    } catch (err: any) {
      return { error: { message: err?.message || "Sign in failed" } };
    }
  });

export const authSignUp = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) => d as { email: string; password_hash_or_code: string; user_metadata?: any },
  )
  .handler(async ({ data }) => {
    if (!supabase) {
      const db = (await import("./db.server")).readDb();
      const email = data.email.trim().toLowerCase();
      const existing = db.users.find((u: any) => u.email.trim().toLowerCase() === email);
      if (existing) {
        return { error: { message: "User already exists" } };
      }

      const newUser = {
        id: crypto.randomUUID(),
        email: data.email,
        password: data.password_hash_or_code,
        user_metadata: data.user_metadata || {},
        created_at: new Date().toISOString(),
      };
      db.users.push(newUser);

      const username = newUser.user_metadata?.username || newUser.email.split("@")[0];
      const displayName = newUser.user_metadata?.display_name || username;
      db.profiles.push({
        id: newUser.id,
        username,
        display_name: displayName,
        access_code: newUser.user_metadata?.username || null,
        created_at: new Date().toISOString(),
      });

      db.user_roles.push({
        id: crypto.randomUUID(),
        user_id: newUser.id,
        role: "participant",
      });

      (await import("./db.server")).writeDb(db);

      const sessionToken = crypto.randomUUID();
      const session = {
        access_token: sessionToken,
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: crypto.randomUUID(),
        user: {
          id: newUser.id,
          email: newUser.email,
          user_metadata: newUser.user_metadata,
          created_at: newUser.created_at,
        },
      };
      return { data: { session, user: session.user } };
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password_hash_or_code,
        options: {
          data: data.user_metadata || {},
        },
      });
      if (error) {
        return { error: { message: error.message } };
      }
      return { data: authData };
    } catch (err: any) {
      return { error: { message: err?.message || "Sign up failed" } };
    }
  });

export const authAdminCreateUser = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) => d as { email: string; password_hash_or_code: string; user_metadata?: any },
  )
  .handler(async ({ data }) => {
    if (!supabase) {
      const db = (await import("./db.server")).readDb();
      const email = data.email.trim().toLowerCase();
      const existing = db.users.find((u: any) => u.email.trim().toLowerCase() === email);
      if (existing) {
        return { error: { message: "User already exists" } };
      }

      const newUser = {
        id: crypto.randomUUID(),
        email: data.email,
        password: data.password_hash_or_code,
        user_metadata: data.user_metadata || {},
        created_at: new Date().toISOString(),
      };
      db.users.push(newUser);

      const username = newUser.user_metadata?.username || newUser.email.split("@")[0];
      const displayName = newUser.user_metadata?.display_name || username;
      db.profiles.push({
        id: newUser.id,
        username,
        display_name: displayName,
        access_code: newUser.user_metadata?.username || null,
        created_at: new Date().toISOString(),
      });

      db.user_roles.push({
        id: crypto.randomUUID(),
        user_id: newUser.id,
        role: "participant",
      });

      (await import("./db.server")).writeDb(db);
      return {
        data: {
          user: { id: newUser.id, email: newUser.email, user_metadata: newUser.user_metadata },
        },
      };
    }

    try {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn("[AuthAdmin] Service role key missing. Falling back to public signUp.");
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password_hash_or_code,
          options: {
            data: data.user_metadata || {},
          },
        });
        if (error) {
          return { error: { message: error.message } };
        }
        return { data: authData };
      }

      const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password_hash_or_code,
        user_metadata: data.user_metadata || {},
        email_confirm: true,
      });
      if (error) {
        return { error: { message: error.message } };
      }
      return { data: authData };
    } catch (err: any) {
      return { error: { message: err?.message || "Create user failed" } };
    }
  });

export const authAdminUpdateUserById = createServerFn({ method: "POST" })
  .inputValidator(
    (d: any) => d as { id: string; email?: string; password?: string; user_metadata?: any },
  )
  .handler(async ({ data }) => {
    if (!supabase) {
      const db = (await import("./db.server")).readDb();
      const index = db.users.findIndex((u: any) => u.id === data.id);
      if (index === -1) {
        return { error: { message: "User not found" } };
      }
      const user = db.users[index];
      if (data.email) user.email = data.email;
      if (data.password) user.password = data.password;
      if (data.user_metadata) {
        user.user_metadata = {
          ...user.user_metadata,
          ...data.user_metadata,
        };
      }
      (await import("./db.server")).writeDb(db);
      return {
        data: { user: { id: user.id, email: user.email, user_metadata: user.user_metadata } },
      };
    }

    try {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to update other users' credentials.");
      }

      const updateData: any = {};
      if (data.email) updateData.email = data.email;
      if (data.password) updateData.password = data.password;
      if (data.user_metadata) updateData.user_metadata = data.user_metadata;

      const { data: authData, error } = await supabaseAdmin.auth.admin.updateUserById(data.id, updateData);
      if (error) {
        return { error: { message: error.message } };
      }
      return { data: authData };
    } catch (err: any) {
      return { error: { message: err?.message || "Update user failed" } };
    }
  });

export const authAdminDeleteUser = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data }) => {
    if (!supabase) {
      const db = (await import("./db.server")).readDb();
      const index = db.users.findIndex((u: any) => u.id === data.id);
      if (index === -1) {
        return { error: { message: "User not found" } };
      }
      db.users.splice(index, 1);
      (await import("./db.server")).writeDb(db);
      return { data: { user: null } };
    }

    try {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn("[authAdminDeleteUser] SUPABASE_SERVICE_ROLE_KEY is missing. Skipping auth user deletion, database rows will still be deleted.");
        return { data: { user: null } };
      }

      const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
      if (error) {
        return { error: { message: error.message } };
      }
      return { data: { user: null } };
    } catch (err: any) {
      return { error: { message: err?.message || "Delete user failed" } };
    }
  });

export const executeDbRpc = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { name: string; args?: any })
  .handler(async ({ data }) => {
    return runRpc(data.name, data.args);
  });
