import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithUsername, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signInWithUsername(username, password);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome back!");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-soft)" }}>
      <div className="hidden lg:flex flex-1 p-12 flex-col justify-between" style={{ background: "var(--gradient-leaf)" }}>
        <Brand />
        <div className="text-primary-foreground max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Take your exam.<br />Stay focused.</h2>
          <p className="mt-4 opacity-90">Login with the credentials your administrator gave you. The quiz starts in fullscreen mode.</p>
        </div>
        <div className="text-primary-foreground/70 text-xs">© QuizGreen</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Brand /></div>
          <h1 className="text-3xl font-bold text-foreground">Participant login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your username and password.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="u">Username</Label>
              <Input id="u" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} placeholder="quiz101" required />
            </div>
            <div>
              <Label htmlFor="p">Password</Label>
              <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
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
