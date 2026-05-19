import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AlertTriangle, Clock, Maximize, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/participant/quiz/$quizId")({
  component: TakeQuiz,
});

interface Quiz { id: string; title: string; instructions: string | null; duration_minutes: number; negative_marks: number; randomize: boolean; }
interface Question { id: string; question_text: string; question_type: "mcq" | "descriptive"; option_a: string | null; option_b: string | null; option_c: string | null; option_d: string | null; marks: number; correct_answer: string | null; }
interface Attempt { id: string; ends_at: string; warnings: number; status: string; }

const MAX_WARNINGS = 3;

function TakeQuiz() {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [warningOpen, setWarningOpen] = useState<string | null>(null);

  const submittingRef = useRef(false);
  const warningsRef = useRef(0);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const answersRef = useRef<Record<string, string>>({});
  const questionsRef = useRef<Question[]>([]);
  const quizRef = useRef<Quiz | null>(null);
  const attemptRef = useRef<Attempt | null>(null);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { quizRef.current = quiz; }, [quiz]);
  useEffect(() => { attemptRef.current = attempt; }, [attempt]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: submitted } = await supabase
        .from("quiz_attempts").select("id,status").eq("user_id", user.id).eq("quiz_id", quizId)
        .neq("status", "in_progress").limit(1).maybeSingle();
      if (submitted) {
        navigate({ to: "/participant/dashboard" });
        return;
      }
      const [{ data: q }, { data: qs }] = await Promise.all([
        supabase.from("quizzes").select("*").eq("id", quizId).maybeSingle(),
        supabase.from("questions").select("*").eq("quiz_id", quizId).order("position"),
      ]);
      setQuiz(q as Quiz);
      let list = (qs as Question[]) ?? [];
      if (q?.randomize) list = [...list].sort(() => Math.random() - 0.5);
      setQuestions(list);
    })();
  }, [quizId, user, navigate]);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);

  const remaining = useMemo(() => attempt ? Math.max(0, new Date(attempt.ends_at).getTime() - now) : 0, [attempt, now]);

  const beginAttempt = async () => {
    if (!user || !quiz) return;
    // Block if user already submitted this quiz
    const { data: submitted } = await supabase
      .from("quiz_attempts").select("id,status").eq("user_id", user.id).eq("quiz_id", quizId)
      .neq("status", "in_progress").limit(1).maybeSingle();
    if (submitted) {
      toast.error("You have already submitted this exam. Only one attempt is allowed.");
      navigate({ to: "/participant/dashboard" });
      return;
    }
    const { data: existing } = await supabase.from("quiz_attempts").select("*").eq("user_id", user.id).eq("quiz_id", quizId).eq("status", "in_progress").maybeSingle();
    let a = existing as Attempt | null;
    if (!a) {
      const ends_at = new Date(Date.now() + quiz.duration_minutes * 60 * 1000).toISOString();
      const { data, error } = await supabase.from("quiz_attempts").insert({
        user_id: user.id, quiz_id: quizId, ends_at, status: "in_progress",
        total_questions: questions.length,
      }).select().single();
      if (error) return toast.error(error.message);
      a = data as Attempt;
    } else {
      const { data: saved } = await supabase.from("attempt_answers").select("*").eq("attempt_id", a.id);
      const map: Record<string, string> = {};
      (saved ?? []).forEach((s: any) => { if (s.selected_answer) map[s.question_id] = s.selected_answer; });
      setAnswers(map);
    }
    setAttempt(a);
    warningsRef.current = a.warnings;
    setStarted(true);
    try { await document.documentElement.requestFullscreen(); } catch {}
    history.pushState(null, "", location.href);
  };

  const recordCheat = useCallback(async (event_type: string) => {
    if (!attempt || !user || submittingRef.current) return;
    warningsRef.current += 1;
    const w = warningsRef.current;
    await Promise.all([
      supabase.from("cheat_events").insert({ attempt_id: attempt.id, user_id: user.id, event_type }),
      supabase.from("quiz_attempts").update({ warnings: w }).eq("id", attempt.id),
    ]);
    setAttempt({ ...attempt, warnings: w });
    if (w >= MAX_WARNINGS) {
      setWarningOpen(`Maximum warnings reached. Auto-submitting…`);
      autoSubmit("auto_submitted");
    } else {
      setWarningOpen(`Warning ${w}/${MAX_WARNINGS - 1}: ${labelEvent(event_type)}. Next violation will auto-submit your exam.`);
      setTimeout(() => setWarningOpen(null), 4500);
    }
  }, [attempt, user]);

  const autoSubmit = useCallback(async (status: "submitted" | "auto_submitted" = "submitted") => {
    const attempt = attemptRef.current;
    const quiz = quizRef.current;
    const questions = questionsRef.current;
    const answers = answersRef.current;
    if (submittingRef.current || !attempt) return;
    submittingRef.current = true;
    let correct = 0, score = 0;
    const negMarks = quiz?.negative_marks ?? 0;
    const updates: Array<PromiseLike<any>> = [];
    questions.forEach((q) => {
      const sel = answers[q.id];
      if (q.question_type === "mcq") {
        let isCorrect: boolean | null = null;
        if (sel) {
          isCorrect = sel === q.correct_answer;
          if (isCorrect) { correct += 1; score += Number(q.marks); }
          else { score -= negMarks; }
        }
        if (sel != null) {
          updates.push(
            supabase.from("attempt_answers").upsert({
              attempt_id: attempt.id, question_id: q.id, selected_answer: sel, is_correct: isCorrect,
            }, { onConflict: "attempt_id,question_id" })
          );
        }
      } else {
        if (sel != null) {
          updates.push(
            supabase.from("attempt_answers").upsert({
              attempt_id: attempt.id, question_id: q.id, selected_answer: sel, is_correct: null,
            }, { onConflict: "attempt_id,question_id" })
          );
        }
      }
    });
    await Promise.all(updates);
    score = Math.max(0, score);
    await supabase.from("quiz_attempts").update({
      status, submitted_at: new Date().toISOString(), score, correct_count: correct, total_questions: questions.length,
    }).eq("id", attempt.id);
    if (document.fullscreenElement) try { await document.exitFullscreen(); } catch {}
    navigate({ to: "/participant/result/$attemptId", params: { attemptId: attempt.id } });
  }, [navigate]);

  useEffect(() => {
    if (started && attempt && remaining <= 0 && !submittingRef.current) autoSubmit("auto_submitted");
  }, [started, attempt, remaining, autoSubmit]);

  useEffect(() => {
    if (!started) return;
    const onVis = () => { if (document.visibilityState === "hidden") recordCheat("tab_switch"); };
    const onBlur = () => recordCheat("blur");
    const onFs = () => { if (!document.fullscreenElement) recordCheat("fullscreen_exit"); };
    const onPop = () => { history.pushState(null, "", location.href); recordCheat("back_button"); };
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("popstate", onPop);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFs);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [started, recordCheat]);

  const saveAnswer = async (qid: string, value: string) => {
    if (!attempt) return;
    await supabase.from("attempt_answers").upsert({
      attempt_id: attempt.id, question_id: qid, selected_answer: value,
    }, { onConflict: "attempt_id,question_id" });
  };

  const selectMcq = (qid: string, value: string) => {
    setAnswers((m) => ({ ...m, [qid]: value }));
    saveAnswer(qid, value);
  };

  const typeText = (qid: string, value: string) => {
    setAnswers((m) => ({ ...m, [qid]: value }));
    if (saveTimers.current[qid]) clearTimeout(saveTimers.current[qid]);
    saveTimers.current[qid] = setTimeout(() => saveAnswer(qid, value), 600);
  };

  if (!quiz) return <div className="p-12 text-center text-muted-foreground">Loading quiz…</div>;

  if (!started) {
    return (
      <div className="pt-6">
        <div className="rounded-2xl bg-card border border-border p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Pill label="Questions" value={String(questions.length)} />
            <Pill label="Duration" value={`${quiz.duration_minutes} min`} />
            <Pill label="Negative" value={String(quiz.negative_marks)} />
          </div>
          {quiz.instructions && <div className="mt-5 text-sm text-muted-foreground whitespace-pre-line border-l-2 border-primary/40 pl-4">{quiz.instructions}</div>}
          <div className="mt-6 rounded-xl bg-warning/10 border border-warning/30 p-4 text-sm">
            <div className="font-semibold flex items-center gap-2 text-warning-foreground"><ShieldCheck className="h-4 w-4" />Anti-cheating is enabled</div>
            <ul className="mt-2 space-y-1 text-muted-foreground list-disc list-inside">
              <li>The exam runs in <b>fullscreen</b>.</li>
              <li>Switching tabs, losing focus, or pressing back will trigger warnings.</li>
              <li>After {MAX_WARNINGS} warnings the exam is auto-submitted.</li>
            </ul>
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={beginAttempt} disabled={questions.length === 0}>
            <Maximize className="h-4 w-4 mr-2" /> Enter fullscreen & begin
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const ms = remaining;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const lowTime = ms < 60_000;

  return (
    <div className="pt-2">
      <div className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border -mx-6 px-6 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</div>
          <div className="font-semibold">{quiz.title}</div>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg tabular-nums ${lowTime ? "text-destructive" : "text-foreground"}`}>
          <Clock className="h-4 w-4" />
          {h > 0 && `${String(h).padStart(2, "0")}:`}{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
        <div className="text-xs text-muted-foreground">
          Warnings: <span className={attempt && attempt.warnings >= 2 ? "text-destructive font-bold" : "font-bold"}>{attempt?.warnings ?? 0}/{MAX_WARNINGS}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_220px] gap-6 mt-6">
        <div>
          {q && (
            <motion.div key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border p-6">
              <div className="text-xs uppercase tracking-widest text-primary font-medium">
                Q{current + 1} · {q.question_type === "mcq" ? "Multiple choice" : "Descriptive"} · {q.marks} mark{Number(q.marks) === 1 ? "" : "s"}
              </div>
              <h2 className="text-xl font-semibold mt-2 whitespace-pre-line">{q.question_text}</h2>

              {q.question_type === "mcq" ? (
                <div className="mt-5 space-y-2">
                  {(["A","B","C","D"] as const).map((k) => {
                    const text = (q as any)[`option_${k.toLowerCase()}`] as string | null;
                    if (!text) return null;
                    const sel = answers[q.id] === k;
                    return (
                      <button key={k} onClick={() => selectMcq(q.id, k)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                          sel ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/40 hover:bg-accent/40"
                        }`}>
                        <span className={`h-7 w-7 rounded-full border flex items-center justify-center font-mono text-sm ${sel ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{k}</span>
                        <span>{text}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5">
                  <Textarea
                    rows={8}
                    placeholder="Type your answer here…"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => typeText(q.id, e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground mt-1">Auto-saved as you type.</div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Previous</Button>
                {current < questions.length - 1 ? (
                  <Button onClick={() => setCurrent((c) => c + 1)}>Next</Button>
                ) : (
                  <Button onClick={() => { if (confirm("Submit your exam now?")) autoSubmit("submitted"); }}>Submit exam</Button>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <aside className="rounded-2xl bg-card border border-border p-4 h-fit lg:sticky lg:top-24">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Question navigator</div>
          <div className="grid grid-cols-5 gap-2 mt-3">
            {questions.map((qq, i) => {
              const answered = !!answers[qq.id];
              const isCurrent = i === current;
              return (
                <button key={qq.id} onClick={() => setCurrent(i)}
                  className={`h-9 rounded-md text-sm font-medium border transition-colors ${
                    isCurrent ? "bg-foreground text-background border-foreground" :
                    answered ? "bg-primary/15 text-primary border-primary/30" :
                    "bg-muted text-muted-foreground border-border"
                  }`}>{i + 1}</button>
              );
            })}
          </div>
          <div className="mt-4 text-xs space-y-1 text-muted-foreground">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary/30" /> Answered</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-muted border border-border" /> Unanswered</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-foreground" /> Current</div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {warningOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-destructive/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-card rounded-2xl shadow-2xl p-8 max-w-md text-center border-2 border-destructive">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
              <h3 className="mt-4 text-xl font-bold">Cheating detected</h3>
              <p className="mt-2 text-sm text-muted-foreground">{warningOpen}</p>
              <Button className="mt-6" onClick={async () => { setWarningOpen(null); try { await document.documentElement.requestFullscreen(); } catch {} }}>I understand</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-accent/40 px-4 py-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-bold text-lg text-foreground">{value}</div>
    </div>
  );
}

function labelEvent(t: string) {
  switch (t) {
    case "tab_switch": return "Tab switching";
    case "blur": return "Window lost focus";
    case "fullscreen_exit": return "Exited fullscreen";
    case "back_button": return "Back navigation";
    default: return t;
  }
}
