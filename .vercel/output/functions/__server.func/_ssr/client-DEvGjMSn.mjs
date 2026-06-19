import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CS0DRPDm.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const executeDbQuery = createServerFn({
  method: "POST"
}).inputValidator((query) => query).handler(createSsrRpc("ee16594c9495053e88caba4f67eb34a8ef1d4f002cc94f9b9b7c16c09345de01"));
const authSignIn = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("1c1583497f995205ce5444e47a5be1195de5b3e97977272800e2c658d36b7d8d"));
const authSignUp = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("886e0c873e724d76d899cc855694d8c33146fd1b8e2ac9f23b1a66931b397673"));
const authAdminCreateUser = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("9773d916ab75e1e24ae151506e855ae3ec24ae23ec19cb66a92e9c3748294352"));
const authAdminUpdateUserById = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("6c80671492352a2b07bc7b386dbf5ed3ca3361ca641a56f7bf0a2f43481cc275"));
const authAdminDeleteUser = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("25f44339869c58c98abe11b38ab52a8c0b4d1a17a986562cd25112353efcc0dc"));
const executeDbRpc = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(createSsrRpc("d4f5bd528da7e2de150be67a2d049f12582f4aa48ba4bcd8f9f9bbfcca5b281d"));
class MockQueryBuilder {
  query;
  constructor(table) {
    this.query = {
      table,
      action: "select",
      filters: []
    };
  }
  select(columns, options) {
    if (!["insert", "update", "delete", "upsert"].includes(this.query.action)) {
      this.query.action = "select";
    }
    this.query.selectColumns = columns;
    this.query.selectOptions = options;
    return this;
  }
  insert(data) {
    this.query.action = "insert";
    this.query.data = data;
    return this;
  }
  update(data) {
    this.query.action = "update";
    this.query.data = data;
    return this;
  }
  delete() {
    this.query.action = "delete";
    return this;
  }
  upsert(data, options) {
    this.query.action = "upsert";
    this.query.data = data;
    this.query.upsertOptions = options;
    return this;
  }
  eq(column, value) {
    this.query.filters.push({ type: "eq", column, value });
    return this;
  }
  neq(column, value) {
    this.query.filters.push({ type: "neq", column, value });
    return this;
  }
  in(column, value) {
    this.query.filters.push({ type: "in", column, value });
    return this;
  }
  not(column, operator, value) {
    this.query.filters.push({ type: "not", column, operator, value });
    return this;
  }
  order(column, options) {
    this.query.order = { column, ascending: options?.ascending !== false };
    return this;
  }
  limit(limit) {
    this.query.limit = limit;
    return this;
  }
  async maybeSingle() {
    const res = await this.execute();
    if (res.error) return { data: null, error: res.error };
    const data = res.data;
    return { data: Array.isArray(data) ? data[0] ?? null : data, error: null };
  }
  async single() {
    const res = await this.execute();
    if (res.error) return { data: null, error: res.error };
    const data = res.data;
    if (Array.isArray(data)) {
      if (data.length === 0) return { data: null, error: { message: "No rows found" } };
      return { data: data[0], error: null };
    }
    return { data, error: null };
  }
  async then(onfulfilled, onrejected) {
    try {
      const res = await this.execute();
      if (onfulfilled) return onfulfilled(res);
      return res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }
  async execute() {
    try {
      const res = await executeDbQuery({ data: this.query });
      return { data: res.data, count: res.count, error: res.error || null };
    } catch (err) {
      console.error("Database query failed:", err);
      return { data: null, error: { message: err?.message || "Query failed" } };
    }
  }
}
const authListeners = /* @__PURE__ */ new Set();
function triggerAuthChange(event, session) {
  for (const listener of authListeners) {
    try {
      listener(event, session);
    } catch (e) {
      console.error(e);
    }
  }
}
function getLocalSession() {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("sb-mock-session");
  return saved ? JSON.parse(saved) : null;
}
function setLocalSession(session) {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem("sb-mock-session", JSON.stringify(session));
  } else {
    localStorage.removeItem("sb-mock-session");
  }
}
const supabase = {
  from(table) {
    return new MockQueryBuilder(table);
  },
  async rpc(fnName, args) {
    try {
      const res = await executeDbRpc({ data: { name: fnName, args } });
      return { data: res.data, error: res.error || null };
    } catch (err) {
      console.error(`RPC ${fnName} failed:`, err);
      return { data: null, error: { message: err?.message || "RPC failed" } };
    }
  },
  channel(name) {
    return {
      on(event, filter, callback) {
        return this;
      },
      subscribe() {
        return this;
      }
    };
  },
  removeChannel(channel) {
    return;
  },
  auth: {
    async getSession() {
      const session = getLocalSession();
      return { data: { session }, error: null };
    },
    async signInWithPassword(credentials) {
      try {
        const res = await authSignIn({
          data: {
            email: credentials.email,
            password_hash_or_code: credentials.password
          }
        });
        if (res.error) {
          return { data: { session: null, user: null }, error: res.error };
        }
        setLocalSession(res.data.session);
        triggerAuthChange("SIGNED_IN", res.data.session);
        return { data: res.data, error: null };
      } catch (err) {
        return {
          data: { session: null, user: null },
          error: { message: err?.message || "Sign in failed" }
        };
      }
    },
    async signUp(credentials) {
      try {
        const res = await authSignUp({
          data: {
            email: credentials.email,
            password_hash_or_code: credentials.password,
            options: credentials.options
          }
        });
        if (res.error) {
          return { data: { session: null, user: null }, error: res.error };
        }
        setLocalSession(res.data.session);
        triggerAuthChange("SIGNED_IN", res.data.session);
        return { data: res.data, error: null };
      } catch (err) {
        return {
          data: { session: null, user: null },
          error: { message: err?.message || "Sign up failed" }
        };
      }
    },
    async signOut() {
      setLocalSession(null);
      triggerAuthChange("SIGNED_OUT", null);
      return { error: null };
    },
    onAuthStateChange(callback) {
      authListeners.add(callback);
      const session = getLocalSession();
      setTimeout(() => {
        callback("INITIAL_SESSION", session);
      }, 0);
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback);
            }
          }
        }
      };
    },
    admin: {
      async createUser(userData) {
        try {
          const res = await authAdminCreateUser({
            data: {
              email: userData.email,
              password_hash_or_code: userData.password,
              user_metadata: userData.user_metadata || {}
            }
          });
          if (res.error) return { data: { user: null }, error: res.error };
          return { data: res.data, error: null };
        } catch (err) {
          return { data: { user: null }, error: { message: err?.message || "Create user failed" } };
        }
      },
      async updateUserById(id, userData) {
        try {
          const res = await authAdminUpdateUserById({
            data: {
              id,
              email: userData.email,
              password: userData.password,
              user_metadata: userData.user_metadata
            }
          });
          if (res.error) return { data: { user: null }, error: res.error };
          return { data: res.data, error: null };
        } catch (err) {
          return { data: { user: null }, error: { message: err?.message || "Update user failed" } };
        }
      },
      async deleteUser(id) {
        try {
          const res = await authAdminDeleteUser({ data: { id } });
          if (res.error) return { data: { user: null }, error: res.error };
          return { data: { user: null }, error: null };
        } catch (err) {
          return { data: { user: null }, error: { message: err?.message || "Delete user failed" } };
        }
      }
    }
  }
};
export {
  createSsrRpc as c,
  supabase as s
};
