import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, signOut } from "@/lib/auth";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, LogOut, Play, ShieldCheck, Timer, FileText, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/participant/dashboard")({
  component: PDashboard,
});

interface Quiz { id: string; title: string; instructions: string | null; duration_minutes: number; negative_marks: number; }
interface Attempt { id: string; status: string; submitted_at: string | null; }

function PDashboard() {
  const { user, username, member1, member2 } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: q } = await supabase.from("quizzes").select("*").eq("is_active", true).order("created_at", { ascending: true }).limit(1).maybeSingle();
      setQuiz(q as Quiz | null);
      if (q) {
        const [{ count }, { data: a }] = await Promise.all([
          supabase.from("questions").select("id", { count: "exact", head: true }).eq("quiz_id", q.id),
          supabase.from("quiz_attempts").select("id,status,submitted_at").eq("user_id", user.id).eq("quiz_id", q.id).order("started_at", { ascending: false }).limit(1).maybeSingle(),
        ]);
        setQuestionCount(count ?? 0);
        setAttempt(a as Attempt | null);
      }
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <div className="pt-20 text-center text-muted-foreground">Loading…</div>;

  if (!quiz) {
    return (
      <div className="pt-20 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border p-10">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No exam available</h2>
          <p className="text-sm text-muted-foreground mt-1">Please check back later or contact your administrator.</p>
        </div>
      </div>
    );
  }

  const isSubmitted = attempt && attempt.status !== "in_progress";

  if (isSubmitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-10 max-w-xl mx-auto">
        <div className="rounded-3xl bg-card border border-border p-10 text-center shadow-[var(--shadow-leaf)]">
          <div className="h-20 w-20 mx-auto rounded-3xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-leaf)" }}>
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Exam submitted</h1>
          <p className="text-muted-foreground mt-2">Hello <span className="font-semibold text-foreground">{member1 && member2 ? `${member1} & ${member2}` : username}</span>, your responses have been recorded.</p>
          <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground">
            You've already completed <span className="font-semibold text-foreground">{quiz.title}</span>. Each candidate may attempt this exam only once.
            <br />Results will be reviewed by your administrator. Scores are not shown to candidates.
          </div>
          <button
            onClick={() => signOut().then(() => (window.location.href = "/"))}
            className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </motion.div>
    );
  }

  const isResume = attempt?.status === "in_progress";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-8 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Welcome
        </div>
        {member1 && member2 ? (
          <h2 className="text-2xl md:text-3xl font-semibold mt-2 text-foreground">
            {member1} <span className="text-primary">&</span> {member2}
          </h2>
        ) : (
          <h2 className="text-2xl md:text-3xl font-semibold mt-2 text-foreground">{username}</h2>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mt-3">{quiz.title}</h1>
      </div>

      <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-leaf)]">
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={FileText} label="Questions" value={String(questionCount)} />
          <Stat icon={Timer} label="Duration" value={`${quiz.duration_minutes} min`} />
          <Stat icon={AlertTriangle} label="Negative" value={String(quiz.negative_marks)} />
        </div>

        {quiz.instructions && (
          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Instructions</div>
            <div className="text-sm text-foreground/90 whitespace-pre-line border-l-2 border-primary/50 pl-4 leading-relaxed">{quiz.instructions}</div>
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-warning/10 border border-warning/30 p-5 text-sm">
          <div className="font-semibold flex items-center gap-2 text-foreground"><ShieldCheck className="h-4 w-4" />Important rules</div>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> The exam runs in <b className="text-foreground">fullscreen mode</b>.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Switching tabs, losing focus or going back triggers warnings.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> After <b className="text-foreground">3 warnings</b> the exam is auto-submitted.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> You can attempt this exam <b className="text-foreground">only once</b>.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate({ to: "/participant/quiz/$quizId", params: { quizId: quiz.id } })}
          disabled={questionCount === 0}
          className="mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 disabled:opacity-50 transition-all hover:shadow-lg">
          <Play className="h-5 w-5" /> {isResume ? "Resume exam" : "Start exam"}
        </button>
        {questionCount === 0 && <p className="text-center text-xs text-muted-foreground mt-3">No questions configured yet.</p>}
      </div>

      <div className="text-center mt-6">
        <button onClick={() => signOut().then(() => (window.location.href = "/"))} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <LogOut className="h-3 w-3" /> Sign out
        </button>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-accent/40 border border-border/50 p-4 text-center">
      <Icon className="h-4 w-4 mx-auto text-primary" />
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5">{label}</div>
      <div className="font-bold text-lg text-foreground mt-0.5">{value}</div>
    </div>
  );
}
