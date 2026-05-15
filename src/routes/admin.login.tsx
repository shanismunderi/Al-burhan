import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithUsername, useAuth } from "@/lib/auth";
import { seedAdmin } from "@/lib/admin.functions";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const seed = useServerFn(seedAdmin);
  const [username, setUsername] = useState("admin@burhan");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Bootstrap the admin account on first visit
    seed().catch(() => {});
  }, [seed]);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // Make sure admin account exists (idempotent)
    try { await seed(); } catch {}
    const { error } = await signInWithUsername(username, password);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome, admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--gradient-soft)" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-6"><Brand /></div>
        <div className="rounded-2xl bg-card border border-border p-8 shadow-[var(--shadow-leaf)]">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Admin area</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold">Administrator login</h1>
          <p className="text-sm text-muted-foreground mt-1">Use your admin credentials to access the control panel.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="u">Username</Label>
              <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="p">Password</Label>
              <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
          </form>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/login" className="hover:text-primary">← Participant login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
