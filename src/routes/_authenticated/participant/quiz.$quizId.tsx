import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
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
      // Auto-begin attempt immediately — no intro screen
      void beginAttemptAuto(q as Quiz, list);
    })();
  }, [quizId, user, navigate]);

  const beginAttemptAuto = async (qz: Quiz, list: Question[]) => {
    if (!user) return;
    const { data: existing } = await supabase.from("quiz_attempts").select("*").eq("user_id", user.id).eq("quiz_id", quizId).eq("status", "in_progress").maybeSingle();
    let a = existing as Attempt | null;
    if (!a) {
      const ends_at = new Date(Date.now() + qz.duration_minutes * 60 * 1000).toISOString();
      const { data, error } = await supabase.from("quiz_attempts").insert({
        user_id: user.id, quiz_id: quizId, ends_at, status: "in_progress",
        total_questions: list.length,
      }).select().single();
      if (error) return;
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

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);

  const remaining = useMemo(() => attempt ? Math.max(0, new Date(attempt.ends_at).getTime() - now) : 0, [attempt, now]);

  const beginAttempt = async () => {
    if (!user || !quiz) return;
    // Block if user already submitted this quiz
    const { data: submitted } = await supabase
      .from("quiz_attempts").select("id,status").eq("user_id", user.id).eq("quiz_id", quizId)
      .neq("status", "in_progress").limit(1).maybeSingle();
    if (submitted) {
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
      if (error) return;
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
    const answers = answersRef.current;
    if (submittingRef.current || !attempt) return;
    submittingRef.current = true;
    const { error } = await supabase.rpc("submit_quiz_attempt", {
      _attempt_id: attempt.id,
      _answers: answers as any,
      _auto: status === "auto_submitted",
    });
    if (error) {
      submittingRef.current = false;
      return;
    }
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

  if (!quiz) return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="h-12 w-12 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading quiz…</p>
      </div>
    </div>
  );

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="w-full max-w-md rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 sm:p-8 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-5 text-xl sm:text-2xl font-bold leading-tight">{quiz.title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">Preparing your secure exam environment…</p>
          </div>
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/40 border border-border">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div className="text-sm"><span className="font-semibold">{quiz.duration_minutes} min</span> <span className="text-muted-foreground">duration</span></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/40 border border-border">
              <Maximize className="h-5 w-5 text-primary shrink-0" />
              <div className="text-sm text-muted-foreground">Fullscreen mode • No tab switching</div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-warning/10 border border-warning/30">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
              <div className="text-xs text-foreground/80">3 warnings = auto-submit</div>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Starting exam…
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = questions[current];
  const ms = remaining;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const totalDurationMs = quiz.duration_minutes * 60 * 1000;
  const elapsedFrac = Math.min(1, Math.max(0, 1 - ms / totalDurationMs));
  const lowTime = ms < 60_000;
  const criticalTime = ms < 30_000;

  // Circular progress ring math
  const RING_R = 26;
  const RING_C = 2 * Math.PI * RING_R;
  const dash = RING_C * (1 - elapsedFrac);

  return (
    <div className="pt-2 relative">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-border/60 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-primary/10 text-primary px-2.5 text-[10px] font-bold tracking-wider uppercase">
              Q {current + 1}/{questions.length}
            </span>
          </div>
          <div className="font-semibold truncate text-sm sm:text-base mt-1.5">{quiz.title}</div>
        </div>

        {/* Animated timer */}
        <motion.div
          animate={criticalTime ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={criticalTime ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }}
          className={`relative flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-2.5 pr-3 sm:pr-5 py-1.5 sm:py-2 rounded-full border backdrop-blur-md shadow-lg shrink-0 ${
            criticalTime
              ? "border-destructive/60 bg-destructive/10 shadow-destructive/30"
              : lowTime
              ? "border-warning/60 bg-warning/15"
              : "border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5"
          }`}
        >
          {criticalTime && (
            <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ping -z-10" />
          )}

          <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0">
            <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
              <circle cx="30" cy="30" r={RING_R} className="fill-none stroke-foreground/10" strokeWidth="5" />
              <circle
                cx="30" cy="30" r={RING_R}
                className={`fill-none transition-colors duration-300 ${
                  criticalTime ? "stroke-destructive" : lowTime ? "stroke-warning" : "stroke-primary"
                }`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={dash}
                style={{ transition: "stroke-dashoffset 250ms linear" }}
              />
            </svg>
            <Clock className={`h-4 w-4 absolute inset-0 m-auto ${criticalTime ? "text-destructive" : lowTime ? "text-warning" : "text-primary"}`} />
          </div>

          <div className="flex flex-col leading-none">
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              {criticalTime ? "Hurry!" : "Time left"}
            </span>
            <span className={`font-mono text-base sm:text-xl font-bold tabular-nums mt-0 sm:mt-1 ${
              criticalTime ? "text-destructive" : lowTime ? "text-warning" : "text-foreground"
            }`}>
              {h > 0 && `${String(h).padStart(2, "0")}:`}{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Warnings</span>
          <span className={`mt-0.5 font-bold text-base ${attempt && attempt.warnings >= 2 ? "text-destructive" : "text-foreground"}`}>
            {attempt?.warnings ?? 0}<span className="text-muted-foreground font-normal">/{MAX_WARNINGS}</span>
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 -mx-4 sm:-mx-6 bg-muted/60 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="h-full bg-gradient-to-r from-primary via-primary to-primary/60"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-4 sm:gap-6 mt-5 sm:mt-8 pb-12">
        <div>
          <AnimatePresence mode="wait">
            {q && (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl bg-card border border-border/60 p-5 sm:p-8 shadow-xl shadow-foreground/[0.03]"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center h-7 rounded-full bg-foreground text-background px-3 text-xs font-bold">
                    Q{current + 1}
                  </span>
                  <span className="inline-flex items-center h-7 rounded-full bg-primary/10 text-primary px-3 text-[11px] font-semibold uppercase tracking-wider">
                    {q.question_type === "mcq" ? "Multiple choice" : "Descriptive"}
                  </span>
                  <span className="inline-flex items-center h-7 rounded-full bg-accent/60 text-foreground px-3 text-[11px] font-semibold">
                    {q.marks} mark{Number(q.marks) === 1 ? "" : "s"}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-semibold mt-4 whitespace-pre-line leading-snug tracking-tight">
                  {q.question_text}
                </h2>

                {q.question_type === "mcq" ? (
                  <div className="mt-6 space-y-2.5">
                    {(["A","B","C","D"] as const).map((k) => {
                      const text = (q as any)[`option_${k.toLowerCase()}`] as string | null;
                      if (!text) return null;
                      const sel = answers[q.id] === k;
                      return (
                        <button
                          key={k}
                          onClick={() => selectMcq(q.id, k)}
                          className={`group relative w-full text-left px-3.5 sm:px-5 py-3.5 sm:py-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 active:scale-[0.99] overflow-hidden ${
                            sel
                              ? "border-primary bg-gradient-to-r from-primary/15 via-primary/8 to-transparent text-foreground shadow-md shadow-primary/15"
                              : "border-border/70 hover:border-primary/50 hover:bg-accent/40"
                          }`}
                        >
                          <span
                            className={`h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${
                              sel
                                ? "bg-primary text-primary-foreground border-primary scale-105"
                                : "border-border/80 group-hover:border-primary/50 group-hover:bg-background"
                            }`}
                          >
                            {k}
                          </span>
                          <span className="text-sm sm:text-base flex-1">{text}</span>
                          {sel && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_currentColor]"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6">
                    <Textarea
                      rows={8}
                      placeholder="Type your answer here…"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => typeText(q.id, e.target.value)}
                      className="text-sm sm:text-base rounded-2xl border-2 border-border/70 focus-visible:border-primary p-4"
                    />
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      Auto-saved as you type
                    </div>
                  </div>
                )}

                <div className="mt-7 sm:mt-8 flex items-center justify-between gap-2 pt-5 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="h-11 px-5 rounded-xl"
                    disabled={current === 0}
                    onClick={() => setCurrent((c) => c - 1)}
                  >
                    ← Previous
                  </Button>
                  {current < questions.length - 1 ? (
                    <Button
                      className="h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => setCurrent((c) => c + 1)}
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      className="h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
                      onClick={() => autoSubmit("submitted")}
                    >
                      Submit exam ✓
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="rounded-2xl bg-card border border-border p-4 h-fit lg:sticky lg:top-24 order-first lg:order-last">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Question navigator</div>
          <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-5 gap-1.5 sm:gap-2 mt-3">
            {questions.map((qq, i) => {
              const answered = !!answers[qq.id];
              const isCurrent = i === current;
              return (
                <button key={qq.id} onClick={() => setCurrent(i)}
                  className={`h-8 sm:h-9 rounded-md text-xs sm:text-sm font-medium border transition-all active:scale-95 ${
                    isCurrent ? "bg-foreground text-background border-foreground shadow-md" :
                    answered ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25" :
                    "bg-muted text-muted-foreground border-border hover:bg-accent/50"
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
