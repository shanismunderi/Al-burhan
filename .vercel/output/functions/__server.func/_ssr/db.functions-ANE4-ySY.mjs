import { c as createServerRpc, r as runQuery, s as supabase, a as supabaseAdmin, b as runRpc } from "./db.server-DhEff3Y_.mjs";
import { a4 as createServerFn } from "./server-BoggyVwf.mjs";
import crypto from "crypto";
import "./index-bO39X1mA.mjs";
import "fs";
import "path";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "async_hooks";
import "stream";
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
    const db = (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).readDb();
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
    const db = (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).readDb();
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
    (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).writeDb(db);
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
    const db = (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).readDb();
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
    (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).writeDb(db);
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
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("[AuthAdmin] Service role key missing. Falling back to public signUp.");
      const {
        data: authData2,
        error: error2
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password_hash_or_code,
        options: {
          data: data.user_metadata || {}
        }
      });
      if (error2) {
        return {
          error: {
            message: error2.message
          }
        };
      }
      return {
        data: authData2
      };
    }
    const {
      data: authData,
      error
    } = await supabaseAdmin.auth.admin.createUser({
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
    const db = (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).readDb();
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
    (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).writeDb(db);
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
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to update other users' credentials.");
    }
    const updateData = {};
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;
    if (data.user_metadata) updateData.user_metadata = data.user_metadata;
    const {
      data: authData,
      error
    } = await supabaseAdmin.auth.admin.updateUserById(data.id, updateData);
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
    const db = (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).readDb();
    const index = db.users.findIndex((u) => u.id === data.id);
    if (index === -1) {
      return {
        error: {
          message: "User not found"
        }
      };
    }
    db.users.splice(index, 1);
    (await import("./db.server-DhEff3Y_.mjs").then((n) => n.d)).writeDb(db);
    return {
      data: {
        user: null
      }
    };
  }
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("[authAdminDeleteUser] SUPABASE_SERVICE_ROLE_KEY is missing. Skipping auth user deletion, database rows will still be deleted.");
      return {
        data: {
          user: null
        }
      };
    }
    const {
      error
    } = await supabaseAdmin.auth.admin.deleteUser(data.id);
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
