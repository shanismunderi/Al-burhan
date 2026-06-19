import { c as createServerRpc } from "./createServerRpc-BwTTfrtZ.mjs";
import { a as createServerFn } from "./server-CN8XglyB.mjs";
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
const DB_FILE = path.join(process.cwd(), "db.json");
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
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const db = getInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
      return db;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return getInitialDb();
  }
}
function writeDb(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing db.json:", error);
  }
}
function handleNewUserTrigger(db, user) {
  const profileId = user.id;
  const username = user.user_metadata?.username || user.email.split("@")[0];
  const displayName = user.user_metadata?.display_name || username;
  const existingProfile = db.profiles.find((p) => p.id === profileId);
  if (!existingProfile) {
    db.profiles.push({
      id: profileId,
      username,
      display_name: displayName,
      access_code: user.user_metadata?.username || null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  const existingRole = db.user_roles.find(
    (r) => r.user_id === profileId && r.role === "participant"
  );
  if (!existingRole) {
    db.user_roles.push({
      id: crypto.randomUUID(),
      user_id: profileId,
      role: "participant"
    });
  }
}
function runQuery(query) {
  const db = readDb();
  if (!db[query.table]) {
    db[query.table] = [];
  }
  const rows = db[query.table];
  let filtered = [...rows];
  for (const filter of query.filters) {
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
      valA = String(valA);
      valB = String(valB);
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }
  if (query.limit !== void 0) {
    filtered = filtered.slice(0, query.limit);
  }
  if (query.action === "select") {
    if (query.selectOptions?.head) {
      return { data: [], count: totalCount };
    }
    if (query.selectOptions?.count === "exact") {
      return { data: filtered, count: totalCount };
    }
    return { data: filtered };
  }
  if (query.action === "insert") {
    const itemsToInsert = Array.isArray(query.data) ? query.data : [query.data];
    const inserted = [];
    for (const item of itemsToInsert) {
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
    const remaining = rows.filter((row) => !filterIds.includes(row.id));
    const deleted = rows.filter((row) => filterIds.includes(row.id));
    db[query.table] = remaining;
    writeDb(db);
    return { data: deleted };
  }
  if (query.action === "upsert") {
    const itemsToUpsert = Array.isArray(query.data) ? query.data : [query.data];
    const upserted = [];
    for (const item of itemsToUpsert) {
      let existingIndex = -1;
      if (item.id) {
        existingIndex = rows.findIndex((row) => row.id === item.id);
      }
      if (existingIndex === -1 && query.table === "user_roles" && item.user_id && item.role) {
        existingIndex = rows.findIndex(
          (row) => row.user_id === item.user_id && row.role === item.role
        );
      }
      if (existingIndex !== -1) {
        rows[existingIndex] = {
          ...rows[existingIndex],
          ...item,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        upserted.push(rows[existingIndex]);
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
function runRpc(name, args) {
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
    if (!db.attempt_answers) {
      db.attempt_answers = [];
    }
    for (const q of questions) {
      total += 1;
      const sel = answers[q.id];
      if (sel === void 0 || sel === null || sel === "") {
        continue;
      }
      if (q.question_type === "mcq") {
        const isCorrect = sel === q.correct_answer;
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
      } else if (q.question_type === "one_word") {
        const userAns = String(sel || "").trim().toLowerCase();
        const correctAns = String(q.correct_answer || "").trim().toLowerCase();
        const isCorrect = userAns === correctAns;
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
      } else {
        const existingIdx = db.attempt_answers.findIndex(
          (ans) => ans.attempt_id === attemptId && ans.question_id === q.id
        );
        if (existingIdx !== -1) {
          db.attempt_answers[existingIdx] = {
            ...db.attempt_answers[existingIdx],
            selected_answer: sel,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          };
        } else {
          db.attempt_answers.push({
            id: crypto.randomUUID(),
            attempt_id: attemptId,
            question_id: q.id,
            selected_answer: sel,
            is_correct: null,
            created_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
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
  const db = readDb();
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
  const db = readDb();
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
  handleNewUserTrigger(db, newUser);
  writeDb(db);
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
  const db = readDb();
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
  handleNewUserTrigger(db, newUser);
  writeDb(db);
  return {
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        user_metadata: newUser.user_metadata
      }
    }
  };
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
  const db = readDb();
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
  writeDb(db);
  return {
    data: {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    }
  };
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
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === data.id);
  if (index === -1) {
    return {
      error: {
        message: "User not found"
      }
    };
  }
  db.users.splice(index, 1);
  writeDb(db);
  return {
    data: {
      user: null
    }
  };
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
