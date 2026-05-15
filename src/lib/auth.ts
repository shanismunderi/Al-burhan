import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

// Map a free-form username (e.g. "admin@burhan" or "quiz101") to a synthetic email.
export function usernameToEmail(input: string): string {
  const u = input.trim().toLowerCase();
  if (u.includes("@")) {
    const [local, domain] = u.split("@");
    if (domain.includes(".")) return u;
    return `${local}@${domain}.local`;
  }
  return `${u}@quiz.local`;
}

export async function signInWithUsername(username: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
}

export async function signOut() {
  await supabase.auth.signOut();
}

export type Role = "admin" | "participant" | null;

export interface AuthState {
  session: Session | null;
  user: User | null;
  role: Role;
  username: string | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadRole = async (uid: string) => {
      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("profiles").select("username").eq("id", uid).maybeSingle(),
      ]);
      if (!mounted) return;
      const r = roles?.find((x) => x.role === "admin") ? "admin" : roles?.[0]?.role ?? null;
      setRole((r as Role) ?? null);
      setUsername(profile?.username ?? null);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => loadRole(s.user.id), 0);
      } else {
        setRole(null);
        setUsername(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadRole(data.session.user.id).finally(() => mounted && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, role, username, loading };
}
