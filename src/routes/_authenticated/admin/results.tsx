import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/results")({
  component: ResultsPage,
});

interface Row {
  id: string; user_id: string; quiz_id: string; status: string; warnings: number;
  score: number; correct_count: number; total_questions: number; submitted_at: string | null;
  username?: string; quiz_title?: string;
}

function ResultsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [quizFilter, setQuizFilter] = useState<string>("");
  const [quizzes, setQuizzes] = useState<{id: string; title: string}[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: a }, { data: p }, { data: q }] = await Promise.all([
        supabase.from("quiz_attempts").select("*").not("submitted_at", "is", null).order("score", { ascending: false }),
        supabase.from("profiles").select("id, username"),
        supabase.from("quizzes").select("id, title"),
      ]);
      const pMap = Object.fromEntries((p ?? []).map((x) => [x.id, x.username]));
      const qMap = Object.fromEntries((q ?? []).map((x) => [x.id, x.title]));
      setQuizzes(q ?? []);
      setRows((a ?? []).map((r: any) => ({ ...r, username: pMap[r.user_id], quiz_title: qMap[r.quiz_id] })));
    })();
  }, []);

  const filtered = quizFilter ? rows.filter((r) => r.quiz_id === quizFilter) : rows;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2"><Trophy className="h-6 w-6 text-primary" /><h1 className="text-3xl font-bold">Results & Leaderboard</h1></div>
      <div className="mt-4 flex items-center gap-3">
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
          <option value="">All quizzes</option>
          {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
        </select>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-2 w-16">Rank</th>
              <th className="text-left px-4 py-2">Participant</th>
              <th className="text-left px-4 py-2">Quiz</th>
              <th className="text-left px-4 py-2">Score</th>
              <th className="text-left px-4 py-2">Correct</th>
              <th className="text-left px-4 py-2">Warnings</th>
              <th className="text-left px-4 py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No submissions yet.</td></tr>}
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-bold text-primary">#{i + 1}</td>
                <td className="px-4 py-3 font-medium">{r.username}</td>
                <td className="px-4 py-3">{r.quiz_title}</td>
                <td className="px-4 py-3 font-semibold">{r.score}</td>
                <td className="px-4 py-3">{r.correct_count}/{r.total_questions}</td>
                <td className="px-4 py-3">{r.warnings}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.submitted_at ? new Date(r.submitted_at).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
