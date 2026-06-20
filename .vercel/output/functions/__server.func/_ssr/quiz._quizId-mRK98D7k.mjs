import { r as reactExports, W as jsxRuntimeExports } from "./server-B8EOA1g9.mjs";
import { R as Route$1, a as useNavigate, u as useAuth, t as toast } from "./router-DNeZYB4o.mjs";
import { s as supabase } from "./client-AZ_j6hi0.mjs";
import { B as Button } from "./button-DcZS9F61.mjs";
import { T as Textarea } from "./textarea-C0nz0jw0.mjs";
import { I as Input } from "./input-Blk8V4ML.mjs";
import { m as motion } from "./proxy-BeHG2zJT.mjs";
import { S as ShieldCheck } from "./shield-check-BDePd_T5.mjs";
import { V as VideoOff, C as Clock, A as AnimatePresence } from "./video-off-4Lgtz8ao.mjs";
import { c as createLucideIcon } from "./createLucideIcon-BWZTZ3a8.mjs";
import { T as TriangleAlert } from "./triangle-alert-BG-ugjZN.mjs";
import { S as Shield } from "./shield-Cv8wFdiI.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$1 = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
];
const Maximize = createLucideIcon("maximize", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
const MAX_WARNINGS = 3;
const activeAttemptPromises = /* @__PURE__ */ new Map();
function ProctorCameraFeed({
  attemptId,
  initialStream
}) {
  const [stream, setStream] = reactExports.useState(initialStream);
  const [permissionError, setPermissionError] = reactExports.useState(false);
  const [isSimulated, setIsSimulated] = reactExports.useState(false);
  const videoRef = reactExports.useRef(null);
  const intervalRef = reactExports.useRef(null);
  const videoRefCallback = reactExports.useCallback((el) => {
    videoRef.current = el;
    if (el && stream) {
      el.srcObject = stream;
      el.play().catch((err) => console.warn("Proctor stream play failed:", err));
    }
  }, [stream]);
  const updateMockSnapshot = reactExports.useCallback(async () => {
    await supabase.from("quiz_attempts").update({
      camera_snapshot: "simulated",
      camera_active: true,
      camera_updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", attemptId);
  }, [attemptId]);
  reactExports.useEffect(() => {
    let activeStream = null;
    async function startCamera() {
      if (initialStream) {
        setStream(initialStream);
        return;
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 640
            },
            height: {
              ideal: 480
            }
          }
        });
        activeStream = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        console.warn("Failed to get webcam stream, falling back to simulated proctoring feed:", err);
        setPermissionError(true);
        setIsSimulated(true);
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
  const captureAndUpload = reactExports.useCallback(async () => {
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
      ctx.drawImage(video, 0, 0, 320, 240);
      const base64 = canvas.toDataURL("image/jpeg", 0.7);
      await supabase.from("quiz_attempts").update({
        camera_snapshot: base64,
        camera_active: true,
        camera_updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", attemptId);
    } catch (e) {
      console.error("Snapshot capture error:", e);
    }
  }, [stream, attemptId]);
  reactExports.useEffect(() => {
    if (stream) {
      const t = setTimeout(captureAndUpload, 1500);
      intervalRef.current = setInterval(captureAndUpload, 2e3);
      return () => {
        clearTimeout(t);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else if (isSimulated) {
      intervalRef.current = setInterval(updateMockSnapshot, 5e3);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [stream, isSimulated, captureAndUpload, updateMockSnapshot]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-black/95 text-white overflow-hidden relative shadow-lg aspect-video mb-4 flex flex-col justify-center items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-pulse border border-primary/20 rounded-2xl z-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-destructive animate-ping" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-black", children: "REC" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-600", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "PROCTOR ACTIVE" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full text-[9px] font-bold z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 text-primary animate-pulse" }),
      " SECURE"
    ] }),
    stream ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: videoRefCallback, autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover scale-x-[-1]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 m-auto w-24 h-32 border-2 border-dashed border-emerald-500/40 rounded-[50%] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[7px] text-emerald-400/60 uppercase tracking-widest font-semibold", children: "Align Face" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center p-3 text-center bg-zinc-950 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-15 flex flex-wrap gap-2 p-1 justify-center items-center text-[6px] font-mono select-none pointer-events-none", children: Array.from({
        length: 48
      }).map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: idx % 3 === 0 ? "text-emerald-500" : "", children: Math.random() > 0.5 ? "1" : "0" }, idx)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "h-6 w-6 text-warning/80 animate-pulse z-10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-warning/95 mt-2 z-10 uppercase tracking-wider", children: permissionError ? "Webcam Access Blocked" : "Initializing Video Feed..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] text-muted-foreground mt-1 max-w-[200px] leading-normal z-10", children: permissionError ? "Running in secure sandbox mode. Face proctoring is simulated." : "Please grant camera permission to verify your identity." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-primary/30 shadow-[0_0_8px_#3b82f6] animate-[scan_3s_linear_infinite]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[8px] font-mono text-muted-foreground flex justify-between items-end z-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white font-semibold flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1 h-1 rounded-full bg-emerald-400 animate-pulse" }),
          "GAZE STATUS: OK"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "FPS: 15 / RES: 240p" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: "INTELLIGENT PROCTOR v2.4" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      ` })
  ] });
}
function TakeQuiz() {
  const {
    quizId
  } = Route$1.useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [quiz, setQuiz] = reactExports.useState(null);
  const [questions, setQuestions] = reactExports.useState([]);
  const [attempt, setAttempt] = reactExports.useState(null);
  const [answers, setAnswers] = reactExports.useState({});
  const [current, setCurrent] = reactExports.useState(0);
  const [started, setStarted] = reactExports.useState(false);
  const [now, setNow] = reactExports.useState(Date.now());
  const [warningOpen, setWarningOpen] = reactExports.useState(null);
  const [cameraStream, setCameraStream] = reactExports.useState(null);
  const [cameraStatus, setCameraStatus] = reactExports.useState("checking");
  const [cameraError, setCameraError] = reactExports.useState(null);
  const [starting, setStarting] = reactExports.useState(false);
  const previewVideoRefCallback = reactExports.useCallback((el) => {
    if (el && cameraStream) {
      el.srcObject = cameraStream;
      el.play().catch((err) => console.warn("Lobby preview video play failed:", err));
    }
  }, [cameraStream]);
  const submittingRef = reactExports.useRef(false);
  const examStartingRef = reactExports.useRef(false);
  const warningsRef = reactExports.useRef(0);
  const saveTimers = reactExports.useRef({});
  const answersRef = reactExports.useRef({});
  const questionsRef = reactExports.useRef([]);
  const quizRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);
  const attemptRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  reactExports.useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  reactExports.useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);
  reactExports.useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const {
          data: submitted,
          error: subErr
        } = await supabase.from("quiz_attempts").select("id,status").eq("user_id", user.id).eq("quiz_id", quizId).neq("status", "in_progress").limit(1).maybeSingle();
        if (subErr) throw subErr;
        if (submitted) {
          navigate({
            to: "/participant/dashboard"
          });
          return;
        }
        const [{
          data: q2,
          error: qErr
        }, {
          data: qs,
          error: qsErr
        }] = await Promise.all([supabase.from("quizzes").select("*").eq("id", quizId).maybeSingle(), supabase.from("questions").select("id,quiz_id,question_text,question_type,option_a,option_b,option_c,option_d,marks,position,created_at").eq("quiz_id", quizId).order("position")]);
        if (qErr) throw qErr;
        if (qsErr) throw qsErr;
        if (!q2) throw new Error("Exam details not found.");
        setQuiz(q2);
        const list = qs ?? [];
        let mcqs = list.filter((x) => x.question_type === "mcq");
        let oneWords = list.filter((x) => x.question_type === "one_word");
        let descriptives = list.filter((x) => x.question_type === "descriptive");
        if (q2.randomize) {
          mcqs = [...mcqs].sort(() => Math.random() - 0.5);
          oneWords = [...oneWords].sort(() => Math.random() - 0.5);
          descriptives = [...descriptives].sort(() => Math.random() - 0.5);
        }
        const sortedList = [...mcqs, ...oneWords, ...descriptives];
        setQuestions(sortedList);
      } catch (err) {
        console.error("[TakeQuiz] Failed to load exam:", err);
        toast.error(err.message || "Failed to load exam details.");
      }
    })();
  }, [quizId, user, navigate]);
  reactExports.useEffect(() => {
    if (started || !quiz) return;
    let activeStream = null;
    async function checkCamera() {
      try {
        setCameraStatus("checking");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 320
            },
            height: {
              ideal: 240
            }
          }
        });
        activeStream = stream;
        setCameraStream(stream);
        setCameraStatus("allowed");
      } catch (err) {
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
  reactExports.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);
  const remaining = reactExports.useMemo(() => attempt ? Math.max(0, new Date(attempt.ends_at).getTime() - now) : 0, [attempt, now]);
  const beginAttempt = async () => {
    if (!user || !quiz || starting) return;
    setStarting(true);
    examStartingRef.current = true;
    try {
      const {
        data: submitted,
        error: subErr
      } = await supabase.from("quiz_attempts").select("id,status").eq("user_id", user.id).eq("quiz_id", quizId).neq("status", "in_progress").limit(1).maybeSingle();
      if (subErr) throw subErr;
      if (submitted) {
        navigate({
          to: "/participant/dashboard"
        });
        return;
      }
      const {
        data: existing,
        error: existErr
      } = await supabase.from("quiz_attempts").select("*").eq("user_id", user.id).eq("quiz_id", quizId).eq("status", "in_progress").maybeSingle();
      if (existErr) throw existErr;
      let a = existing;
      if (!a) {
        const ends_at = new Date(Date.now() + quiz.duration_minutes * 60 * 1e3).toISOString();
        const {
          data,
          error
        } = await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          quiz_id: quizId,
          ends_at,
          status: "in_progress",
          total_questions: questions.length
        }).select().single();
        if (error) throw error;
        a = data;
      } else {
        const {
          data: saved,
          error: saveErr
        } = await supabase.from("attempt_answers").select("*").eq("attempt_id", a.id);
        if (saveErr) throw saveErr;
        const map = {};
        (saved ?? []).forEach((s2) => {
          if (s2.selected_answer) map[s2.question_id] = s2.selected_answer;
        });
        setAnswers(map);
      }
      setAttempt(a);
      warningsRef.current = a.warnings ?? 0;
      setStarted(true);
      try {
        await document.documentElement.requestFullscreen();
      } catch {
      }
      history.pushState(null, "", location.href);
    } catch (err) {
      console.error("[TakeQuiz] beginAttempt failed:", err);
      toast.error("Failed to start exam: " + (err.message || "Unknown error"));
    } finally {
      setStarting(false);
    }
  };
  const autoSubmit = reactExports.useCallback(async (status = "submitted") => {
    const attempt2 = attemptRef.current;
    const answers2 = answersRef.current;
    if (submittingRef.current || !attempt2) return;
    submittingRef.current = true;
    try {
      const {
        error
      } = await supabase.rpc("submit_quiz_attempt", {
        _attempt_id: attempt2.id,
        _answers: answers2,
        _auto: status === "auto_submitted"
      });
      if (error) {
        console.error("Quiz submission error:", error);
        toast.error("Failed to submit exam. Retrying in 5 seconds...");
        setTimeout(() => {
          submittingRef.current = false;
        }, 5e3);
        return;
      }
      if (user) {
        activeAttemptPromises.delete(`${user.id}-${quizId}`);
      }
      if (document.fullscreenElement) try {
        await document.exitFullscreen();
      } catch {
      }
      navigate({
        to: "/participant/result/$attemptId",
        params: {
          attemptId: attempt2.id
        }
      });
    } catch (err) {
      console.error("Quiz submission exception:", err);
      toast.error("Failed to submit exam. Retrying in 5 seconds...");
      setTimeout(() => {
        submittingRef.current = false;
      }, 5e3);
    }
  }, [navigate, user, quizId]);
  const recordCheat = reactExports.useCallback(async (event_type) => {
    if (!attempt || !user || submittingRef.current) return;
    warningsRef.current = (warningsRef.current ?? 0) + 1;
    const w = warningsRef.current;
    await Promise.all([supabase.from("cheat_events").insert({
      attempt_id: attempt.id,
      user_id: user.id,
      event_type
    }), supabase.from("quiz_attempts").update({
      warnings: w
    }).eq("id", attempt.id)]);
    setAttempt({
      ...attempt,
      warnings: w
    });
    if (w >= MAX_WARNINGS) {
      setWarningOpen(`Maximum warnings reached. Auto-submitting…`);
      autoSubmit("auto_submitted");
    } else {
      setWarningOpen(`Warning ${w}/${MAX_WARNINGS - 1}: ${labelEvent(event_type)}. Next violation will auto-submit your exam.`);
      setTimeout(() => setWarningOpen(null), 4500);
    }
  }, [attempt, user, autoSubmit]);
  reactExports.useEffect(() => {
    if (started && attempt && remaining <= 0 && !submittingRef.current) autoSubmit("auto_submitted");
  }, [started, attempt, remaining, autoSubmit]);
  reactExports.useEffect(() => {
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
    const onBeforeUnload = (e) => {
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
  const saveAnswer = async (qid, value) => {
    if (!attempt) return;
    await supabase.from("attempt_answers").upsert({
      attempt_id: attempt.id,
      question_id: qid,
      selected_answer: value
    }, {
      onConflict: "attempt_id,question_id"
    });
  };
  const selectMcq = (qid, value) => {
    setAnswers((m2) => ({
      ...m2,
      [qid]: value
    }));
    saveAnswer(qid, value);
  };
  const typeText = (qid, value) => {
    setAnswers((m2) => ({
      ...m2,
      [qid]: value
    }));
    if (saveTimers.current[qid]) clearTimeout(saveTimers.current[qid]);
    saveTimers.current[qid] = setTimeout(() => saveAnswer(qid, value), 600);
  };
  if (!quiz) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[80vh] flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Loading quiz…" })
  ] }) });
  if (!started) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "min-h-[85vh] flex items-center justify-center p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-3xl border border-border bg-card shadow-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 sm:p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 text-xl sm:text-2xl font-bold leading-tight", children: quiz.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-2", children: "Set up your camera to enter the exam" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl border border-border bg-black aspect-video overflow-hidden flex flex-col items-center justify-center", children: [
          cameraStatus === "checking" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 mx-auto rounded-full border-2 border-primary/20 border-t-primary animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3", children: "Requesting webcam access..." })
          ] }),
          cameraStatus === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-6 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "h-8 w-8 mx-auto text-destructive animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-destructive uppercase tracking-wider", children: "Webcam Access Blocked" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground max-w-xs leading-normal", children: "Camera permission is strictly required to take this exam. Please enable camera access in your browser settings and reload this page to proceed." })
          ] }),
          cameraStatus === "allowed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("video", { ref: previewVideoRefCallback, autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover scale-x-[-1]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }),
              "CAMERA READY"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 m-auto w-28 h-36 border-2 border-dashed border-primary/40 rounded-[50%] flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-primary/70 uppercase tracking-widest font-semibold", children: "Center Face" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-accent/40 border border-border/50 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 mx-auto text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground mt-1", children: "Duration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-xs text-foreground mt-0.5", children: [
              quiz.duration_minutes,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-accent/40 border border-border/50 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: "h-4 w-4 mx-auto text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground mt-1", children: "Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-xs text-foreground mt-0.5", children: "Fullscreen" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-accent/40 border border-border/50 p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 mx-auto text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-widest text-muted-foreground mt-1", children: "Warnings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-xs text-foreground mt-0.5", children: "Max 3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          cameraStatus === "allowed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: beginAttempt, disabled: starting, className: "w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2", children: starting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" }),
            "Starting..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4" }),
            "Start Exam"
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: true, className: "w-full h-12 rounded-xl bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "h-4 w-4" }),
            "Camera Access Required"
          ] }),
          cameraStatus === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => window.location.reload(), className: "w-full h-10 rounded-xl text-xs font-semibold", children: "Reload Page" })
        ] })
      ] })
    ] }) });
  }
  const q = questions[current];
  const ms = remaining;
  const totalSec = isNaN(ms) ? 0 : Math.max(0, Math.floor(ms / 1e3));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor(totalSec % 3600 / 60);
  const s = totalSec % 60;
  const durationMin = Number(quiz?.duration_minutes) || 1;
  const totalDurationMs = durationMin * 60 * 1e3;
  const elapsedFrac = totalDurationMs > 0 ? Math.min(1, Math.max(0, 1 - ms / totalDurationMs)) : 0;
  const safeElapsedFrac = isNaN(elapsedFrac) ? 0 : elapsedFrac;
  const lowTime = ms < 6e4;
  const criticalTime = ms < 3e4;
  const RING_R = 26;
  const RING_C = 2 * Math.PI * RING_R;
  const dash = RING_C * (1 - safeElapsedFrac);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-border/60 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex h-6 items-center rounded-full bg-primary/10 text-primary px-2.5 text-[10px] font-bold tracking-wider uppercase", children: [
          "Q ",
          current + 1,
          "/",
          questions.length
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate text-sm sm:text-base mt-1.5", children: quiz.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { animate: criticalTime ? {
        scale: [1, 1.04, 1]
      } : {
        scale: 1
      }, transition: criticalTime ? {
        duration: 0.8,
        repeat: Infinity
      } : {
        duration: 0.3
      }, className: `relative flex items-center gap-2.5 sm:gap-3 pl-2 sm:pl-2.5 pr-3 sm:pr-5 py-1.5 sm:py-2 rounded-full border backdrop-blur-md shadow-lg shrink-0 ${criticalTime ? "border-destructive/60 bg-destructive/10 shadow-destructive/30" : lowTime ? "border-warning/60 bg-warning/15" : "border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5"}`, children: [
        criticalTime && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-full bg-destructive/20 animate-ping -z-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-10 w-10 sm:h-12 sm:w-12 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 60 60", className: "h-full w-full -rotate-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "30", cy: "30", r: RING_R, className: "fill-none stroke-foreground/10", strokeWidth: "5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "30", cy: "30", r: RING_R, className: `fill-none transition-colors duration-300 ${criticalTime ? "stroke-destructive" : lowTime ? "stroke-warning" : "stroke-primary"}`, strokeWidth: "5", strokeLinecap: "round", strokeDasharray: RING_C, strokeDashoffset: dash, style: {
              transition: "stroke-dashoffset 250ms linear"
            } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: `h-4 w-4 absolute inset-0 m-auto ${criticalTime ? "text-destructive" : lowTime ? "text-warning" : "text-primary"}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold", children: criticalTime ? "Hurry!" : "Time left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-mono text-base sm:text-xl font-bold tabular-nums mt-0 sm:mt-1 ${criticalTime ? "text-destructive" : lowTime ? "text-warning" : "text-foreground"}`, children: [
            h > 0 && `${String(h).padStart(2, "0")}:`,
            String(m).padStart(2, "0"),
            ":",
            String(s).padStart(2, "0")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex flex-col items-end shrink-0 text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-muted-foreground font-semibold", children: "Warnings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `mt-0.5 font-bold text-base ${attempt && (attempt.warnings || 0) >= 2 ? "text-destructive" : "text-foreground"}`, children: [
          attempt?.warnings || 0,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
            "/",
            MAX_WARNINGS
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 -mx-4 sm:-mx-6 bg-muted/60 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: false, animate: {
      width: `${(current + 1) / questions.length * 100}%`
    }, transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }, className: "h-full bg-gradient-to-r from-primary via-primary to-primary/60" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_260px] gap-4 sm:gap-6 mt-5 sm:mt-8 pb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: q && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: -8
      }, transition: {
        duration: 0.25
      }, className: "rounded-3xl bg-card border border-border/60 p-5 sm:p-8 shadow-xl shadow-foreground/[0.03]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center h-7 rounded-full bg-foreground text-background px-3 text-xs font-bold", children: [
            "Q",
            current + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center h-7 rounded-full bg-primary/10 text-primary px-3 text-[11px] font-semibold uppercase tracking-wider", children: q.question_type === "mcq" ? "Section A: Multiple Choice (Optional)" : q.question_type === "one_word" ? "Section B: One Word Question" : "Section C: Essay / Descriptive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center h-7 rounded-full bg-accent/60 text-foreground px-3 text-[11px] font-semibold", children: [
            q.marks,
            " mark",
            Number(q.marks) === 1 ? "" : "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg sm:text-2xl font-semibold mt-4 whitespace-pre-line leading-snug tracking-tight", children: q.question_text }),
        q.question_type === "mcq" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-2.5", children: ["A", "B", "C", "D"].map((k) => {
          const text = q[`option_${k.toLowerCase()}`];
          if (!text) return null;
          const sel = answers[q.id] === k;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => selectMcq(q.id, k), className: `group relative w-full text-left px-3.5 sm:px-5 py-3.5 sm:py-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 active:scale-[0.99] overflow-hidden ${sel ? "border-primary bg-gradient-to-r from-primary/15 via-primary/8 to-transparent text-foreground shadow-md shadow-primary/15" : "border-border/70 hover:border-primary/50 hover:bg-accent/40"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${sel ? "bg-primary text-primary-foreground border-primary scale-105" : "border-border/80 group-hover:border-primary/50 group-hover:bg-background"}`, children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm sm:text-base flex-1", children: text }),
            sel && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { initial: {
              scale: 0
            }, animate: {
              scale: 1
            }, className: "h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_currentColor]" })
          ] }, k);
        }) }) : q.question_type === "one_word" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Type your one-word answer here…", value: answers[q.id] ?? "", onChange: (e) => typeText(q.id, e.target.value), className: "text-sm sm:text-base rounded-2xl border-2 border-border/70 focus-visible:border-primary px-4 h-13" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-success animate-pulse" }),
            "Auto-saved as you type"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 8, placeholder: "Type your answer here…", value: answers[q.id] ?? "", onChange: (e) => typeText(q.id, e.target.value), className: "text-sm sm:text-base rounded-2xl border-2 border-border/70 focus-visible:border-primary p-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-success animate-pulse" }),
            "Auto-saved as you type"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 sm:mt-8 flex items-center justify-between gap-2 pt-5 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "h-11 px-5 rounded-xl", disabled: current === 0, onClick: () => setCurrent((c) => c - 1), children: "← Previous" }),
          current < questions.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "h-11 px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90", onClick: () => setCurrent((c) => c + 1), children: "Next →" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25", onClick: () => autoSubmit("submitted"), children: "Submit exam ✓" })
        ] })
      ] }, q.id) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-3xl bg-card border border-border/60 p-5 h-fit lg:sticky lg:top-28 order-first lg:order-last shadow-lg shadow-foreground/[0.03]", children: [
        attempt && /* @__PURE__ */ jsxRuntimeExports.jsx(ProctorCameraFeed, { attemptId: attempt.id, initialStream: cameraStream }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-bold", children: "Navigator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full", children: [
            Object.keys(answers).filter((k) => answers[k]).length,
            "/",
            questions.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 mt-4", children: ["mcq", "one_word", "descriptive"].map((type) => {
          const qsInSec = questions.filter((x) => x.question_type === type);
          if (qsInSec.length === 0) return null;
          const title = type === "mcq" ? "Sec A: MCQ (Optional)" : type === "one_word" ? "Sec B: One Word" : "Sec C: Essay / Descriptive";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground/90", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-1.5", children: qsInSec.map((qq) => {
              const idx = questions.findIndex((x) => x.id === qq.id);
              const answered = !!answers[qq.id];
              const isCurrent = idx === current;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCurrent(idx), className: `h-9 rounded-lg text-xs font-bold border-2 transition-all active:scale-90 ${isCurrent ? "bg-foreground text-background border-foreground shadow-lg ring-2 ring-foreground/20 scale-105" : answered ? "bg-primary/15 text-primary border-primary/40 hover:bg-primary/25 hover:scale-105" : "bg-background text-muted-foreground border-border/70 hover:border-primary/30 hover:bg-accent/40"}`, children: idx + 1 }, qq.id);
            }) })
          ] }, type);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 pt-4 border-t border-border/50 text-[11px] space-y-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded bg-primary/30 border border-primary/40" }),
            " Answered"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded bg-background border-2 border-border/70" }),
            " ",
            "Unanswered"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded bg-foreground" }),
            " Current"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: warningOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "fixed inset-0 bg-destructive/30 backdrop-blur-sm z-50 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      scale: 0.9
    }, animate: {
      scale: 1
    }, className: "bg-card rounded-2xl shadow-2xl p-8 max-w-md text-center border-2 border-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-10 w-10 text-destructive mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-bold", children: "Cheating detected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: warningOpen }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-6", onClick: async () => {
        setWarningOpen(null);
        try {
          await document.documentElement.requestFullscreen();
        } catch {
        }
      }, children: "I understand" })
    ] }) }) })
  ] });
}
function labelEvent(t) {
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
export {
  TakeQuiz as component
};
