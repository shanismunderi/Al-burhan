import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCode, useAuth } from "@/lib/auth";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && role) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    const { error } = await signInWithCode(code);
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-soft)" }}>
      <div className="hidden lg:flex flex-1 p-12 flex-col justify-between" style={{ background: "var(--gradient-leaf)" }}>
        <Brand />
        <div className="text-primary-foreground max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Take your exam.<br />Stay focused.</h2>
          <p className="mt-4 opacity-90">Enter the access code your administrator gave you. The exam starts in fullscreen mode.</p>
        </div>
        <div className="text-primary-foreground/70 text-xs">© QuizGreen</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Brand /></div>
          <div className="flex items-center gap-2 text-primary">
            <KeyRound className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Candidate access</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-foreground">Enter your access code</h1>
          <p className="mt-2 text-sm text-muted-foreground">No username or password — just the code you were given.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="c">Access code</Label>
              <Input
                id="c"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. A3K9PQ7M"
                className="font-mono text-lg tracking-widest text-center"
                maxLength={16}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Start exam"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Are you an admin? <Link to="/admin/login" className="text-primary font-medium">Admin login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
