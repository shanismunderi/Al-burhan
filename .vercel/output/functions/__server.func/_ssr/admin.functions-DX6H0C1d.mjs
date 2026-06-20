import { c as createServerRpc } from "./createServerRpc-oOirxw6_.mjs";
import { a5 as createServerFn } from "./server-Ch0vJZt1.mjs";
import { s as supabase } from "./client-CE4Kzw5M.mjs";
import { s as stringType, o as objectType, n as numberType } from "./types-BoWyrJuk.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const supabaseAdmin = supabase;
const ADMIN_USERNAME = "admin@burhan";
const ADMIN_PASSWORD = "burhan@540";
const ADMIN_EMAIL = "admin@burhan.local";
const seedAdmin_createServerFn_handler = createServerRpc({
  id: "9b0f428ff611b1c405020e7e66d720a4bd80c1126fdb00280d5026c9fcb82e92",
  name: "seedAdmin",
  filename: "src/lib/admin.functions.ts"
}, (opts) => seedAdmin.__executeServer(opts));
const seedAdmin = createServerFn({
  method: "POST"
}).handler(seedAdmin_createServerFn_handler, async () => {
  const {
    data: existing
  } = await supabaseAdmin.from("profiles").select("id").eq("username", ADMIN_USERNAME).maybeSingle();
  if (existing?.id) {
    await supabaseAdmin.from("user_roles").upsert({
      user_id: existing.id,
      role: "admin"
    }, {
      onConflict: "user_id,role"
    });
    return {
      ok: true,
      created: false
    };
  }
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      username: ADMIN_USERNAME,
      display_name: "Administrator"
    }
  });
  if (error || !created.user) {
    throw new Error(error?.message ?? "Failed to seed admin");
  }
  await supabaseAdmin.from("user_roles").upsert({
    user_id: created.user.id,
    role: "admin"
  }, {
    onConflict: "user_id,role"
  });
  await supabaseAdmin.from("user_roles").delete().eq("user_id", created.user.id).eq("role", "participant");
  return {
    ok: true,
    created: true
  };
});
function generateCode(len = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
function emailForCode(code) {
  return `code-${code.toLowerCase()}@quiz.local`;
}
const accessCodeSchema = stringType().min(4).max(16).regex(/^[A-Z0-9]+$/, "Use A–Z and 0–9 only");
const createParticipantSchema = objectType({
  member1_name: stringType().min(1).max(120),
  member2_name: stringType().min(1).max(120),
  access_code: stringType().optional()
});
const createParticipant_createServerFn_handler = createServerRpc({
  id: "9989dc1615c9fc2591a13f9bc19a82bf76b73e03a4bd36664323a99403b6d314",
  name: "createParticipant",
  filename: "src/lib/admin.functions.ts"
}, (opts) => createParticipant.__executeServer(opts));
const createParticipant = createServerFn({
  method: "POST"
}).inputValidator((d) => {
  const parsed = createParticipantSchema.safeParse(d);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input data");
  }
  return parsed.data;
}).handler(createParticipant_createServerFn_handler, async ({
  data
}) => {
  const m1 = data.member1_name.trim();
  const m2 = data.member2_name.trim();
  const teamName = `${m1} & ${m2}`;
  let code = (data.access_code ?? "").trim().toUpperCase();
  if (code) {
    const parsed = accessCodeSchema.safeParse(code);
    if (!parsed.success) {
      throw new Error(parsed.error.errors[0]?.message || "Invalid access code format");
    }
    const {
      data: clash
    } = await supabaseAdmin.from("profiles").select("id").eq("access_code", code).maybeSingle();
    if (clash) throw new Error("That access code is already in use — pick another.");
  } else {
    code = generateCode();
    for (let i = 0; i < 5; i++) {
      const {
        data: clash
      } = await supabaseAdmin.from("profiles").select("id").eq("access_code", code).maybeSingle();
      if (!clash) break;
      code = generateCode();
    }
  }
  const email = emailForCode(code);
  const password = code;
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username: code,
      display_name: teamName
    }
  });
  if (error || !created.user) {
    throw new Error(error?.message ?? "Failed to create team");
  }
  const {
    error: updateError
  } = await supabaseAdmin.from("profiles").update({
    access_code: code,
    display_name: teamName,
    username: code,
    member1_name: m1,
    member2_name: m2
  }).eq("id", created.user.id);
  if (updateError) {
    throw new Error(updateError.message ?? "Failed to update profile");
  }
  return {
    ok: true,
    user_id: created.user.id,
    access_code: code,
    display_name: teamName
  };
});
const updateAccessCode_createServerFn_handler = createServerRpc({
  id: "2fc3d0678c31e1968563f9e2fd85c10e9366fde8c2f17ea546ae46d4afaf8a0a",
  name: "updateAccessCode",
  filename: "src/lib/admin.functions.ts"
}, (opts) => updateAccessCode.__executeServer(opts));
const updateAccessCode = createServerFn({
  method: "POST"
}).inputValidator((d) => {
  const parsed = objectType({
    user_id: stringType().uuid(),
    access_code: accessCodeSchema
  }).safeParse(d);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input data");
  }
  return parsed.data;
}).handler(updateAccessCode_createServerFn_handler, async ({
  data
}) => {
  const code = data.access_code.toUpperCase();
  const {
    data: clash
  } = await supabaseAdmin.from("profiles").select("id").eq("access_code", code).maybeSingle();
  if (clash && clash.id !== data.user_id) {
    throw new Error("That access code is already in use.");
  }
  const newEmail = emailForCode(code);
  const {
    error: authErr
  } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
    email: newEmail,
    password: code,
    email_confirm: true,
    user_metadata: {
      username: code
    }
  });
  if (authErr) throw new Error(authErr.message);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    access_code: code,
    username: code
  }).eq("id", data.user_id);
  if (error) throw new Error(error.message);
  return {
    ok: true,
    access_code: code
  };
});
const deleteParticipant_createServerFn_handler = createServerRpc({
  id: "d9912b15e1ea1341d2ec4534b60682878ef88a68ddd80df45fbcd1d9be5ac155",
  name: "deleteParticipant",
  filename: "src/lib/admin.functions.ts"
}, (opts) => deleteParticipant.__executeServer(opts));
const deleteParticipant = createServerFn({
  method: "POST"
}).inputValidator((d) => objectType({
  user_id: stringType().uuid()
}).parse(d)).handler(deleteParticipant_createServerFn_handler, async ({
  data
}) => {
  const {
    error: authError
  } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("id").eq("id", data.user_id).maybeSingle();
  if (profile) {
    const {
      error: cheatErr
    } = await supabaseAdmin.from("cheat_events").delete().eq("user_id", data.user_id);
    if (cheatErr) console.warn("Failed to delete cheat events:", cheatErr.message);
    const {
      data: attempts
    } = await supabaseAdmin.from("quiz_attempts").select("id").eq("user_id", data.user_id);
    if (attempts && attempts.length > 0) {
      const attemptIds = attempts.map((a) => a.id);
      await supabaseAdmin.from("attempt_answers").delete().in("attempt_id", attemptIds);
      await supabaseAdmin.from("quiz_attempts").delete().in("id", attemptIds);
    }
    const {
      error: rolesErr
    } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    if (rolesErr) console.warn("Failed to delete user roles:", rolesErr.message);
    const {
      error: profileErr
    } = await supabaseAdmin.from("profiles").delete().eq("id", data.user_id);
    if (profileErr) throw new Error(`Failed to delete profile: ${profileErr.message}`);
  }
  return {
    ok: true
  };
});
const gradeAnswer_createServerFn_handler = createServerRpc({
  id: "e2f1499293b2618cb12a4927c2a42fb831523244ae9aa3d21e29b0894de34e51",
  name: "gradeAnswer",
  filename: "src/lib/admin.functions.ts"
}, (opts) => gradeAnswer.__executeServer(opts));
const gradeAnswer = createServerFn({
  method: "POST"
}).inputValidator((d) => objectType({
  answer_id: stringType().uuid(),
  manual_score: numberType().min(0).max(1e3)
}).parse(d)).handler(gradeAnswer_createServerFn_handler, async ({
  data
}) => {
  const {
    error
  } = await supabaseAdmin.from("attempt_answers").update({
    manual_score: data.manual_score
  }).eq("id", data.answer_id);
  if (error) throw new Error(error.message);
  const {
    data: ans
  } = await supabaseAdmin.from("attempt_answers").select("attempt_id").eq("id", data.answer_id).maybeSingle();
  if (ans?.attempt_id) {
    const {
      data: all
    } = await supabaseAdmin.from("attempt_answers").select("is_correct, manual_score, question_id").eq("attempt_id", ans.attempt_id);
    const qIds = (all ?? []).map((a) => a.question_id);
    const {
      data: qs
    } = await supabaseAdmin.from("questions").select("id, marks, question_type").in("id", qIds.length ? qIds : ["00000000-0000-0000-0000-000000000000"]);
    const qMap = Object.fromEntries((qs ?? []).map((q) => [q.id, q]));
    let score = 0;
    let correct = 0;
    (all ?? []).forEach((a) => {
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
    await supabaseAdmin.from("quiz_attempts").update({
      score,
      correct_count: correct
    }).eq("id", ans.attempt_id);
  }
  return {
    ok: true
  };
});
export {
  createParticipant_createServerFn_handler,
  deleteParticipant_createServerFn_handler,
  gradeAnswer_createServerFn_handler,
  seedAdmin_createServerFn_handler,
  updateAccessCode_createServerFn_handler
};
