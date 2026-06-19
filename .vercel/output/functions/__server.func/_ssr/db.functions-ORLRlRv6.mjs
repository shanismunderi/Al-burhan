import { c as createServerRpc } from "./createServerRpc-DvWiWdjD.mjs";
import { a as createServerFn } from "./server-DSnt8QHz.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
}) : null;
const DB_FILE = path.join(process.cwd(), "db.json");
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return getInitialDb();
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return getInitialDb();
  }
}
function writeDb(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing db.json:", error);
  }
}
function getInitialDb() {
  const adminId = "00000000-0000-4000-a000-000000000000";
  const defaultQuizId = "00000000-0000-4000-q000-000000000000";
  return {
    users: [
      {
        id: adminId,
        email: "admin@burhan.local",
        password: "burhan@540",
        user_metadata: {
          username: "admin@burhan",
          display_name: "Administrator"
        },
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    profiles: [
      {
        id: adminId,
        username: "admin@burhan",
        display_name: "Administrator",
        access_code: null,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    user_roles: [
      {
        id: crypto.randomUUID(),
        user_id: adminId,
        role: "admin"
      }
    ],
    quizzes: [
      {
        id: defaultQuizId,
        title: "Main Examination",
        instructions: "Read each question carefully. Manage your time wisely.",
        duration_minutes: 30,
        negative_marks: 0,
        is_active: true,
        randomize: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    questions: [],
    quiz_attempts: [],
    attempt_answers: [],
    cheat_events: []
  };
}
function handleNewUserTrigger(db, user) {
}
async function runQuery(query) {
  if (!supabase) {
    console.warn("Supabase client not initialized. Falling back to local db.json.");
    return runLocalQuery(query);
  }
  try {
    let q = supabase.from(query.table);
    let builder;
    if (query.action === "select") {
      builder = q.select(query.selectColumns || "*", query.selectOptions);
    } else if (query.action === "insert") {
      builder = q.insert(query.data).select();
    } else if (query.action === "update") {
      builder = q.update(query.data).select();
    } else if (query.action === "delete") {
      builder = q.delete().select();
    } else if (query.action === "upsert") {
      builder = q.upsert(query.data, query.upsertOptions).select();
    }
    if (query.filters) {
      for (const filter of query.filters) {
        if (filter.type === "eq") {
          builder = builder.eq(filter.column, filter.value);
        } else if (filter.type === "neq") {
          builder = builder.neq(filter.column, filter.value);
        } else if (filter.type === "in") {
          builder = builder.in(filter.column, filter.value);
        } else if (filter.type === "not") {
          builder = builder.not(filter.column, filter.operator || "is", filter.value);
        }
      }
    }
    if (query.order) {
      builder = builder.order(query.order.column, { ascending: query.order.ascending });
    }
    if (query.limit !== void 0) {
      builder = builder.limit(query.limit);
    }
    const { data, count, error } = await builder;
    if (error) {
      console.error(`Supabase error on ${query.action} ${query.table}:`, error);
      return { data: null, error };
    }
    if ((query.action === "insert" || query.action === "update" || query.action === "upsert") && data) {
      return { data: Array.isArray(query.data) ? data : data[0] };
    }
    return { data, count };
  } catch (error) {
    console.error("runQuery exception:", error);
    return { data: null, error: { message: error.message } };
  }
}
async function runRpc(name, args) {
  if (!supabase) {
    console.warn("Supabase client not initialized. Falling back to local db.json RPC.");
    return runLocalRpc(name, args);
  }
  try {
    const { data, error } = await supabase.rpc(name, args);
    if (error) {
      console.error(`Supabase RPC error on ${name}:`, error);
      return { data: null, error };
    }
    return { data };
  } catch (error) {
    console.error("runRpc exception:", error);
    return { data: null, error: { message: error.message } };
  }
}
function runLocalQuery(query) {
  const db = readDb();
  if (!db[query.table]) {
    db[query.table] = [];
  }
  const rows = db[query.table];
  let filtered = [...rows];
  for (const filter of query.filters || []) {
    if (filter.type === "eq") {
      filtered = filtered.filter((row) => row[filter.column] === filter.value);
    } else if (filter.type === "neq") {
      filtered = filtered.filter((row) => row[filter.column] !== filter.value);
    } else if (filter.type === "in") {
      if (Array.isArray(filter.value)) {
        filtered = filtered.filter((row) => filter.value.includes(row[filter.column]));
      }
    } else if (filter.type === "not") {
      const { operator, value, column } = filter;
      if (operator === "is" && value === null) {
        filtered = filtered.filter((row) => row[column] !== null && row[column] !== void 0);
      } else {
        filtered = filtered.filter((row) => row[column] !== value);
      }
    }
  }
  const totalCount = filtered.length;
  if (query.order) {
    const col = query.order.column;
    const asc = query.order.ascending;
    filtered.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      if (valA === void 0 || valA === null) return asc ? -1 : 1;
      if (valB === void 0 || valB === null) return asc ? 1 : -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA - valB : valB - valA;
      }
      return asc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }
  if (query.limit !== void 0) {
    filtered = filtered.slice(0, query.limit);
  }
  if (query.action === "select") {
    if (query.selectOptions?.head) return { data: [], count: totalCount };
    if (query.selectOptions?.count === "exact") return { data: filtered, count: totalCount };
    return { data: filtered };
  }
  if (query.action === "insert") {
    const items = Array.isArray(query.data) ? query.data : [query.data];
    const inserted = [];
    for (const item of items) {
      const newItem = {
        id: item.id || crypto.randomUUID(),
        created_at: item.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        ...item
      };
      rows.push(newItem);
      inserted.push(newItem);
    }
    writeDb(db);
    return { data: Array.isArray(query.data) ? inserted : inserted[0] };
  }
  if (query.action === "update") {
    const updated = [];
    const filterIds = filtered.map((row) => row.id);
    for (let i = 0; i < rows.length; i++) {
      if (filterIds.includes(rows[i].id)) {
        rows[i] = {
          ...rows[i],
          ...query.data,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        updated.push(rows[i]);
      }
    }
    writeDb(db);
    return { data: updated };
  }
  if (query.action === "delete") {
    const filterIds = filtered.map((row) => row.id);
    db[query.table] = rows.filter((row) => !filterIds.includes(row.id));
    writeDb(db);
    return { data: rows.filter((row) => filterIds.includes(row.id)) };
  }
  if (query.action === "upsert") {
    const items = Array.isArray(query.data) ? query.data : [query.data];
    const upserted = [];
    for (const item of items) {
      let idx = -1;
      if (item.id) {
        idx = rows.findIndex((r) => r.id === item.id);
      }
      if (idx === -1 && query.table === "user_roles" && item.user_id && item.role) {
        idx = rows.findIndex((r) => r.user_id === item.user_id && r.role === item.role);
      }
      if (idx !== -1) {
        rows[idx] = { ...rows[idx], ...item, updated_at: (/* @__PURE__ */ new Date()).toISOString() };
        upserted.push(rows[idx]);
      } else {
        const newItem = {
          id: item.id || crypto.randomUUID(),
          created_at: item.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          ...item
        };
        rows.push(newItem);
        upserted.push(newItem);
      }
    }
    writeDb(db);
    return { data: Array.isArray(query.data) ? upserted : upserted[0] };
  }
  return { data: [] };
}
function runLocalRpc(name, args) {
  const db = readDb();
  if (name === "admin_get_questions") {
    const quizId = args?._quiz_id;
    if (!quizId) return { data: [], error: { message: "quiz_id required" } };
    const questions = (db.questions ?? []).filter((q) => q.quiz_id === quizId);
    questions.sort((a, b) => (a.position || 0) - (b.position || 0));
    return { data: questions };
  }
  if (name === "submit_quiz_attempt") {
    const attemptId = args?._attempt_id;
    const answers = args?._answers || {};
    const auto = !!args?._auto;
    if (!attemptId) return { data: null, error: { message: "attempt_id required" } };
    const attempts = db.quiz_attempts || [];
    const attemptIndex = attempts.findIndex((a) => a.id === attemptId);
    if (attemptIndex === -1) {
      return { data: null, error: { message: "Attempt not found" } };
    }
    const attempt = attempts[attemptIndex];
    if (attempt.status !== "in_progress") {
      return { data: attemptId };
    }
    const quiz = (db.quizzes || []).find((q) => q.id === attempt.quiz_id);
    const negativeMarks = quiz ? Number(quiz.negative_marks || 0) : 0;
    const questions = (db.questions || []).filter((q) => q.quiz_id === attempt.quiz_id);
    let correct = 0;
    let score = 0;
    let total = 0;
    if (!db.attempt_answers) db.attempt_answers = [];
    for (const q of questions) {
      total += 1;
      const sel = answers[q.id];
      if (sel === void 0 || sel === null || sel === "") continue;
      const isCorrect = q.question_type === "mcq" ? sel === q.correct_answer : String(sel).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();
      if (isCorrect) {
        correct += 1;
        score += Number(q.marks || 0);
      } else {
        score -= negativeMarks;
      }
      const existingIdx = db.attempt_answers.findIndex(
        (ans) => ans.attempt_id === attemptId && ans.question_id === q.id
      );
      if (existingIdx !== -1) {
        db.attempt_answers[existingIdx] = {
          ...db.attempt_answers[existingIdx],
          selected_answer: sel,
          is_correct: isCorrect,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
      } else {
        db.attempt_answers.push({
          id: crypto.randomUUID(),
          attempt_id: attemptId,
          question_id: q.id,
          selected_answer: sel,
          is_correct: isCorrect,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    if (score < 0) score = 0;
    attempt.status = auto ? "auto_submitted" : "submitted";
    attempt.submitted_at = (/* @__PURE__ */ new Date()).toISOString();
    attempt.score = score;
    attempt.correct_count = correct;
    attempt.total_questions = Math.max(total, attempt.total_questions || 0);
    writeDb(db);
    return { data: attemptId };
  }
  return { data: null, error: { message: `RPC method ${name} not implemented` } };
}
async function runMigrationsIfNeeded() {
  if (!supabase) return;
  if (!fs.existsSync(DB_FILE)) return;
  const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasServiceRoleKey) {
    console.warn("[Migration] SUPABASE_SERVICE_ROLE_KEY is missing in env. Skipping auto-migration to prevent auth errors.");
    return;
  }
  try {
    const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    console.log("[Migration] Found local db.json. Checking migration status...");
    const { data: existingQuizzes, error } = await supabase.from("quizzes").select("id").limit(1);
    if (error) {
      console.error("[Migration] Error checking database status:", error.message);
      return;
    }
    if (!existingQuizzes || existingQuizzes.length === 0) {
      console.log("[Migration] Supabase database is empty. Starting migration...");
      const idMapping = {
        "00000000-0000-4000-a000-000000000000": "00000000-0000-4000-a000-000000000000"
        // map default admin ID
      };
      const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers();
      const existingUserEmails = new Set(existingUsers.map((u) => u.email?.toLowerCase()));
      for (const user of existingUsers) {
        if (user.email) {
          idMapping[user.email.toLowerCase()] = user.id;
        }
      }
      for (const u of db.users || []) {
        const emailLower = u.email.toLowerCase();
        let finalId = idMapping[emailLower];
        if (!existingUserEmails.has(emailLower)) {
          console.log(`[Migration] Creating auth user: ${u.email}`);
          const { data: resUser, error: err } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: u.user_metadata
          });
          if (err) {
            console.error(`[Migration] Failed to create user ${u.email}:`, err.message);
            continue;
          }
          if (resUser?.user) {
            finalId = resUser.user.id;
          }
        }
        if (finalId) {
          idMapping[u.id] = finalId;
        }
      }
      console.log("[Migration] User mappings generated:", idMapping);
      const profilesToInsert = (db.profiles || []).map((p) => {
        const mappedId = idMapping[p.id];
        if (!mappedId) return null;
        return {
          id: mappedId,
          username: p.username,
          display_name: p.display_name,
          access_code: p.access_code,
          member1_name: p.member1_name || null,
          member2_name: p.member2_name || null,
          created_at: p.created_at
        };
      }).filter(Boolean);
      if (profilesToInsert.length > 0) {
        console.log(`[Migration] Migrating ${profilesToInsert.length} profiles...`);
        const { error: pErr } = await supabase.from("profiles").upsert(profilesToInsert);
        if (pErr) console.error("[Migration] Profile insert error:", pErr.message);
      }
      const rolesToInsert = (db.user_roles || []).map((r) => {
        const mappedUserId = idMapping[r.user_id];
        if (!mappedUserId) return null;
        return {
          user_id: mappedUserId,
          role: r.role
        };
      }).filter(Boolean);
      if (rolesToInsert.length > 0) {
        console.log(`[Migration] Migrating ${rolesToInsert.length} user roles...`);
        const { error: rErr } = await supabase.from("user_roles").upsert(rolesToInsert);
        if (rErr) console.error("[Migration] User roles insert error:", rErr.message);
      }
      if (db.quizzes && db.quizzes.length > 0) {
        console.log(`[Migration] Migrating ${db.quizzes.length} quizzes...`);
        const { error: qErr } = await supabase.from("quizzes").upsert(db.quizzes);
        if (qErr) console.error("[Migration] Quizzes insert error:", qErr.message);
      }
      if (db.questions && db.questions.length > 0) {
        console.log(`[Migration] Migrating ${db.questions.length} questions...`);
        const { error: questErr } = await supabase.from("questions").upsert(db.questions);
        if (questErr) console.error("[Migration] Questions insert error:", questErr.message);
      }
      console.log("[Migration] Database migration completed successfully!");
    } else {
      console.log("[Migration] Supabase already has data. Skipping migration.");
    }
  } catch (error) {
    console.error("[Migration] Migration exception occurred:", error.message || error);
  }
}
if (typeof window === "undefined") {
  setTimeout(() => {
    runMigrationsIfNeeded().catch(console.error);
  }, 2e3);
}
const db_server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  handleNewUserTrigger,
  readDb,
  runMigrationsIfNeeded,
  runQuery,
  runRpc,
  supabase,
  writeDb
}, Symbol.toStringTag, { value: "Module" }));
const executeDbQuery_createServerFn_handler = createServerRpc({
  id: "ee16594c9495053e88caba4f67eb34a8ef1d4f002cc94f9b9b7c16c09345de01",
  name: "executeDbQuery",
  filename: "src/lib/db.functions.ts"
}, (opts) => executeDbQuery.__executeServer(opts));
const executeDbQuery = createServerFn({
  method: "POST"
}).inputValidator((query) => query).handler(executeDbQuery_createServerFn_handler, async ({
  data: query
}) => {
  return runQuery(query);
});
const authSignIn_createServerFn_handler = createServerRpc({
  id: "1c1583497f995205ce5444e47a5be1195de5b3e97977272800e2c658d36b7d8d",
  name: "authSignIn",
  filename: "src/lib/db.functions.ts"
}, (opts) => authSignIn.__executeServer(opts));
const authSignIn = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(authSignIn_createServerFn_handler, async ({
  data
}) => {
  if (!supabase) {
    const db = (await Promise.resolve().then(() => db_server)).readDb();
    const email = data.email.trim().toLowerCase();
    const user = db.users.find((u) => u.email.trim().toLowerCase() === email);
    if (!user || user.password !== data.password_hash_or_code) {
      return {
        error: {
          message: "Invalid login credentials"
        }
      };
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
        created_at: user.created_at
      }
    };
    return {
      data: {
        session,
        user: session.user
      }
    };
  }
  try {
    const {
      data: authData,
      error
    } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password_hash_or_code
    });
    if (error) {
      return {
        error: {
          message: error.message
        }
      };
    }
    return {
      data: authData
    };
  } catch (err) {
    return {
      error: {
        message: err?.message || "Sign in failed"
      }
    };
  }
});
const authSignUp_createServerFn_handler = createServerRpc({
  id: "886e0c873e724d76d899cc855694d8c33146fd1b8e2ac9f23b1a66931b397673",
  name: "authSignUp",
  filename: "src/lib/db.functions.ts"
}, (opts) => authSignUp.__executeServer(opts));
const authSignUp = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(authSignUp_createServerFn_handler, async ({
  data
}) => {
  if (!supabase) {
    const db = (await Promise.resolve().then(() => db_server)).readDb();
    const email = data.email.trim().toLowerCase();
    const existing = db.users.find((u) => u.email.trim().toLowerCase() === email);
    if (existing) {
      return {
        error: {
          message: "User already exists"
        }
      };
    }
    const newUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password_hash_or_code,
      user_metadata: data.user_metadata || {},
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.push(newUser);
    const username = newUser.user_metadata?.username || newUser.email.split("@")[0];
    const displayName = newUser.user_metadata?.display_name || username;
    db.profiles.push({
      id: newUser.id,
      username,
      display_name: displayName,
      access_code: newUser.user_metadata?.username || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.user_roles.push({
      id: crypto.randomUUID(),
      user_id: newUser.id,
      role: "participant"
    });
    (await Promise.resolve().then(() => db_server)).writeDb(db);
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
        created_at: newUser.created_at
      }
    };
    return {
      data: {
        session,
        user: session.user
      }
    };
  }
  try {
    const {
      data: authData,
      error
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password_hash_or_code,
      options: {
        data: data.user_metadata || {}
      }
    });
    if (error) {
      return {
        error: {
          message: error.message
        }
      };
    }
    return {
      data: authData
    };
  } catch (err) {
    return {
      error: {
        message: err?.message || "Sign up failed"
      }
    };
  }
});
const authAdminCreateUser_createServerFn_handler = createServerRpc({
  id: "9773d916ab75e1e24ae151506e855ae3ec24ae23ec19cb66a92e9c3748294352",
  name: "authAdminCreateUser",
  filename: "src/lib/db.functions.ts"
}, (opts) => authAdminCreateUser.__executeServer(opts));
const authAdminCreateUser = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(authAdminCreateUser_createServerFn_handler, async ({
  data
}) => {
  if (!supabase) {
    const db = (await Promise.resolve().then(() => db_server)).readDb();
    const email = data.email.trim().toLowerCase();
    const existing = db.users.find((u) => u.email.trim().toLowerCase() === email);
    if (existing) {
      return {
        error: {
          message: "User already exists"
        }
      };
    }
    const newUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password_hash_or_code,
      user_metadata: data.user_metadata || {},
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.push(newUser);
    const username = newUser.user_metadata?.username || newUser.email.split("@")[0];
    const displayName = newUser.user_metadata?.display_name || username;
    db.profiles.push({
      id: newUser.id,
      username,
      display_name: displayName,
      access_code: newUser.user_metadata?.username || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.user_roles.push({
      id: crypto.randomUUID(),
      user_id: newUser.id,
      role: "participant"
    });
    (await Promise.resolve().then(() => db_server)).writeDb(db);
    return {
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          user_metadata: newUser.user_metadata
        }
      }
    };
  }
  try {
    const {
      data: authData,
      error
    } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password_hash_or_code,
      user_metadata: data.user_metadata || {},
      email_confirm: true
    });
    if (error) {
      return {
        error: {
          message: error.message
        }
      };
    }
    return {
      data: authData
    };
  } catch (err) {
    return {
      error: {
        message: err?.message || "Create user failed"
      }
    };
  }
});
const authAdminUpdateUserById_createServerFn_handler = createServerRpc({
  id: "6c80671492352a2b07bc7b386dbf5ed3ca3361ca641a56f7bf0a2f43481cc275",
  name: "authAdminUpdateUserById",
  filename: "src/lib/db.functions.ts"
}, (opts) => authAdminUpdateUserById.__executeServer(opts));
const authAdminUpdateUserById = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(authAdminUpdateUserById_createServerFn_handler, async ({
  data
}) => {
  if (!supabase) {
    const db = (await Promise.resolve().then(() => db_server)).readDb();
    const index = db.users.findIndex((u) => u.id === data.id);
    if (index === -1) {
      return {
        error: {
          message: "User not found"
        }
      };
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
    (await Promise.resolve().then(() => db_server)).writeDb(db);
    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        }
      }
    };
  }
  try {
    const updateData = {};
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;
    if (data.user_metadata) updateData.user_metadata = data.user_metadata;
    const {
      data: authData,
      error
    } = await supabase.auth.admin.updateUserById(data.id, updateData);
    if (error) {
      return {
        error: {
          message: error.message
        }
      };
    }
    return {
      data: authData
    };
  } catch (err) {
    return {
      error: {
        message: err?.message || "Update user failed"
      }
    };
  }
});
const authAdminDeleteUser_createServerFn_handler = createServerRpc({
  id: "25f44339869c58c98abe11b38ab52a8c0b4d1a17a986562cd25112353efcc0dc",
  name: "authAdminDeleteUser",
  filename: "src/lib/db.functions.ts"
}, (opts) => authAdminDeleteUser.__executeServer(opts));
const authAdminDeleteUser = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(authAdminDeleteUser_createServerFn_handler, async ({
  data
}) => {
  if (!supabase) {
    const db = (await Promise.resolve().then(() => db_server)).readDb();
    const index = db.users.findIndex((u) => u.id === data.id);
    if (index === -1) {
      return {
        error: {
          message: "User not found"
        }
      };
    }
    db.users.splice(index, 1);
    (await Promise.resolve().then(() => db_server)).writeDb(db);
    return {
      data: {
        user: null
      }
    };
  }
  try {
    const {
      error
    } = await supabase.auth.admin.deleteUser(data.id);
    if (error) {
      return {
        error: {
          message: error.message
        }
      };
    }
    return {
      data: {
        user: null
      }
    };
  } catch (err) {
    return {
      error: {
        message: err?.message || "Delete user failed"
      }
    };
  }
});
const executeDbRpc_createServerFn_handler = createServerRpc({
  id: "d4f5bd528da7e2de150be67a2d049f12582f4aa48ba4bcd8f9f9bbfcca5b281d",
  name: "executeDbRpc",
  filename: "src/lib/db.functions.ts"
}, (opts) => executeDbRpc.__executeServer(opts));
const executeDbRpc = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(executeDbRpc_createServerFn_handler, async ({
  data
}) => {
  return runRpc(data.name, data.args);
});
export {
  authAdminCreateUser_createServerFn_handler,
  authAdminDeleteUser_createServerFn_handler,
  authAdminUpdateUserById_createServerFn_handler,
  authSignIn_createServerFn_handler,
  authSignUp_createServerFn_handler,
  executeDbQuery_createServerFn_handler,
  executeDbRpc_createServerFn_handler
};
