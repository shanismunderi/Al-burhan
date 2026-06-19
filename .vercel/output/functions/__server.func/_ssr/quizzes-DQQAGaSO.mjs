import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CUWuqVgB.mjs";
import { B as Button } from "./button-BmCadX6V.mjs";
import { I as Input } from "./input-CqJv-ckA.mjs";
import { L as Label } from "./label-D1CZACZx.mjs";
import { T as Textarea } from "./textarea-CKanKcfW.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { c as cn } from "./router-Br3aycZn.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { i as LoaderCircle, c as ListChecks, j as Save } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./server-DrrGCU9u.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tailwind-merge.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
function QuizSettingsPage() {
  const [quiz, setQuiz] = reactExports.useState(null);
  const [questionCount, setQuestionCount] = reactExports.useState(0);
  const [saving, setSaving] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    setLoading(true);
    const {
      data
    } = await supabase.from("quizzes").select("*").order("created_at", {
      ascending: true
    }).limit(1).maybeSingle();
    let q = data;
    if (!q) {
      const {
        data: created,
        error
      } = await supabase.from("quizzes").insert({
        title: "Main Examination",
        instructions: "Read each question carefully. Manage your time wisely.",
        duration_minutes: 30,
        negative_marks: 0,
        is_active: true,
        randomize: false
      }).select().single();
      if (error) {
        setLoading(false);
        return;
      }
      q = created;
    } else {
      await supabase.from("quizzes").delete().neq("id", q.id);
    }
    setQuiz(q);
    const {
      count
    } = await supabase.from("questions").select("id", {
      count: "exact",
      head: true
    }).eq("quiz_id", q.id);
    setQuestionCount(count ?? 0);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const save = async () => {
    if (!quiz) return;
    if (!quiz.title.trim()) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("quizzes").update({
      title: quiz.title,
      instructions: quiz.instructions ?? "",
      duration_minutes: Number(quiz.duration_minutes),
      negative_marks: Number(quiz.negative_marks),
      is_active: quiz.is_active,
      randomize: quiz.randomize
    }).eq("id", quiz.id);
    setSaving(false);
    if (error) return;
  };
  if (loading || !quiz) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-muted-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " Loading quiz…"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold", children: "Quiz settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Configure the single exam available to all candidates." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/questions/$quizId", params: {
        quizId: quiz.id
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-4 w-4 mr-2" }),
        " Manage questions (",
        questionCount,
        ")"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl bg-card border border-border p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Exam title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", value: quiz.title, onChange: (e) => setQuiz({
          ...quiz,
          title: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Instructions shown to candidates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1.5", rows: 5, value: quiz.instructions ?? "", onChange: (e) => setQuiz({
          ...quiz,
          instructions: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duration (minutes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "number", min: 1, value: quiz.duration_minutes, onChange: (e) => setQuiz({
            ...quiz,
            duration_minutes: Number(e.target.value)
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Negative marks per wrong MCQ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "number", step: "0.25", value: quiz.negative_marks, onChange: (e) => setQuiz({
            ...quiz,
            negative_marks: Number(e.target.value)
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "!m-0", children: "Exam is active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "When off, candidates cannot start the exam." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: quiz.is_active, onCheckedChange: (v) => setQuiz({
          ...quiz,
          is_active: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "!m-0", children: "Randomize question order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Each candidate sees questions in a different order." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: quiz.randomize, onCheckedChange: (v) => setQuiz({
          ...quiz,
          randomize: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: save, disabled: saving, children: [
        saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
        "Save changes"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-xs text-muted-foreground", children: [
      "Each candidate may attempt this exam ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: "only once" }),
      ". After submission they will see a confirmation message."
    ] })
  ] });
}
export {
  QuizSettingsPage as component
};
