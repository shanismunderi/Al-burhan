import fs from "fs";
import path from "path";
import crypto from "crypto";

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
        created_at: new Date().toISOString()
      }
    ],
    profiles: [
      {
        id: adminId,
        username: "admin@burhan",
        display_name: "Administrator",
        access_code: null,
        created_at: new Date().toISOString()
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
        created_at: new Date().toISOString()
      }
    ],
    questions: [],
    quiz_attempts: [],
    attempt_answers: [],
    cheat_events: []
  };
}

export function readDb(): any {
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

export function writeDb(db: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing db.json:", error);
  }
}

export function handleNewUserTrigger(db: any, user: any) {
  const profileId = user.id;
  const username = user.user_metadata?.username || user.email.split("@")[0];
  const displayName = user.user_metadata?.display_name || username;

  const existingProfile = db.profiles.find((p: any) => p.id === profileId);
  if (!existingProfile) {
    db.profiles.push({
      id: profileId,
      username,
      display_name: displayName,
      access_code: user.user_metadata?.username || null,
      created_at: new Date().toISOString()
    });
  }

  const existingRole = db.user_roles.find((r: any) => r.user_id === profileId && r.role === "participant");
  if (!existingRole) {
    db.user_roles.push({
      id: crypto.randomUUID(),
      user_id: profileId,
      role: "participant"
    });
  }
}

export interface DBQuery {
  table: string;
  action: 'select' | 'insert' | 'update' | 'delete' | 'upsert';
  selectColumns?: string;
  selectOptions?: { count?: string; head?: boolean };
  filters: Array<{ type: 'eq' | 'neq' | 'in'; column: string; value: any }>;
  order?: { column: string; ascending: boolean };
  limit?: number;
  data?: any;
}

export function runQuery(query: DBQuery): { data: any; count?: number; error?: any } {
  const db = readDb();
  if (!db[query.table]) {
    db[query.table] = [];
  }
  const rows = db[query.table];

  // Apply filters
  let filtered = [...rows];
  for (const filter of query.filters) {
    if (filter.type === 'eq') {
      filtered = filtered.filter(row => row[filter.column] === filter.value);
    } else if (filter.type === 'neq') {
      filtered = filtered.filter(row => row[filter.column] !== filter.value);
    } else if (filter.type === 'in') {
      if (Array.isArray(filter.value)) {
        filtered = filtered.filter(row => filter.value.includes(row[filter.column]));
      }
    } else if (filter.type === 'not') {
      const { operator, value, column } = filter as any;
      if (operator === 'is' && value === null) {
        filtered = filtered.filter(row => row[column] !== null && row[column] !== undefined);
      } else {
        filtered = filtered.filter(row => row[column] !== value);
      }
    }
  }

  const totalCount = filtered.length;

  // Apply ordering
  if (query.order) {
    const col = query.order.column;
    const asc = query.order.ascending;
    filtered.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      
      if (valA === undefined || valA === null) return asc ? -1 : 1;
      if (valB === undefined || valB === null) return asc ? 1 : -1;

      // Handle numbers or date strings
      if (typeof valA === "number" && typeof valB === "number") {
        return asc ? valA - valB : valB - valA;
      }
      valA = String(valA);
      valB = String(valB);
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  // Apply limit
  if (query.limit !== undefined) {
    filtered = filtered.slice(0, query.limit);
  }

  if (query.action === 'select') {
    if (query.selectOptions?.head) {
      return { data: [], count: totalCount };
    }
    if (query.selectOptions?.count === 'exact') {
      return { data: filtered, count: totalCount };
    }
    return { data: filtered };
  }

  if (query.action === 'insert') {
    const itemsToInsert = Array.isArray(query.data) ? query.data : [query.data];
    const inserted: any[] = [];
    for (const item of itemsToInsert) {
      const newItem = {
        id: item.id || crypto.randomUUID(),
        created_at: item.created_at || new Date().toISOString(),
        ...item
      };
      rows.push(newItem);
      inserted.push(newItem);
    }
    writeDb(db);
    return { data: Array.isArray(query.data) ? inserted : inserted[0] };
  }

  if (query.action === 'update') {
    const updated: any[] = [];
    const filterIds = filtered.map(row => row.id);
    for (let i = 0; i < rows.length; i++) {
      if (filterIds.includes(rows[i].id)) {
        rows[i] = {
          ...rows[i],
          ...query.data,
          updated_at: new Date().toISOString()
        };
        updated.push(rows[i]);
      }
    }
    writeDb(db);
    return { data: updated };
  }

  if (query.action === 'delete') {
    const filterIds = filtered.map(row => row.id);
    const remaining = rows.filter((row: any) => !filterIds.includes(row.id));
    const deleted = rows.filter((row: any) => filterIds.includes(row.id));
    db[query.table] = remaining;
    writeDb(db);
    return { data: deleted };
  }

  if (query.action === 'upsert') {
    const itemsToUpsert = Array.isArray(query.data) ? query.data : [query.data];
    const upserted: any[] = [];
    for (const item of itemsToUpsert) {
      let existingIndex = -1;
      
      // Try finding by id
      if (item.id) {
        existingIndex = rows.findIndex((row: any) => row.id === item.id);
      }
      
      // If not found and it's user_roles, try user_id + role unique constraint
      if (existingIndex === -1 && query.table === 'user_roles' && item.user_id && item.role) {
        existingIndex = rows.findIndex((row: any) => row.user_id === item.user_id && row.role === item.role);
      }

      if (existingIndex !== -1) {
        rows[existingIndex] = {
          ...rows[existingIndex],
          ...item,
          updated_at: new Date().toISOString()
        };
        upserted.push(rows[existingIndex]);
      } else {
        const newItem = {
          id: item.id || crypto.randomUUID(),
          created_at: item.created_at || new Date().toISOString(),
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

export function runRpc(name: string, args?: any): { data: any; error?: any } {
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
    
    if (!db.attempt_answers) {
      db.attempt_answers = [];
    }
    
    for (const q of questions) {
      total += 1;
      const sel = answers[q.id];
      if (sel === undefined || sel === null || sel === "") {
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
        
        const existingIdx = db.attempt_answers.findIndex((ans: any) => ans.attempt_id === attemptId && ans.question_id === q.id);
        if (existingIdx !== -1) {
          db.attempt_answers[existingIdx] = {
            ...db.attempt_answers[existingIdx],
            selected_answer: sel,
            is_correct: isCorrect,
            updated_at: new Date().toISOString()
          };
        } else {
          db.attempt_answers.push({
            id: crypto.randomUUID(),
            attempt_id: attemptId,
            question_id: q.id,
            selected_answer: sel,
            is_correct: isCorrect,
            created_at: new Date().toISOString()
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
        
        const existingIdx = db.attempt_answers.findIndex((ans: any) => ans.attempt_id === attemptId && ans.question_id === q.id);
        if (existingIdx !== -1) {
          db.attempt_answers[existingIdx] = {
            ...db.attempt_answers[existingIdx],
            selected_answer: sel,
            is_correct: isCorrect,
            updated_at: new Date().toISOString()
          };
        } else {
          db.attempt_answers.push({
            id: crypto.randomUUID(),
            attempt_id: attemptId,
            question_id: q.id,
            selected_answer: sel,
            is_correct: isCorrect,
            created_at: new Date().toISOString()
          });
        }
      } else {
        const existingIdx = db.attempt_answers.findIndex((ans: any) => ans.attempt_id === attemptId && ans.question_id === q.id);
        if (existingIdx !== -1) {
          db.attempt_answers[existingIdx] = {
            ...db.attempt_answers[existingIdx],
            selected_answer: sel,
            updated_at: new Date().toISOString()
          };
        } else {
          db.attempt_answers.push({
            id: crypto.randomUUID(),
            attempt_id: attemptId,
            question_id: q.id,
            selected_answer: sel,
            is_correct: null,
            created_at: new Date().toISOString()
          });
        }
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
