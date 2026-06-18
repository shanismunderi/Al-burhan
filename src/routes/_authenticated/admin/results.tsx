import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Eye, X, Check, AlertTriangle } from "lucide-react";
import { gradeAnswer } from "@/lib/admin.functions";
import { formatDisplayName } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/results")({
  component: ResultsPage,
});

interface AttemptRow {
  id: string; user_id: string; quiz_id: string; status: string; warnings: number;
  score: number; correct_count: number; total_questions: number;
  started_at: string | null; submitted_at: string | null;
  username?: string; quiz_title?: string;
}

function fmtExact(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  return `${date} · ${time}`;
}

function fmtDuration(startIso: string | null, endIso: string | null) {
  if (!startIso || !endIso) return null;
  const startTime = new Date(startIso).getTime();
  const endTime = new Date(endIso).getTime();
  if (isNaN(startTime) || isNaN(endTime)) return null;
  const ms = endTime - startTime;
  if (ms < 0) return null;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
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
    const pMap = Object.fromEntries((p ?? []).map((x: any) => [x.id, formatDisplayName(x.display_name, x.username)]));
    const qMap = Object.fromEntries((q ?? []).map((x: any) => [x.id, x.title]));
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
                  <td className="px-4 py-3">{r.warnings || 0}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="font-mono text-xs text-foreground">{fmtExact(r.submitted_at)}</div>
                    {fmtDuration(r.started_at, r.submitted_at) && (
                      <div className="text-[10px] mt-0.5">Took {fmtDuration(r.started_at, r.submitted_at)}</div>
                    )}
                  </td>
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
                <div><div className="text-muted-foreground">Warn</div><div className="font-semibold">{r.warnings || 0}</div></div>
              </div>
              {r.submitted_at && (
                <div className="text-[11px] text-muted-foreground font-mono">
                  {fmtExact(r.submitted_at)}
                  {fmtDuration(r.started_at, r.submitted_at) && ` · Took ${fmtDuration(r.started_at, r.submitted_at)}`}
                </div>
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
  const [grading, setGrading] = useState<Record<string, string | number>>({});
  const grade = useServerFn(gradeAnswer);

  const load = async () => {
    const { data: a } = await supabase.from("quiz_attempts").select("*").eq("id", attemptId).maybeSingle();
    if (!a) return;
    setAttempt(a);
    const [{ data: prof }, { data: quiz }, { data: qs }, { data: ans }] = await Promise.all([
      supabase.from("profiles").select("username, display_name").eq("id", a.user_id).maybeSingle(),
      supabase.from("quizzes").select("title").eq("id", a.quiz_id).maybeSingle(),
      supabase.rpc("admin_get_questions", { _quiz_id: a.quiz_id }),
      supabase.from("attempt_answers").select("*").eq("attempt_id", attemptId),
    ]);
    setCandidate(formatDisplayName((prof as any)?.display_name, (prof as any)?.username));
    setQuizTitle(quiz?.title ?? "");
    const aMap = Object.fromEntries((ans ?? []).map((x: any) => [x.question_id, x]));
    const orderMap: Record<string, number> = { mcq: 0, one_word: 1, descriptive: 2 };
    const sortedQs = [...(qs ?? [])].sort((a: any, b: any) => {
      const typeA = a.question_type ?? "mcq";
      const typeB = b.question_type ?? "mcq";
      if (typeA !== typeB) {
        return (orderMap[typeA] ?? 9) - (orderMap[typeB] ?? 9);
      }
      return (a.position ?? 0) - (b.position ?? 0);
    });
    setRows(sortedQs.map((q: any) => ({ question: q, answer: aMap[q.id] ?? null })));
    const g: Record<string, number> = {};
    (ans ?? []).forEach((x: any) => { if (x.manual_score != null) g[x.id] = Number(x.manual_score); });
    setGrading(g);
  };
  useEffect(() => { load(); }, [attemptId]);

  const submitGrade = async (answerId: string) => {
    const v = grading[answerId];
    if (v === undefined || v === null || (v as any) === "") return;
    const num = Number(v);
    if (isNaN(num)) return;
    try {
      await grade({ data: { answer_id: answerId, manual_score: num } });
      load();
    } catch (e: any) {}
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
              Score {attempt.score} · {attempt.correct_count}/{attempt.total_questions} correct · {attempt.warnings || 0} warning{(attempt.warnings || 0) === 1 ? "" : "s"} · {attempt.status.replace("_", " ")}
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">
              Submitted: {fmtExact(attempt.submitted_at)}
              {fmtDuration(attempt.started_at, attempt.submitted_at) && ` · Time taken: ${fmtDuration(attempt.started_at, attempt.submitted_at)}`}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="p-6 space-y-4">
          {rows.map(({ question: q, answer }, i) => {
            const isMcq = q.question_type === "mcq";
            const isOneWord = q.question_type === "one_word";
            const sel = answer?.selected_answer ?? null;
            
            let isCorrect = null;
            if (isMcq) {
              isCorrect = sel === q.correct_answer;
            } else if (isOneWord) {
              const userAns = String(sel || "").trim().toLowerCase();
              const correctAns = String(q.correct_answer || "").trim().toLowerCase();
              isCorrect = userAns === correctAns;
            }

            return (
              <div key={q.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {isMcq ? "MCQ (Optional)" : isOneWord ? "One Word" : "Descriptive (Essay)"}
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
                ) : isOneWord ? (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Candidate's answer</div>
                    {sel ? (
                      <div className={`rounded-lg p-3 text-sm font-mono border ${isCorrect ? "border-success bg-success/5 text-success font-semibold" : "border-destructive bg-destructive/5 text-destructive font-semibold"}`}>{sel}</div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground italic">No answer provided</div>
                    )}
                    <div className="text-xs">
                      <span className="text-muted-foreground">Correct answer: </span>
                      <span className="font-mono bg-success/10 text-success px-2 py-0.5 rounded font-semibold">{q.correct_answer}</span>
                    </div>
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
                            onChange={(e) => setGrading((g) => ({ ...g, [answer.id]: e.target.value }))}
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

                {(isMcq || isOneWord) && (
                  <div className="mt-2 text-xs">
                    {sel == null ? <span className="text-muted-foreground">Not answered</span> :
                      isCorrect ? <span className="text-success font-semibold inline-flex items-center gap-1"><Check className="h-3 w-3" />Correct</span> :
                      <span className="text-destructive font-semibold inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Wrong {isOneWord && `(typed: "${sel}")`}</span>}
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
