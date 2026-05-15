import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";

export const Route = createFileRoute("/_authenticated/participant/dashboard")({
  component: PDashboard,
});

interface Quiz { id: string; title: string; instructions: string | null; duration_minutes: number; negative_marks: number; }

function PDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  useEffect(() => {
    supabase.from("quizzes").select("*").eq("is_active", true).then(({ data }) => setQuizzes((data as Quiz[]) ?? []));
  }, []);
  return (
    <div className="pt-6">
      <h1 className="text-3xl font-bold">Available exams</h1>
      <p className="text-muted-foreground mt-1">Select a quiz to start. The exam runs in fullscreen mode.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {quizzes.length === 0 && <div className="col-span-full text-muted-foreground rounded-2xl border border-dashed border-border p-12 text-center">No active quizzes right now.</div>}
        {quizzes.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-card border border-border p-6 hover:shadow-[var(--shadow-leaf)] transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{q.title}</h3>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{q.duration_minutes} min</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3 min-h-[3rem]">{q.instructions || "No instructions."}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Negative marks: {q.negative_marks}</span>
              <Link to="/participant/quiz/$quizId" params={{ quizId: q.id }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90">
                <Play className="h-4 w-4" /> Start
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
