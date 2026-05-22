import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trophy, Eye, X, Check, AlertTriangle } from "lucide-react";
import { gradeAnswer } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/results")({
  component: ResultsPage,
});

interface AttemptRow {
  id: string; user_id: string; quiz_id: string; status: string; warnings: number;
  score: number; correct_count: number; total_questions: number; submitted_at: string | null;
  username?: string; quiz_title?: string;
}

function ResultsPage() {
  const [rows, setRows] = useState<AttemptRow[]>([]);
  const [quizFilter, setQuizFilter] = useState<string>("");
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    const [{ data: a }, { data: p }, { data: q }] = await Promise.all([
      supabase.from("quiz_attempts").select("*").not("submitted_at", "is", null).order("score", { ascending: false }),
      supabase.from("profiles").select("id, username, display_name"),
      supabase.from("quizzes").select("id, title"),
    ]);
    const pMap = Object.fromEntries((p ?? []).map((x: any) => [x.id, x.display_name || x.username]));
    const qMap = Object.fromEntries((q ?? []).map((x) => [x.id, x.title]));
    setQuizzes(q ?? []);
    setRows((a ?? []).map((r: any) => ({ ...r, username: pMap[r.user_id], quiz_title: qMap[r.quiz_id] })));
  };
  useEffect(() => { load(); }, []);

  const filtered = quizFilter ? rows.filter((r) => r.quiz_id === quizFilter) : rows;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-2"><Trophy className="h-6 w-6 text-primary" /><h1 className="text-2xl md:text-3xl font-bold">Results & Leaderboard</h1></div>
      <p className="text-sm text-muted-foreground mt-1">Full visibility of every candidate's answers, including descriptive responses.</p>

      <div className="mt-4 flex items-center gap-3">
        <select className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-sm" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
          <option value="">All quizzes</option>
          {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
        </select>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 w-16">Rank</th>
                <th className="text-left px-4 py-2">Candidate</th>
                <th className="text-left px-4 py-2">Quiz</th>
                <th className="text-left px-4 py-2">Score</th>
                <th className="text-left px-4 py-2">Correct</th>
                <th className="text-left px-4 py-2">Warnings</th>
                <th className="text-left px-4 py-2">Submitted</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No submissions yet.</td></tr>}
              {filtered.map((r, i) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-bold text-primary">#{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.username}</td>
                  <td className="px-4 py-3">{r.quiz_title}</td>
                  <td className="px-4 py-3 font-semibold">{r.score}</td>
                  <td className="px-4 py-3">{r.correct_count}/{r.total_questions}</td>
                  <td className="px-4 py-3">{r.warnings}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.submitted_at ? new Date(r.submitted_at).toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setOpenId(r.id)}><Eye className="h-4 w-4 mr-1" />View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {filtered.length === 0 && <div className="px-4 py-10 text-center text-muted-foreground text-sm">No submissions yet.</div>}
          {filtered.map((r, i) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">#{i + 1}</span>
                    <span className="font-semibold truncate">{r.username}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{r.quiz_title}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setOpenId(r.id)} className="shrink-0">
                  <Eye className="h-4 w-4 mr-1" />View
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><div className="text-muted-foreground">Score</div><div className="font-semibold">{r.score}</div></div>
                <div><div className="text-muted-foreground">Correct</div><div className="font-semibold">{r.correct_count}/{r.total_questions}</div></div>
                <div><div className="text-muted-foreground">Warn</div><div className="font-semibold">{r.warnings}</div></div>
              </div>
              {r.submitted_at && (
                <div className="text-[11px] text-muted-foreground">{new Date(r.submitted_at).toLocaleString()}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {openId && <AttemptDetail attemptId={openId} onClose={() => { setOpenId(null); load(); }} />}
    </div>
  );
}

interface DetailRow {
  question: any;
  answer: any | null;
}

function AttemptDetail({ attemptId, onClose }: { attemptId: string; onClose: () => void }) {
  const [attempt, setAttempt] = useState<any>(null);
  const [rows, setRows] = useState<DetailRow[]>([]);
  const [candidate, setCandidate] = useState<string>("");
  const [quizTitle, setQuizTitle] = useState("");
  const [grading, setGrading] = useState<Record<string, number>>({});
  const grade = useServerFn(gradeAnswer);

  const load = async () => {
    const { data: a } = await supabase.from("quiz_attempts").select("*").eq("id", attemptId).maybeSingle();
    if (!a) return;
    setAttempt(a);
    const [{ data: prof }, { data: quiz }, { data: qs }, { data: ans }] = await Promise.all([
      supabase.from("profiles").select("username, display_name").eq("id", a.user_id).maybeSingle(),
      supabase.from("quizzes").select("title").eq("id", a.quiz_id).maybeSingle(),
      supabase.from("questions").select("*").eq("quiz_id", a.quiz_id).order("position"),
      supabase.from("attempt_answers").select("*").eq("attempt_id", attemptId),
    ]);
    setCandidate((prof as any)?.display_name || (prof as any)?.username || "");
    setQuizTitle(quiz?.title ?? "");
    const aMap = Object.fromEntries((ans ?? []).map((x: any) => [x.question_id, x]));
    setRows((qs ?? []).map((q: any) => ({ question: q, answer: aMap[q.id] ?? null })));
    const g: Record<string, number> = {};
    (ans ?? []).forEach((x: any) => { if (x.manual_score != null) g[x.id] = Number(x.manual_score); });
    setGrading(g);
  };
  useEffect(() => { load(); }, [attemptId]);

  const submitGrade = async (answerId: string) => {
    const v = grading[answerId];
    if (v == null || isNaN(v)) return toast.error("Enter a score");
    try {
      await grade({ data: { answer_id: answerId, manual_score: v } });
      toast.success("Saved");
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  if (!attempt) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Full answer sheet</div>
            <h2 className="text-xl font-bold">{candidate} · {quizTitle}</h2>
            <div className="text-xs text-muted-foreground mt-1">
              Score {attempt.score} · {attempt.correct_count}/{attempt.total_questions} correct · {attempt.warnings} warning{attempt.warnings === 1 ? "" : "s"} · {attempt.status.replace("_", " ")}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="p-6 space-y-4">
          {rows.map(({ question: q, answer }, i) => {
            const isMcq = q.question_type === "mcq";
            const sel = answer?.selected_answer ?? null;
            const correct = isMcq ? sel === q.correct_answer : null;
            return (
              <div key={q.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {isMcq ? "MCQ" : "Descriptive"}
                  </span>
                  <span className="text-xs text-muted-foreground">{q.marks} mark{Number(q.marks) === 1 ? "" : "s"}</span>
                </div>
                <div className="font-semibold mt-2 whitespace-pre-line">Q{i + 1}. {q.question_text}</div>

                {isMcq ? (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {(["A", "B", "C", "D"] as const).map((k) => {
                      const v = q[`option_${k.toLowerCase()}`];
                      if (!v) return null;
                      const isCorrectOpt = q.correct_answer === k;
                      const isSelected = sel === k;
                      return (
                        <div key={k} className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${
                          isCorrectOpt ? "border-success bg-success/10" :
                          isSelected ? "border-destructive bg-destructive/10" : "border-border"
                        }`}>
                          <span className="font-mono text-xs">{k}.</span>
                          <span className="flex-1">{v}</span>
                          {isCorrectOpt && <Check className="h-4 w-4 text-success" />}
                          {isSelected && !isCorrectOpt && <X className="h-4 w-4 text-destructive" />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Candidate's answer</div>
                    {sel ? (
                      <div className="rounded-lg bg-muted/40 border border-border p-3 text-sm whitespace-pre-wrap">{sel}</div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground italic">No answer provided</div>
                    )}
                    {answer?.id && (
                      <div className="mt-3 flex items-end gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">Award marks (0 – {q.marks})</label>
                          <Input
                            type="number" step="0.25" min={0} max={Number(q.marks)}
                            value={grading[answer.id] ?? answer.manual_score ?? ""}
                            onChange={(e) => setGrading((g) => ({ ...g, [answer.id]: Number(e.target.value) }))}
                          />
                        </div>
                        <Button onClick={() => submitGrade(answer.id)}>Save grade</Button>
                      </div>
                    )}
                    {answer?.manual_score != null && (
                      <div className="mt-2 text-xs text-primary font-semibold">Current grade: {answer.manual_score}</div>
                    )}
                  </div>
                )}

                {isMcq && (
                  <div className="mt-2 text-xs">
                    {sel == null ? <span className="text-muted-foreground">Not answered</span> :
                      correct ? <span className="text-success font-semibold inline-flex items-center gap-1"><Check className="h-3 w-3" />Correct</span> :
                      <span className="text-destructive font-semibold inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Wrong (selected {sel})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
