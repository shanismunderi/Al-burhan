import {
  executeDbQuery,
  authSignIn,
  authSignUp,
  authAdminCreateUser,
  authAdminUpdateUserById,
  authAdminDeleteUser,
  executeDbRpc
} from "@/lib/db.functions";

class MockQueryBuilder {
  private query: any;

  constructor(table: string) {
    this.query = {
      table,
      action: 'select',
      filters: []
    };
  }

  select(columns?: string, options?: any) {
    if (!['insert', 'update', 'delete', 'upsert'].includes(this.query.action)) {
      this.query.action = 'select';
    }
    this.query.selectColumns = columns;
    this.query.selectOptions = options;
    return this;
  }

  insert(data: any) {
    this.query.action = 'insert';
    this.query.data = data;
    return this;
  }

  update(data: any) {
    this.query.action = 'update';
    this.query.data = data;
    return this;
  }

  delete() {
    this.query.action = 'delete';
    return this;
  }

  upsert(data: any, options?: any) {
    this.query.action = 'upsert';
    this.query.data = data;
    this.query.upsertOptions = options;
    return this;
  }

  eq(column: string, value: any) {
    this.query.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column: string, value: any) {
    this.query.filters.push({ type: 'neq', column, value });
    return this;
  }

  in(column: string, value: any) {
    this.query.filters.push({ type: 'in', column, value });
    return this;
  }

  not(column: string, operator: string, value: any) {
    this.query.filters.push({ type: 'not', column, operator, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.query.order = { column, ascending: options?.ascending !== false };
    return this;
  }

  limit(limit: number) {
    this.query.limit = limit;
    return this;
  }

  async maybeSingle() {
    const res = await this.execute();
    if (res.error) return { data: null, error: res.error };
    const data = res.data;
    return { data: Array.isArray(data) ? (data[0] ?? null) : data, error: null };
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

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      if (onfulfilled) return onfulfilled(res);
      return res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute() {
    try {
      const res = await executeDbQuery({ data: this.query });
      return { data: res.data, count: res.count, error: res.error || null };
    } catch (err: any) {
      console.error("Database query failed:", err);
      return { data: null, error: { message: err?.message || "Query failed" } };
    }
  }
}

const authListeners = new Set<(event: string, session: any) => void>();

function triggerAuthChange(event: string, session: any) {
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

function setLocalSession(session: any) {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem("sb-mock-session", JSON.stringify(session));
  } else {
    localStorage.removeItem("sb-mock-session");
  }
}

export const supabase = {
  from(table: string) {
    return new MockQueryBuilder(table);
  },

  async rpc(fnName: string, args?: any) {
    try {
      const res = await executeDbRpc({ data: { name: fnName, args } });
      return { data: res.data, error: res.error || null };
    } catch (err: any) {
      console.error(`RPC ${fnName} failed:`, err);
      return { data: null, error: { message: err?.message || "RPC failed" } };
    }
  },

  channel(name: string) {
    return {
      on(event: string, filter: any, callback: any) {
        return this;
      },
      subscribe() {
        return this;
      }
    };
  },

  removeChannel(channel: any) {
    return;
  },

  auth: {
    async getSession() {
      const session = getLocalSession();
      return { data: { session }, error: null };
    },

    async signInWithPassword(credentials: any) {
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
      } catch (err: any) {
        return { data: { session: null, user: null }, error: { message: err?.message || "Sign in failed" } };
      }
    },

    async signUp(credentials: any) {
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
      } catch (err: any) {
        return { data: { session: null, user: null }, error: { message: err?.message || "Sign up failed" } };
      }
    },

    async signOut() {
      setLocalSession(null);
      triggerAuthChange("SIGNED_OUT", null);
      return { error: null };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
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
      async createUser(userData: any) {
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
        } catch (err: any) {
          return { data: { user: null }, error: { message: err?.message || "Create user failed" } };
        }
      },

      async updateUserById(id: string, userData: any) {
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
        } catch (err: any) {
          return { data: { user: null }, error: { message: err?.message || "Update user failed" } };
        }
      },

      async deleteUser(id: string) {
        try {
          const res = await authAdminDeleteUser({ data: { id } });
          if (res.error) return { data: { user: null }, error: res.error };
          return { data: { user: null }, error: null };
        } catch (err: any) {
          return { data: { user: null }, error: { message: err?.message || "Delete user failed" } };
        }
      }
    }
  }
};
