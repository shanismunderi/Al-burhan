import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle2, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/participant/result/$attemptId")({
  component: ResultPage,
});

interface Attempt { id: string; quiz_id: string; status: string; warnings: number; score: number; correct_count: number; total_questions: number; }

function ResultPage() {
  const { attemptId } = Route.useParams();
  const [a, setA] = useState<Attempt | null>(null);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("quiz_attempts").select("*").eq("id", attemptId).maybeSingle();
      setA(data as Attempt);
      if (data) {
        const { data: q } = await supabase.from("quizzes").select("title").eq("id", (data as any).quiz_id).maybeSingle();
        setQuizTitle(q?.title ?? "");
      }
    })();
  }, [attemptId]);

  if (!a) return <div className="pt-12 text-center text-muted-foreground">Loading…</div>;

  const pct = a.total_questions > 0 ? Math.round((a.correct_count / a.total_questions) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-6 max-w-xl mx-auto">
      <div className="rounded-2xl bg-card border border-border p-8 text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-leaf)" }}>
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Exam submitted</h1>
        <p className="text-muted-foreground mt-1">{quizTitle}</p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat label="Score" value={String(a.score)} />
          <Stat label="Correct" value={`${a.correct_count}/${a.total_questions}`} />
          <Stat label="Accuracy" value={`${pct}%`} />
        </div>

        {a.status === "auto_submitted" && (
          <div className="mt-5 text-sm rounded-xl bg-destructive/10 text-destructive border border-destructive/30 px-4 py-3">
            This exam was auto-submitted ({a.warnings} warning{a.warnings === 1 ? "" : "s"} recorded).
          </div>
        )}

        <Link to="/participant/dashboard" className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
          <Trophy className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-accent/40 px-3 py-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-bold text-2xl text-foreground">{value}</div>
    </div>
  );
}
