import { r as reactExports, W as jsxRuntimeExports } from "./server-C3gF_KGv.mjs";
import { u as useServerFn, g as gradeAnswer } from "./admin.functions-BlJwErq1.mjs";
import { s as supabase } from "./client-CQKuL4Od.mjs";
import { B as Button } from "./button-BF2ERPU9.mjs";
import { I as Input } from "./input-DeQqsyXa.mjs";
import { f as formatDisplayName } from "./router-CB7u3EHj.mjs";
import { T as Trophy } from "./trophy-BR3-DP5d.mjs";
import { c as createLucideIcon } from "./createLucideIcon-DENqpDGy.mjs";
import { X } from "./x-BQInAmTD.mjs";
import { C as Check } from "./check-p2eBwieT.mjs";
import { T as TriangleAlert } from "./triangle-alert-CORH2Nm-.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./types-BoWyrJuk.mjs";
const __iconNode = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode);
function fmtExact(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
  const time = d.toLocaleTimeString(void 0, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  return `${date} · ${time}`;
}
function fmtDuration(startIso, endIso) {
  if (!startIso || !endIso) return null;
  const startTime = new Date(startIso).getTime();
  const endTime = new Date(endIso).getTime();
  if (isNaN(startTime) || isNaN(endTime)) return null;
  const ms = endTime - startTime;
  if (ms < 0) return null;
  const s = Math.floor(ms / 1e3);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}
function ResultsPage() {
  const [rows, setRows] = reactExports.useState([]);
  const [quizFilter, setQuizFilter] = reactExports.useState("");
  const [quizzes, setQuizzes] = reactExports.useState([]);
  const [openId, setOpenId] = reactExports.useState(null);
  const load = async () => {
    const [{
      data: a
    }, {
      data: p
    }, {
      data: q
    }] = await Promise.all([supabase.from("quiz_attempts").select("*").not("submitted_at", "is", null).order("score", {
      ascending: false
    }), supabase.from("profiles").select("id, username, display_name"), supabase.from("quizzes").select("id, title")]);
    const pMap = Object.fromEntries((p ?? []).map((x) => [x.id, formatDisplayName(x.display_name, x.username)]));
    const qMap = Object.fromEntries((q ?? []).map((x) => [x.id, x.title]));
    setQuizzes(q ?? []);
    setRows((a ?? []).map((r) => ({
      ...r,
      username: pMap[r.user_id],
      quiz_title: qMap[r.quiz_id]
    })));
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const filtered = quizFilter ? rows.filter((r) => r.quiz_id === quizFilter) : rows;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-6 w-6 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold", children: "Results & Leaderboard" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Full visibility of every candidate's answers, including descriptive responses." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 text-sm", value: quizFilter, onChange: (e) => setQuizFilter(e.target.value), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All quizzes" }),
      quizzes.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: q.id, children: q.title }, q.id))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2 w-16", children: "Rank" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Candidate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Quiz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Correct" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Warnings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Submitted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-10 text-center text-muted-foreground", children: "No submissions yet." }) }),
          filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-bold text-primary", children: [
              "#",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: r.username }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: r.quiz_title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold", children: r.score }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              r.correct_count,
              "/",
              r.total_questions
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: r.warnings || 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-foreground", children: fmtExact(r.submitted_at) }),
              fmtDuration(r.started_at, r.submitted_at) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] mt-0.5", children: [
                "Took ",
                fmtDuration(r.started_at, r.submitted_at)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setOpenId(r.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "View"
            ] }) })
          ] }, r.id))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden divide-y divide-border", children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-10 text-center text-muted-foreground text-sm", children: "No submissions yet." }),
        filtered.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
                  "#",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold truncate", children: r.username })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate mt-0.5", children: r.quiz_title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setOpenId(r.id), className: "shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-1" }),
              "View"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Score" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.score })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Correct" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                r.correct_count,
                "/",
                r.total_questions
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Warn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.warnings || 0 })
            ] })
          ] }),
          r.submitted_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-muted-foreground font-mono", children: [
            fmtExact(r.submitted_at),
            fmtDuration(r.started_at, r.submitted_at) && ` · Took ${fmtDuration(r.started_at, r.submitted_at)}`
          ] })
        ] }, r.id))
      ] })
    ] }),
    openId && /* @__PURE__ */ jsxRuntimeExports.jsx(AttemptDetail, { attemptId: openId, onClose: () => {
      setOpenId(null);
      load();
    } })
  ] });
}
function AttemptDetail({
  attemptId,
  onClose
}) {
  const [attempt, setAttempt] = reactExports.useState(null);
  const [rows, setRows] = reactExports.useState([]);
  const [candidate, setCandidate] = reactExports.useState("");
  const [quizTitle, setQuizTitle] = reactExports.useState("");
  const [grading, setGrading] = reactExports.useState({});
  const grade = useServerFn(gradeAnswer);
  const load = async () => {
    const {
      data: a
    } = await supabase.from("quiz_attempts").select("*").eq("id", attemptId).maybeSingle();
    if (!a) return;
    setAttempt(a);
    const [{
      data: prof
    }, {
      data: quiz
    }, {
      data: qs
    }, {
      data: ans
    }] = await Promise.all([supabase.from("profiles").select("username, display_name").eq("id", a.user_id).maybeSingle(), supabase.from("quizzes").select("title").eq("id", a.quiz_id).maybeSingle(), supabase.rpc("admin_get_questions", {
      _quiz_id: a.quiz_id
    }), supabase.from("attempt_answers").select("*").eq("attempt_id", attemptId)]);
    setCandidate(formatDisplayName(prof?.display_name, prof?.username));
    setQuizTitle(quiz?.title ?? "");
    const aMap = Object.fromEntries((ans ?? []).map((x) => [x.question_id, x]));
    const orderMap = {
      mcq: 0,
      one_word: 1,
      descriptive: 2
    };
    const sortedQs = [...qs ?? []].sort((a2, b) => {
      const typeA = a2.question_type ?? "mcq";
      const typeB = b.question_type ?? "mcq";
      if (typeA !== typeB) {
        return (orderMap[typeA] ?? 9) - (orderMap[typeB] ?? 9);
      }
      return (a2.position ?? 0) - (b.position ?? 0);
    });
    setRows(sortedQs.map((q) => ({
      question: q,
      answer: aMap[q.id] ?? null
    })));
    const g = {};
    (ans ?? []).forEach((x) => {
      if (x.manual_score != null) g[x.id] = Number(x.manual_score);
    });
    setGrading(g);
  };
  reactExports.useEffect(() => {
    load();
  }, [attemptId]);
  const submitGrade = async (answerId) => {
    const v = grading[answerId];
    if (v === void 0 || v === null || v === "") return;
    const num = Number(v);
    if (isNaN(num)) return;
    try {
      await grade({
        data: {
          answer_id: answerId,
          manual_score: num
        }
      });
      load();
    } catch (e) {
    }
  };
  if (!attempt) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold", children: "Full answer sheet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold", children: [
          candidate,
          " · ",
          quizTitle
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
          "Score ",
          attempt.score,
          " · ",
          attempt.correct_count,
          "/",
          attempt.total_questions,
          " correct ·",
          " ",
          attempt.warnings || 0,
          " warning",
          (attempt.warnings || 0) === 1 ? "" : "s",
          " ·",
          " ",
          attempt.status.replace("_", " ")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 font-mono", children: [
          "Submitted: ",
          fmtExact(attempt.submitted_at),
          fmtDuration(attempt.started_at, attempt.submitted_at) && ` · Time taken: ${fmtDuration(attempt.started_at, attempt.submitted_at)}`
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-4", children: rows.map(({
      question: q,
      answer
    }, i) => {
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
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold", children: isMcq ? "MCQ (Optional)" : isOneWord ? "One Word" : "Descriptive (Essay)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            q.marks,
            " mark",
            Number(q.marks) === 1 ? "" : "s"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold mt-2 whitespace-pre-line", children: [
          "Q",
          i + 1,
          ". ",
          q.question_text
        ] }),
        isMcq ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-2 gap-2 text-sm", children: ["A", "B", "C", "D"].map((k) => {
          const v = q[`option_${k.toLowerCase()}`];
          if (!v) return null;
          const isCorrectOpt = q.correct_answer === k;
          const isSelected = sel === k;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-3 py-2 rounded-lg border flex items-center gap-2 ${isCorrectOpt ? "border-success bg-success/10" : isSelected ? "border-destructive bg-destructive/10" : "border-border"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
              k,
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: v }),
            isCorrectOpt && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-success" }),
            isSelected && !isCorrectOpt && /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-destructive" })
          ] }, k);
        }) }) : isOneWord ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold", children: "Candidate's answer" }),
          sel ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg p-3 text-sm font-mono border ${isCorrect ? "border-success bg-success/5 text-success font-semibold" : "border-destructive bg-destructive/5 text-destructive font-semibold"}`, children: sel }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground italic", children: "No answer provided" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Correct answer: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono bg-success/10 text-success px-2 py-0.5 rounded font-semibold", children: q.correct_answer })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1", children: "Candidate's answer" }),
          sel ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/40 border border-border p-3 text-sm whitespace-pre-wrap", children: sel }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground italic", children: "No answer provided" }),
          answer?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-muted-foreground", children: [
                "Award marks (0 – ",
                q.marks,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.25", min: 0, max: Number(q.marks), value: grading[answer.id] ?? answer.manual_score ?? "", onChange: (e) => setGrading((g) => ({
                ...g,
                [answer.id]: e.target.value
              })) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => submitGrade(answer.id), children: "Save grade" })
          ] }),
          answer?.manual_score != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-primary font-semibold", children: [
            "Current grade: ",
            answer.manual_score
          ] })
        ] }),
        (isMcq || isOneWord) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs", children: sel == null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Not answered" }) : isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-success font-semibold inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
          "Correct"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-semibold inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
          "Wrong ",
          isOneWord && `(typed: "${sel}")`
        ] }) })
      ] }, q.id);
    }) })
  ] }) });
}
export {
  ResultsPage as component
};
