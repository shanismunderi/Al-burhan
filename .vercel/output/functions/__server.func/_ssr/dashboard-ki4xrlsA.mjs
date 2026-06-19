import { r as reactExports, W as jsxRuntimeExports } from "./server-4Gn8qr2y.mjs";
import { u as useAuth, a as useNavigate, c as signOut } from "./router-f9iG_t3k.mjs";
import { s as supabase } from "./client-Y0ab6YHk.mjs";
import { c as createLucideIcon } from "./createLucideIcon-CJHpKEEo.mjs";
import { m as motion } from "./proxy-CdBxU2mj.mjs";
import { C as CircleCheck } from "./circle-check-BdPW_KBK.mjs";
import { L as LogOut } from "./log-out-C5LDQHUA.mjs";
import { T as TriangleAlert } from "./triangle-alert-T30JJeig.mjs";
import { S as ShieldCheck } from "./shield-check-CDHktTPO.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$2 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode$1);
const __iconNode = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2", key: "14vaq8" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11", key: "17fdiu" }],
  ["circle", { cx: "12", cy: "14", r: "8", key: "1e1u0o" }]
];
const Timer = createLucideIcon("timer", __iconNode);
function PDashboard() {
  const {
    user,
    username,
    member1,
    member2
  } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = reactExports.useState(null);
  const [attempt, setAttempt] = reactExports.useState(null);
  const [questionCount, setQuestionCount] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const {
        data: q
      } = await supabase.from("quizzes").select("*").eq("is_active", true).order("created_at", {
        ascending: true
      }).limit(1).maybeSingle();
      setQuiz(q);
      if (q) {
        const [{
          count
        }, {
          data: a
        }] = await Promise.all([supabase.from("questions").select("id", {
          count: "exact",
          head: true
        }).eq("quiz_id", q.id), supabase.from("quiz_attempts").select("id,status,submitted_at").eq("user_id", user.id).eq("quiz_id", q.id).order("started_at", {
          ascending: false
        }).limit(1).maybeSingle()]);
        setQuestionCount(count ?? 0);
        setAttempt(a);
      }
      setLoading(false);
    })();
  }, [user]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-20 text-center text-muted-foreground", children: "Loading…" });
  if (!quiz) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md rounded-2xl border border-dashed border-border p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 mx-auto text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "No exam available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Please check back later or contact your administrator." })
    ] }) });
  }
  const isSubmitted = attempt && attempt.status !== "in_progress";
  if (isSubmitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "pt-10 max-w-xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border p-10 text-center shadow-[var(--shadow-leaf)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 mx-auto rounded-3xl flex items-center justify-center text-primary-foreground", style: {
        background: "var(--gradient-leaf)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 text-3xl font-bold", children: "Exam submitted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-2", children: [
        "Hello",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: member1 && member2 ? `${member1} & ${member2}` : username }),
        ", your responses have been recorded."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground", children: [
        "You've already completed",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: quiz.title }),
        ". Each candidate may attempt this exam only once.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Results will be reviewed by your administrator. Scores are not shown to candidates."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => signOut().then(() => window.location.href = "/"), className: "mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sign out"
      ] })
    ] }) });
  }
  const isResume = attempt?.status === "in_progress";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "pt-8 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }),
        " Welcome"
      ] }),
      member1 && member2 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl md:text-3xl font-semibold mt-2 text-foreground", children: [
        member1,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "&" }),
        " ",
        member2
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-semibold mt-2 text-foreground", children: username }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-bold mt-3", children: quiz.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-leaf)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: FileText, label: "Questions", value: String(questionCount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Timer, label: "Duration", value: `${quiz.duration_minutes} min` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: TriangleAlert, label: "Negative", value: String(quiz.negative_marks) })
      ] }),
      quiz.instructions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2", children: "Instructions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground/90 whitespace-pre-line border-l-2 border-primary/50 pl-4 leading-relaxed", children: quiz.instructions })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl bg-warning/10 border border-warning/30 p-5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
          "Important rules"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-2 space-y-1.5 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
            " The exam runs in",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: "fullscreen mode" }),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
            " Switching tabs, losing focus or going back triggers warnings."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
            " After",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: "3 warnings" }),
            " the exam is auto-submitted."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5", children: "•" }),
            " You can attempt this exam",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: "only once" }),
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/participant/quiz/$quizId",
        params: {
          quizId: quiz.id
        }
      }), disabled: questionCount === 0, className: "mt-7 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 disabled:opacity-50 transition-all hover:shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5" }),
        " ",
        isResume ? "Resume exam" : "Start exam"
      ] }),
      questionCount === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-3", children: "No questions configured yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => signOut().then(() => window.location.href = "/"), className: "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3 w-3" }),
      " Sign out"
    ] }) })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-accent/40 border border-border/50 p-4 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 mx-auto text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-lg text-foreground mt-0.5", children: value })
  ] });
}
export {
  PDashboard as component
};
