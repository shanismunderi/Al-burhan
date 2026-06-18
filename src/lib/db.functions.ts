import { createServerFn } from "@tanstack/react-start";
import { runQuery, readDb, writeDb, handleNewUserTrigger, type DBQuery, runRpc } from "./db.server";
import crypto from "crypto";

export const executeDbQuery = createServerFn({ method: "POST" })
  .inputValidator((query: any) => query as DBQuery)
  .handler(async ({ data: query }) => {
    return runQuery(query);
  });

export const authSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { email: string; password_hash_or_code: string })
  .handler(async ({ data }) => {
    const db = readDb();
    const email = data.email.trim().toLowerCase();
    const user = db.users.find((u: any) => u.email.trim().toLowerCase() === email);
    if (!user || user.password !== data.password_hash_or_code) {
      return { error: { message: "Invalid login credentials" } };
    }
    
    // Generate a mock session
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
      }
    };
    return { data: { session, user: session.user } };
  });

export const authSignUp = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { email: string; password_hash_or_code: string; user_metadata?: any })
  .handler(async ({ data }) => {
    const db = readDb();
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
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    handleNewUserTrigger(db, newUser);
    writeDb(db);

    // Generate mock session
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
      }
    };
    return { data: { session, user: session.user } };
  });

export const authAdminCreateUser = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { email: string; password_hash_or_code: string; user_metadata?: any })
  .handler(async ({ data }) => {
    const db = readDb();
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
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    handleNewUserTrigger(db, newUser);
    writeDb(db);
    return { data: { user: { id: newUser.id, email: newUser.email, user_metadata: newUser.user_metadata } } };
  });

export const authAdminUpdateUserById = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { id: string; email?: string; password?: string; user_metadata?: any })
  .handler(async ({ data }) => {
    const db = readDb();
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
        ...data.user_metadata
      };
    }
    writeDb(db);
    return { data: { user: { id: user.id, email: user.email, user_metadata: user.user_metadata } } };
  });

export const authAdminDeleteUser = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { id: string })
  .handler(async ({ data }) => {
    const db = readDb();
    const index = db.users.findIndex((u: any) => u.id === data.id);
    if (index === -1) {
      return { error: { message: "User not found" } };
    }
    db.users.splice(index, 1);
    writeDb(db);
    return { data: { user: null } };
  });

export const executeDbRpc = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { name: string; args?: any })
  .handler(async ({ data }) => {
    return runRpc(data.name, data.args);
  });
