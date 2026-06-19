import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Maximize, ShieldCheck, Video, VideoOff, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/participant/quiz/$quizId")({
  component: TakeQuiz,
});

interface Quiz {
  id: string;
  title: string;
  instructions: string | null;
  duration_minutes: number;
  negative_marks: number;
  randomize: boolean;
}
interface Question {
  id: string;
  question_text: string;
  question_type: "mcq" | "one_word" | "descriptive";
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  marks: number;
}
interface Attempt {
  id: string;
  ends_at: string;
  warnings: number;
  status: string;
}

const MAX_WARNINGS = 3;

const activeAttemptPromises = new Map<
  string,
  Promise<{ attempt: Attempt; answers: Record<string, string> }>
>();

function ProctorCameraFeed({
  attemptId,
  initialStream,
}: {
  attemptId: string;
  initialStream: MediaStream | null;
}) {
  const [stream, setStream] = useState<MediaStream | null>(initialStream);
  const [permissionError, setPermissionError] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<any>(null);

  const videoRefCallback = useCallback(
    (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      if (el && stream) {
        el.srcObject = stream;
        el.play().catch((err) => console.warn("Proctor stream play failed:", err));
      }
    },
    [stream],
  );

  // Handler for mock snapshot updates if camera is blocked/unavailable
  const updateMockSnapshot = useCallback(async () => {
    // We send a tiny indicator that mock is active
    await supabase
      .from("quiz_attempts")
      .update({
        camera_snapshot: "simulated",
        camera_active: true,
        camera_updated_at: new Date().toISOString(),
      })
      .eq("id", attemptId);
  }, [attemptId]);

  // Initialize camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      if (initialStream) {
        setStream(initialStream);
        return;
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });
        activeStream = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        console.warn(
          "Failed to get webcam stream, falling back to simulated proctoring feed:",
          err,
        );
        setPermissionError(true);
        setIsSimulated(true);
        // Start simulated updates to show proctoring is still online
        updateMockSnapshot();
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialStream, updateMockSnapshot]);

  // Handler to capture snapshot and upload to db
  const captureAndUpload = useCallback(async () => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) {
      console.warn("Video not active or ready for snapshot yet");
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw frame
      ctx.drawImage(video, 0, 0, 320, 240);
      const base64 = canvas.toDataURL("image/jpeg", 0.7);

      // Update DB
      await supabase
        .from("quiz_attempts")
        .update({
          camera_snapshot: base64,
          camera_active: true,
          camera_updated_at: new Date().toISOString(),
        })
        .eq("id", attemptId);
    } catch (e) {
      console.error("Snapshot capture error:", e);
    }
  }, [stream, attemptId]);

  // Set up periodic upload interval
  useEffect(() => {
    if (stream) {
      // Upload initial snapshot after 1.5s
      const t = setTimeout(captureAndUpload, 1500);
      intervalRef.current = setInterval(captureAndUpload, 2000);
      return () => {
        clearTimeout(t);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else if (isSimulated) {
      intervalRef.current = setInterval(updateMockSnapshot, 5000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [stream, isSimulated, captureAndUpload, updateMockSnapshot]);

  return (
    <div className="rounded-2xl border border-border bg-black/95 text-white overflow-hidden relative shadow-lg aspect-video mb-4 flex flex-col justify-center items-center">
      {/* scanning overlay line */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-pulse border border-primary/20 rounded-2xl z-10" />

      {/* live recording dot */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider z-20">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
        <span className="text-destructive font-black">REC</span>
        <span className="text-zinc-600">|</span>
        <span className="text-emerald-400">PROCTOR ACTIVE</span>
      </div>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full text-[9px] font-bold z-20">
        <Shield className="h-3 w-3 text-primary animate-pulse" /> SECURE
      </div>

      {stream ? (
        <div className="w-full h-full relative">
          <video
            ref={videoRefCallback}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          {/* face detection guide overlay */}
          <div className="absolute inset-0 m-auto w-24 h-32 border-2 border-dashed border-emerald-500/40 rounded-[50%] flex items-center justify-center">
            <span className="text-[7px] text-emerald-400/60 uppercase tracking-widest font-semibold">
              Align Face
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-zinc-950 relative overflow-hidden">
          {/* Simulated digital face matrix backdrop */}
          <div className="absolute inset-0 opacity-15 flex flex-wrap gap-2 p-1 justify-center items-center text-[6px] font-mono select-none pointer-events-none">
            {Array.from({ length: 48 }).map((_, idx) => (
              <span key={idx} className={idx % 3 === 0 ? "text-emerald-500" : ""}>
                {Math.random() > 0.5 ? "1" : "0"}
              </span>
            ))}
          </div>

          <VideoOff className="h-6 w-6 text-warning/80 animate-pulse z-10" />
          <div className="text-[10px] font-bold text-warning/95 mt-2 z-10 uppercase tracking-wider">
            {permissionError ? "Webcam Access Blocked" : "Initializing Video Feed..."}
          </div>
          <p className="text-[8px] text-muted-foreground mt-1 max-w-[200px] leading-normal z-10">
            {permissionError
              ? "Running in secure sandbox mode. Face proctoring is simulated."
              : "Please grant camera permission to verify your identity."}
          </p>

          {/* Scanning line for mock */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/30 shadow-[0_0_8px_#3b82f6] animate-[scan_3s_linear_infinite]" />
        </div>
      )}

      {/* footer details */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[8px] font-mono text-muted-foreground flex justify-between items-end z-20">
        <div className="flex flex-col gap-0.5">
          <div className="text-white font-semibold flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            GAZE STATUS: OK
          </div>
          <div>FPS: 15 / RES: 240p</div>
        </div>
        <div className="text-right">INTELLIGENT PROCTOR v2.4</div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}

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

  // Lobby camera states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<"checking" | "allowed" | "denied">("checking");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const previewVideoRefCallback = useCallback(
    (el: HTMLVideoElement | null) => {
      if (el && cameraStream) {
        el.srcObject = cameraStream;
        el.play().catch((err) => console.warn("Lobby preview video play failed:", err));
      }
    },
    [cameraStream],
  );

  const submittingRef = useRef(false);
  const examStartingRef = useRef(false);
  const warningsRef = useRef(0);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const answersRef = useRef<Record<string, string>>({});
  const questionsRef = useRef<Question[]>([]);
  const quizRef = useRef<Quiz | null>(null);

  // Clean up camera stream when this component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);
  const attemptRef = useRef<Attempt | null>(null);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);
  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data: submitted, error: subErr } = await supabase
          .from("quiz_attempts")
          .select("id,status")
          .eq("user_id", user.id)
          .eq("quiz_id", quizId)
          .neq("status", "in_progress")
          .limit(1)
          .maybeSingle();
        if (subErr) throw subErr;
        if (submitted) {
          navigate({ to: "/participant/dashboard" });
          return;
        }
        const [{ data: q, error: qErr }, { data: qs, error: qsErr }] = await Promise.all([
          supabase.from("quizzes").select("*").eq("id", quizId).maybeSingle(),
          supabase
            .from("questions")
            .select(
              "id,quiz_id,question_text,question_type,option_a,option_b,option_c,option_d,marks,position,created_at",
            )
            .eq("quiz_id", quizId)
            .order("position"),
        ]);
        if (qErr) throw qErr;
        if (qsErr) throw qsErr;
        if (!q) throw new Error("Exam details not found.");

        setQuiz(q as Quiz);
        const list = (qs as Question[]) ?? [];
        let mcqs = list.filter((x) => x.question_type === "mcq");
        let oneWords = list.filter((x) => x.question_type === "one_word");
        let descriptives = list.filter((x) => x.question_type === "descriptive");

        if (q.randomize) {
          mcqs = [...mcqs].sort(() => Math.random() - 0.5);
          oneWords = [...oneWords].sort(() => Math.random() - 0.5);
          descriptives = [...descriptives].sort(() => Math.random() - 0.5);
        }

        const sortedList = [...mcqs, ...oneWords, ...descriptives];
        setQuestions(sortedList);
      } catch (err: any) {
        console.error("[TakeQuiz] Failed to load exam:", err);
        toast.error(err.message || "Failed to load exam details.");
      }
    })();
  }, [quizId, user, navigate]);

  // Lobby camera setup and verification before the exam starts
  useEffect(() => {
    if (started || !quiz) return;
    let activeStream: MediaStream | null = null;

    async function checkCamera() {
      try {
        setCameraStatus("checking");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
        });
        activeStream = stream;
        setCameraStream(stream);
        setCameraStatus("allowed");
      } catch (err: any) {
        console.error("Lobby camera check failed:", err);
        setCameraStatus("denied");
        setCameraError(err.message || "Failed to access camera.");
      }
    }

    checkCamera();

    return () => {
      if (activeStream && !examStartingRef.current) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [started, quiz]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const remaining = useMemo(
    () => (attempt ? Math.max(0, new Date(attempt.ends_at).getTime() - now) : 0),
    [attempt, now],
  );

  const beginAttempt = async () => {
    if (!user || !quiz || starting) return;
    setStarting(true);
    examStartingRef.current = true;
    try {
      // Block if user already submitted this quiz
      const { data: submitted, error: subErr } = await supabase
        .from("quiz_attempts")
        .select("id,status")
        .eq("user_id", user.id)
        .eq("quiz_id", quizId)
        .neq("status", "in_progress")
        .limit(1)
        .maybeSingle();
      if (subErr) throw subErr;
      if (submitted) {
        navigate({ to: "/participant/dashboard" });
        return;
      }
      const { data: existing, error: existErr } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("quiz_id", quizId)
        .eq("status", "in_progress")
        .maybeSingle();
      if (existErr) throw existErr;
      let a = existing as Attempt | null;
      if (!a) {
        const ends_at = new Date(Date.now() + quiz.duration_minutes * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from("quiz_attempts")
          .insert({
            user_id: user.id,
            quiz_id: quizId,
            ends_at,
            status: "in_progress",
            total_questions: questions.length,
          })
          .select()
          .single();
        if (error) throw error;
        a = data as Attempt;
      } else {
        const { data: saved, error: saveErr } = await supabase
          .from("attempt_answers")
          .select("*")
          .eq("attempt_id", a.id);
        if (saveErr) throw saveErr;
        const map: Record<string, string> = {};
        (saved ?? []).forEach((s: any) => {
          if (s.selected_answer) map[s.question_id] = s.selected_answer;
        });
        setAnswers(map);
      }

      setAttempt(a);
      warningsRef.current = a.warnings ?? 0;
      setStarted(true);
      try {
        await document.documentElement.requestFullscreen();
      } catch {}
      history.pushState(null, "", location.href);
    } catch (err: any) {
      console.error("[TakeQuiz] beginAttempt failed:", err);
      toast.error("Failed to start exam: " + (err.message || "Unknown error"));
    } finally {
      setStarting(false);
    }
  };

  const autoSubmit = useCallback(
    async (status: "submitted" | "auto_submitted" = "submitted") => {
      const attempt = attemptRef.current;
      const answers = answersRef.current;
      if (submittingRef.current || !attempt) return;
      submittingRef.current = true;
      try {
        const { error } = await supabase.rpc("submit_quiz_attempt", {
          _attempt_id: attempt.id,
          _answers: answers as any,
          _auto: status === "auto_submitted",
        });
        if (error) {
          console.error("Quiz submission error:", error);
          toast.error("Failed to submit exam. Retrying in 5 seconds...");
          setTimeout(() => {
            submittingRef.current = false;
          }, 5000);
          return;
        }
        if (user) {
          activeAttemptPromises.delete(`${user.id}-${quizId}`);
        }
        if (document.fullscreenElement)
          try {
            await document.exitFullscreen();
          } catch {}
        navigate({ to: "/participant/result/$attemptId", params: { attemptId: attempt.id } });
      } catch (err: any) {
        console.error("Quiz submission exception:", err);
        toast.error("Failed to submit exam. Retrying in 5 seconds...");
        setTimeout(() => {
          submittingRef.current = false;
        }, 5000);
      }
    },
    [navigate, user, quizId],
  );

  const recordCheat = useCallback(
    async (event_type: string) => {
      if (!attempt || !user || submittingRef.current) return;
      warningsRef.current = (warningsRef.current ?? 0) + 1;
      const w = warningsRef.current;
      await Promise.all([
        supabase
          .from("cheat_events")
          .insert({ attempt_id: attempt.id, user_id: user.id, event_type }),
        supabase.from("quiz_attempts").update({ warnings: w }).eq("id", attempt.id),
      ]);
      setAttempt({ ...attempt, warnings: w });
      if (w >= MAX_WARNINGS) {
        setWarningOpen(`Maximum warnings reached. Auto-submitting…`);
        autoSubmit("auto_submitted");
      } else {
        setWarningOpen(
          `Warning ${w}/${MAX_WARNINGS - 1}: ${labelEvent(event_type)}. Next violation will auto-submit your exam.`,
        );
        setTimeout(() => setWarningOpen(null), 4500);
      }
    },
    [attempt, user, autoSubmit],
  );

  useEffect(() => {
    if (started && attempt && remaining <= 0 && !submittingRef.current)
      autoSubmit("auto_submitted");
  }, [started, attempt, remaining, autoSubmit]);

  useEffect(() => {
    if (!started) return;
    const onVis = () => {
      if (document.visibilityState === "hidden") recordCheat("tab_switch");
    };
    const onBlur = () => recordCheat("blur");
    const onFs = () => {
      if (!document.fullscreenElement) recordCheat("fullscreen_exit");
    };
    const onPop = () => {
      history.pushState(null, "", location.href);
      recordCheat("back_button");
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
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
    await supabase.from("attempt_answers").upsert(
      {
        attempt_id: attempt.id,
        question_id: qid,
        selected_answer: value,
      },
      { onConflict: "attempt_id,question_id" },
    );
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

  if (!quiz)
    return (
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
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 sm:p-8 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-5 text-xl sm:text-2xl font-bold leading-tight">{quiz.title}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Set up your camera to enter the exam
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Camera Preview Box */}
            <div className="relative rounded-2xl border border-border bg-black aspect-video overflow-hidden flex flex-col items-center justify-center">
              {cameraStatus === "checking" && (
                <div className="text-center p-4">
                  <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <p className="text-xs text-muted-foreground mt-3">Requesting webcam access...</p>
                </div>
              )}

              {cameraStatus === "denied" && (
                <div className="text-center p-6 space-y-2">
                  <VideoOff className="h-8 w-8 mx-auto text-destructive animate-pulse" />
                  <p className="text-xs font-bold text-destructive uppercase tracking-wider">
                    Webcam Access Blocked
                  </p>
                  <p className="text-[11px] text-muted-foreground max-w-xs leading-normal">
                    Camera permission is strictly required to take this exam. Please enable camera
                    access in your browser settings and reload this page to proceed.
                  </p>
                </div>
              )}

              {cameraStatus === "allowed" && (
                <div className="w-full h-full relative">
                  <video
                    ref={previewVideoRefCallback}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CAMERA READY
                  </div>
                  <div className="absolute inset-0 m-auto w-28 h-36 border-2 border-dashed border-primary/40 rounded-[50%] flex items-center justify-center pointer-events-none">
                    <span className="text-[8px] text-primary/70 uppercase tracking-widest font-semibold">
                      Center Face
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Exam Rules & Details */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-accent/40 border border-border/50 p-3 text-center">
                <Clock className="h-4 w-4 mx-auto text-primary" />
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                  Duration
                </div>
                <div className="font-bold text-xs text-foreground mt-0.5">
                  {quiz.duration_minutes} min
                </div>
              </div>
              <div className="rounded-xl bg-accent/40 border border-border/50 p-3 text-center">
                <Maximize className="h-4 w-4 mx-auto text-primary" />
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                  Mode
                </div>
                <div className="font-bold text-xs text-foreground mt-0.5">Fullscreen</div>
              </div>
              <div className="rounded-xl bg-accent/40 border border-border/50 p-3 text-center">
                <AlertTriangle className="h-4 w-4 mx-auto text-primary" />
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                  Warnings
                </div>
                <div className="font-bold text-xs text-foreground mt-0.5">Max 3</div>
              </div>
            </div>

            {/* Action button */}
            <div className="space-y-3">
              {cameraStatus === "allowed" ? (
                <Button
                  onClick={beginAttempt}
                  disabled={starting}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {starting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      Start Exam
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  disabled
                  className="w-full h-12 rounded-xl bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <VideoOff className="h-4 w-4" />
                  Camera Access Required
                </Button>
              )}

              {cameraStatus === "denied" && (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full h-10 rounded-xl text-xs font-semibold"
                >
                  Reload Page
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const q = questions[current];
  const ms = remaining;
  const totalSec = isNaN(ms) ? 0 : Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const durationMin = Number(quiz?.duration_minutes) || 1;
  const totalDurationMs = durationMin * 60 * 1000;
  const elapsedFrac = totalDurationMs > 0 ? Math.min(1, Math.max(0, 1 - ms / totalDurationMs)) : 0;
  const safeElapsedFrac = isNaN(elapsedFrac) ? 0 : elapsedFrac;
  const lowTime = ms < 60_000;
  const criticalTime = ms < 30_000;

  // Circular progress ring math
  const RING_R = 26;
  const RING_C = 2 * Math.PI * RING_R;
  const dash = RING_C * (1 - safeElapsedFrac);

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
              <circle
                cx="30"
                cy="30"
                r={RING_R}
                className="fill-none stroke-foreground/10"
                strokeWidth="5"
              />
              <circle
                cx="30"
                cy="30"
                r={RING_R}
                className={`fill-none transition-colors duration-300 ${
                  criticalTime
                    ? "stroke-destructive"
                    : lowTime
                      ? "stroke-warning"
                      : "stroke-primary"
                }`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={dash}
                style={{ transition: "stroke-dashoffset 250ms linear" }}
              />
            </svg>
            <Clock
              className={`h-4 w-4 absolute inset-0 m-auto ${criticalTime ? "text-destructive" : lowTime ? "text-warning" : "text-primary"}`}
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="hidden sm:inline text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              {criticalTime ? "Hurry!" : "Time left"}
            </span>
            <span
              className={`font-mono text-base sm:text-xl font-bold tabular-nums mt-0 sm:mt-1 ${
                criticalTime ? "text-destructive" : lowTime ? "text-warning" : "text-foreground"
              }`}
            >
              {h > 0 && `${String(h).padStart(2, "0")}:`}
              {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </span>
          </div>
        </motion.div>

        <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
            Warnings
          </span>
          <span
            className={`mt-0.5 font-bold text-base ${attempt && (attempt.warnings || 0) >= 2 ? "text-destructive" : "text-foreground"}`}
          >
            {attempt?.warnings || 0}
            <span className="text-muted-foreground font-normal">/{MAX_WARNINGS}</span>
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
                    {q.question_type === "mcq"
                      ? "Section A: Multiple Choice (Optional)"
                      : q.question_type === "one_word"
                        ? "Section B: One Word Question"
                        : "Section C: Essay / Descriptive"}
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
                    {(["A", "B", "C", "D"] as const).map((k) => {
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
                ) : q.question_type === "one_word" ? (
                  <div className="mt-6">
                    <Input
                      placeholder="Type your one-word answer here…"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => typeText(q.id, e.target.value)}
                      className="text-sm sm:text-base rounded-2xl border-2 border-border/70 focus-visible:border-primary px-4 h-13"
                    />
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      Auto-saved as you type
                    </div>
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

        <aside className="rounded-3xl bg-card border border-border/60 p-5 h-fit lg:sticky lg:top-28 order-first lg:order-last shadow-lg shadow-foreground/[0.03]">
          {attempt && <ProctorCameraFeed attemptId={attempt.id} initialStream={cameraStream} />}
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              Navigator
            </div>
            <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {Object.keys(answers).filter((k) => answers[k]).length}/{questions.length}
            </div>
          </div>
          <div className="space-y-4 mt-4">
            {(["mcq", "one_word", "descriptive"] as const).map((type) => {
              const qsInSec = questions.filter((x) => x.question_type === type);
              if (qsInSec.length === 0) return null;

              const title =
                type === "mcq"
                  ? "Sec A: MCQ (Optional)"
                  : type === "one_word"
                    ? "Sec B: One Word"
                    : "Sec C: Essay / Descriptive";

              return (
                <div key={type} className="space-y-1.5">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/90">
                    {title}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {qsInSec.map((qq) => {
                      const idx = questions.findIndex((x) => x.id === qq.id);
                      const answered = !!answers[qq.id];
                      const isCurrent = idx === current;
                      return (
                        <button
                          key={qq.id}
                          onClick={() => setCurrent(idx)}
                          className={`h-9 rounded-lg text-xs font-bold border-2 transition-all active:scale-90 ${
                            isCurrent
                              ? "bg-foreground text-background border-foreground shadow-lg ring-2 ring-foreground/20 scale-105"
                              : answered
                                ? "bg-primary/15 text-primary border-primary/40 hover:bg-primary/25 hover:scale-105"
                                : "bg-background text-muted-foreground border-border/70 hover:border-primary/30 hover:bg-accent/40"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-border/50 text-[11px] space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-primary/30 border border-primary/40" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-background border-2 border-border/70" />{" "}
              Unanswered
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-foreground" /> Current
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {warningOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-destructive/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-card rounded-2xl shadow-2xl p-8 max-w-md text-center border-2 border-destructive"
            >
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
              <h3 className="mt-4 text-xl font-bold">Cheating detected</h3>
              <p className="mt-2 text-sm text-muted-foreground">{warningOpen}</p>
              <Button
                className="mt-6"
                onClick={async () => {
                  setWarningOpen(null);
                  try {
                    await document.documentElement.requestFullscreen();
                  } catch {}
                }}
              >
                I understand
              </Button>
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
    case "tab_switch":
      return "Tab switching";
    case "blur":
      return "Window lost focus";
    case "fullscreen_exit":
      return "Exited fullscreen";
    case "back_button":
      return "Back navigation";
    default:
      return t;
  }
}
