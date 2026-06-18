import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef, createContext, useContext, createElement } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { formatDisplayName } from "./utils";

// Admin uses username "admin@burhan" -> "admin@burhan.local"
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

// Candidate login by access code only
export async function signInWithCode(code: string) {
  const c = code.trim().toUpperCase();
  const email = `code-${c.toLowerCase()}@quiz.local`;
  return supabase.auth.signInWithPassword({ email, password: c });
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
  member1: string | null;
  member2: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  role: null,
  username: null,
  member1: null,
  member2: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [member1, setMember1] = useState<string | null>(null);
  const [member2, setMember2] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUserRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleUserChange = async (user: User | null) => {
      const uid = user?.id ?? null;
      console.log("[AuthProvider] handleUserChange: uid =", uid, "current =", currentUserRef.current);
      
      // If the user hasn't changed, keep current state and avoid redundant loading
      if (uid && uid === currentUserRef.current) {
        console.log("[AuthProvider] handleUserChange: no change, returning");
        return;
      }
      
      currentUserRef.current = uid;
      
      if (uid) {
        setLoading(true);
        try {
          console.log("[AuthProvider] Fetching role and profile for uid:", uid);
          const [{ data: roles }, { data: profile }] = await Promise.all([
            supabase.from("user_roles").select("role").eq("user_id", uid),
            supabase.from("profiles").select("username, display_name, member1_name, member2_name").eq("id", uid).maybeSingle(),
          ]);
          console.log("[AuthProvider] Fetched: roles =", roles, "profile =", profile);
          
          if (!mounted) {
            console.log("[AuthProvider] handleUserChange: not mounted, returning");
            return;
          }
          if (currentUserRef.current !== uid) {
            console.log("[AuthProvider] handleUserChange: uid changed, returning");
            return;
          }
          
          const r = roles?.find((x: any) => x.role === "admin") ? "admin" : roles?.[0]?.role ?? null;
          console.log("[AuthProvider] Resolved role:", r);
          setRole((r as Role) ?? null);
          const p: any = profile;
          setUsername(formatDisplayName(p?.display_name, p?.username) || null);
          setMember1(p?.member1_name ?? null);
          setMember2(p?.member2_name ?? null);
        } catch (error) {
          console.error("[AuthProvider] Failed to load user info:", error);
        } finally {
          if (mounted && currentUserRef.current === uid) {
            console.log("[AuthProvider] Setting loading to false");
            setLoading(false);
          }
        }
      } else {
        console.log("[AuthProvider] No uid, clearing state");
        setRole(null);
        setUsername(null);
        setMember1(null);
        setMember2(null);
        setLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      handleUserChange(s?.user ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      handleUserChange(data.session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return createElement(
    AuthContext.Provider,
    { value: { session, user: session?.user ?? null, role, username, member1, member2, loading } },
    children
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
