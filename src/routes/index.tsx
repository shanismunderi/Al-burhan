import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { GraduationCap, Shield, Activity, Timer, Eye, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/admin/login">Admin</Link></Button>
          <Button asChild><Link to="/login">Sign in</Link></Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary bg-accent/60 px-3 py-1 rounded-full">
            Schools • Colleges • Coaching • Companies
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-[1.05] text-foreground">
            Run secure online exams<br />with <span className="text-primary">live monitoring</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Timed quizzes, fullscreen lockdown, tab-switch detection, and a real-time admin dashboard — built for serious assessments.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg"><Link to="/login">Participant login</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/admin/login">Admin login</Link></Button>
          </div>
        </motion.div>

        <div className="mt-20 grid md:grid-cols-3 gap-5">
          {[
            { icon: Timer, title: "Server-synced timer", desc: "Auto-submit when time runs out. Resume on refresh." },
            { icon: Shield, title: "Anti-cheat lockdown", desc: "Fullscreen, tab-switch, blur and back-button detection." },
            { icon: Activity, title: "Live monitoring", desc: "Realtime feed of every participant's status & warnings." },
            { icon: GraduationCap, title: "Question bank", desc: "Create unlimited quizzes with MCQs and marks scheme." },
            { icon: Eye, title: "Negative marking", desc: "Configurable negative marks per quiz." },
            { icon: Trophy, title: "Auto leaderboard", desc: "Instant rank list and result analytics." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-6 hover:shadow-[var(--shadow-leaf)] transition-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-accent/60 flex items-center justify-center text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        QuizGreen — Secure online exam system
      </footer>
    </div>
  );
}
