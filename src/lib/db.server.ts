import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

const DB_FILE = path.join(process.cwd(), "db.json");

export function readDb(): any {
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

export function writeDb(db: any) {
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
          display_name: "Administrator",
        },
        created_at: new Date().toISOString(),
      },
    ],
    profiles: [
      {
        id: adminId,
        username: "admin@burhan",
        display_name: "Administrator",
        access_code: null,
        created_at: new Date().toISOString(),
      },
    ],
    user_roles: [
      {
        id: crypto.randomUUID(),
        user_id: adminId,
        role: "admin",
      },
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
        created_at: new Date().toISOString(),
      },
    ],
    questions: [],
    quiz_attempts: [],
    attempt_answers: [],
    cheat_events: [],
  };
}

export function handleNewUserTrigger(db: any, user: any) {
  // Kept for backward compatibility
}

export interface DBQuery {
  table: string;
  action: "select" | "insert" | "update" | "delete" | "upsert";
  selectColumns?: string;
  selectOptions?: { count?: string; head?: boolean };
  filters: Array<{ type: "eq" | "neq" | "in" | "not"; column: string; value: any; operator?: string }>;
  order?: { column: string; ascending: boolean };
  limit?: number;
  data?: any;
  upsertOptions?: any;
}

export async function runQuery(query: DBQuery): Promise<{ data: any; count?: number; error?: any }> {
  if (!supabase) {
    console.warn("Supabase client not initialized. Falling back to local db.json.");
    return runLocalQuery(query);
  }

  try {
    let q = supabase.from(query.table);
    let builder: any;

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

    if (query.limit !== undefined) {
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
  } catch (error: any) {
    console.error("runQuery exception:", error);
    return { data: null, error: { message: error.message } };
  }
}

export async function runRpc(name: string, args?: any): Promise<{ data: any; error?: any }> {
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
  } catch (error: any) {
    console.error("runRpc exception:", error);
    return { data: null, error: { message: error.message } };
  }
}

// Local fallback implementations (from original code)
function runLocalQuery(query: any): any {
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
      const { operator, value, column } = filter as any;
      if (operator === "is" && value === null) {
        filtered = filtered.filter((row) => row[column] !== null && row[column] !== undefined);
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
      if (valA === undefined || valA === null) return asc ? -1 : 1;
      if (valB === undefined || valB === null) return asc ? 1 : -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA - valB : valB - valA;
      }
      return asc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });
  }

  if (query.limit !== undefined) {
    filtered = filtered.slice(0, query.limit);
  }

  if (query.action === "select") {
    if (query.selectOptions?.head) return { data: [], count: totalCount };
    if (query.selectOptions?.count === "exact") return { data: filtered, count: totalCount };
    return { data: filtered };
  }

  if (query.action === "insert") {
    const items = Array.isArray(query.data) ? query.data : [query.data];
    const inserted: any[] = [];
    for (const item of items) {
      const newItem = {
        id: item.id || crypto.randomUUID(),
        created_at: item.created_at || new Date().toISOString(),
        ...item,
      };
      rows.push(newItem);
      inserted.push(newItem);
    }
    writeDb(db);
    return { data: Array.isArray(query.data) ? inserted : inserted[0] };
  }

  if (query.action === "update") {
    const updated: any[] = [];
    const filterIds = filtered.map((row) => row.id);
    for (let i = 0; i < rows.length; i++) {
      if (filterIds.includes(rows[i].id)) {
        rows[i] = {
          ...rows[i],
          ...query.data,
          updated_at: new Date().toISOString(),
        };
        updated.push(rows[i]);
      }
    }
    writeDb(db);
    return { data: updated };
  }

  if (query.action === "delete") {
    const filterIds = filtered.map((row) => row.id);
    db[query.table] = rows.filter((row: any) => !filterIds.includes(row.id));
    writeDb(db);
    return { data: rows.filter((row: any) => filterIds.includes(row.id)) };
  }

  if (query.action === "upsert") {
    const items = Array.isArray(query.data) ? query.data : [query.data];
    const upserted: any[] = [];
    for (const item of items) {
      let idx = -1;
      if (item.id) {
        idx = rows.findIndex((r: any) => r.id === item.id);
      }
      if (idx === -1 && query.table === "user_roles" && item.user_id && item.role) {
        idx = rows.findIndex((r: any) => r.user_id === item.user_id && r.role === item.role);
      }

      if (idx !== -1) {
        rows[idx] = { ...rows[idx], ...item, updated_at: new Date().toISOString() };
        upserted.push(rows[idx]);
      } else {
        const newItem = {
          id: item.id || crypto.randomUUID(),
          created_at: item.created_at || new Date().toISOString(),
          ...item,
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

function runLocalRpc(name: string, args?: any): any {
  const db = readDb();
  if (name === "admin_get_questions") {
    const quizId = args?._quiz_id;
    if (!quizId) return { data: [], error: { message: "quiz_id required" } };
    const questions = (db.questions ?? []).filter((q: any) => q.quiz_id === quizId);
    questions.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    return { data: questions };
  }

  if (name === "submit_quiz_attempt") {
    const attemptId = args?._attempt_id;
    const answers = args?._answers || {};
    const auto = !!args?._auto;

    if (!attemptId) return { data: null, error: { message: "attempt_id required" } };

    const attempts = db.quiz_attempts || [];
    const attemptIndex = attempts.findIndex((a: any) => a.id === attemptId);
    if (attemptIndex === -1) {
      return { data: null, error: { message: "Attempt not found" } };
    }
    const attempt = attempts[attemptIndex];
    if (attempt.status !== "in_progress") {
      return { data: attemptId };
    }

    const quiz = (db.quizzes || []).find((q: any) => q.id === attempt.quiz_id);
    const negativeMarks = quiz ? Number(quiz.negative_marks || 0) : 0;
    const questions = (db.questions || []).filter((q: any) => q.quiz_id === attempt.quiz_id);
    let correct = 0;
    let score = 0;
    let total = 0;

    if (!db.attempt_answers) db.attempt_answers = [];

    for (const q of questions) {
      total += 1;
      const sel = answers[q.id];
      if (sel === undefined || sel === null || sel === "") continue;

      const isCorrect = q.question_type === "mcq"
        ? sel === q.correct_answer
        : String(sel).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();

      if (isCorrect) {
        correct += 1;
        score += Number(q.marks || 0);
      } else {
        score -= negativeMarks;
      }

      const existingIdx = db.attempt_answers.findIndex(
        (ans: any) => ans.attempt_id === attemptId && ans.question_id === q.id,
      );

      if (existingIdx !== -1) {
        db.attempt_answers[existingIdx] = {
          ...db.attempt_answers[existingIdx],
          selected_answer: sel,
          is_correct: isCorrect,
          updated_at: new Date().toISOString(),
        };
      } else {
        db.attempt_answers.push({
          id: crypto.randomUUID(),
          attempt_id: attemptId,
          question_id: q.id,
          selected_answer: sel,
          is_correct: isCorrect,
          created_at: new Date().toISOString(),
        });
      }
    }

    if (score < 0) score = 0;
    attempt.status = auto ? "auto_submitted" : "submitted";
    attempt.submitted_at = new Date().toISOString();
    attempt.score = score;
    attempt.correct_count = correct;
    attempt.total_questions = Math.max(total, attempt.total_questions || 0);

    writeDb(db);
    return { data: attemptId };
  }

  return { data: null, error: { message: `RPC method ${name} not implemented` } };
}

// Auto-Migration Sync Logic
export async function runMigrationsIfNeeded() {
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

    // Check if target database is already populated
    const { data: existingQuizzes, error } = await supabase.from("quizzes").select("id").limit(1);
    if (error) {
      console.error("[Migration] Error checking database status:", error.message);
      return;
    }

    if (!existingQuizzes || existingQuizzes.length === 0) {
      console.log("[Migration] Supabase database is empty. Starting migration...");

      const idMapping: Record<string, string> = {
        "00000000-0000-4000-a000-000000000000": "00000000-0000-4000-a000-000000000000" // map default admin ID
      };

      // 1. Fetch existing users from Supabase to prevent duplicates
      const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers();
      const existingUserEmails = new Set(existingUsers.map(u => u.email?.toLowerCase()));

      for (const user of existingUsers) {
        if (user.email) {
          idMapping[user.email.toLowerCase()] = user.id;
        }
      }

      // 2. Create Users in Supabase Auth
      for (const u of db.users || []) {
        const emailLower = u.email.toLowerCase();
        let finalId = idMapping[emailLower];

        if (!existingUserEmails.has(emailLower)) {
          console.log(`[Migration] Creating auth user: ${u.email}`);
          const { data: resUser, error: err } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true,
            user_metadata: u.user_metadata,
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

      // 3. Migrate Profiles
      const profilesToInsert = (db.profiles || [])
        .map((p: any) => {
          const mappedId = idMapping[p.id];
          if (!mappedId) return null;
          return {
            id: mappedId,
            username: p.username,
            display_name: p.display_name,
            access_code: p.access_code,
            member1_name: p.member1_name || null,
            member2_name: p.member2_name || null,
            created_at: p.created_at,
          };
        })
        .filter(Boolean);

      if (profilesToInsert.length > 0) {
        console.log(`[Migration] Migrating ${profilesToInsert.length} profiles...`);
        const { error: pErr } = await supabase.from("profiles").upsert(profilesToInsert);
        if (pErr) console.error("[Migration] Profile insert error:", pErr.message);
      }

      // 4. Migrate User Roles
      const rolesToInsert = (db.user_roles || [])
        .map((r: any) => {
          const mappedUserId = idMapping[r.user_id];
          if (!mappedUserId) return null;
          return {
            user_id: mappedUserId,
            role: r.role,
          };
        })
        .filter(Boolean);

      if (rolesToInsert.length > 0) {
        console.log(`[Migration] Migrating ${rolesToInsert.length} user roles...`);
        const { error: rErr } = await supabase.from("user_roles").upsert(rolesToInsert);
        if (rErr) console.error("[Migration] User roles insert error:", rErr.message);
      }

      // 5. Migrate Quizzes
      if (db.quizzes && db.quizzes.length > 0) {
        console.log(`[Migration] Migrating ${db.quizzes.length} quizzes...`);
        const { error: qErr } = await supabase.from("quizzes").upsert(db.quizzes);
        if (qErr) console.error("[Migration] Quizzes insert error:", qErr.message);
      }

      // 6. Migrate Questions
      if (db.questions && db.questions.length > 0) {
        console.log(`[Migration] Migrating ${db.questions.length} questions...`);
        const { error: questErr } = await supabase.from("questions").upsert(db.questions);
        if (questErr) console.error("[Migration] Questions insert error:", questErr.message);
      }

      console.log("[Migration] Database migration completed successfully!");
    } else {
      console.log("[Migration] Supabase already has data. Skipping migration.");
    }
  } catch (error: any) {
    console.error("[Migration] Migration exception occurred:", error.message || error);
  }
}

// Trigger migration on backend boot
if (typeof window === "undefined") {
  setTimeout(() => {
    runMigrationsIfNeeded().catch(console.error);
  }, 2000);
}
