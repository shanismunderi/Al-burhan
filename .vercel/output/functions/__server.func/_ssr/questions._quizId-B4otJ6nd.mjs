import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as utils, w as writeFileSync, r as readSync } from "../_libs/xlsx.mjs";
import { s as supabase } from "./client-DEvGjMSn.mjs";
import { B as Button } from "./button-DEu8rnY4.mjs";
import { I as Input } from "./input-D1vAzob1.mjs";
import { L as Label } from "./label-Dy_DkoX9.mjs";
import { T as Textarea } from "./textarea-DYD10oSG.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Root, P as Portal, C as Content, a as Close, b as Title, O as Overlay, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { d as Route, c as cn } from "./router-CdCHwnXV.mjs";
import "../_libs/seroval.mjs";
import { s as ArrowLeft, t as FileSpreadsheet, D as Download, m as Pencil, n as Trash2, l as Plus, X } from "../_libs/lucide-react.mjs";
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
import "./server-CS0DRPDm.mjs";
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
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tailwind-merge.mjs";
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const emptyMcq = (quiz_id, pos) => ({
  quiz_id,
  question_type: "mcq",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  marks: 1,
  position: pos
});
const emptyOneWord = (quiz_id, pos) => ({
  quiz_id,
  question_type: "one_word",
  question_text: "",
  option_a: null,
  option_b: null,
  option_c: null,
  option_d: null,
  correct_answer: "",
  marks: 2,
  position: pos
});
const emptyDesc = (quiz_id, pos) => ({
  quiz_id,
  question_type: "descriptive",
  question_text: "",
  option_a: null,
  option_b: null,
  option_c: null,
  option_d: null,
  correct_answer: null,
  marks: 5,
  position: pos
});
function QuestionsPage() {
  const {
    quizId
  } = Route.useParams();
  const [quizTitle, setQuizTitle] = reactExports.useState("");
  const [list, setList] = reactExports.useState([]);
  const [draft, setDraft] = reactExports.useState(emptyMcq(quizId, 0));
  const [editingQuestion, setEditingQuestion] = reactExports.useState(null);
  const startEdit = (q) => {
    setEditingQuestion({
      ...q
    });
  };
  const load = async () => {
    const [{
      data: quiz
    }, {
      data: qs
    }] = await Promise.all([supabase.from("quizzes").select("title").eq("id", quizId).maybeSingle(), supabase.rpc("admin_get_questions", {
      _quiz_id: quizId
    })]);
    setQuizTitle(quiz?.title ?? "");
    const items = qs ?? [];
    setList(items);
    setDraft((d) => (d.question_type === "descriptive" ? emptyDesc : d.question_type === "one_word" ? emptyOneWord : emptyMcq)(quizId, items.length));
  };
  reactExports.useEffect(() => {
    load();
  }, [quizId]);
  const switchType = (t) => {
    setDraft((t === "mcq" ? emptyMcq : t === "one_word" ? emptyOneWord : emptyDesc)(quizId, list.length));
  };
  const switchEditType = (t) => {
    if (!editingQuestion) return;
    const base = {
      ...editingQuestion,
      question_type: t
    };
    if (t === "mcq") {
      setEditingQuestion({
        ...base,
        option_a: editingQuestion.option_a || "",
        option_b: editingQuestion.option_b || "",
        option_c: editingQuestion.option_c || "",
        option_d: editingQuestion.option_d || "",
        correct_answer: ["A", "B", "C", "D"].includes(editingQuestion.correct_answer || "") ? editingQuestion.correct_answer : "A"
      });
    } else if (t === "one_word") {
      setEditingQuestion({
        ...base,
        option_a: null,
        option_b: null,
        option_c: null,
        option_d: null,
        correct_answer: editingQuestion.correct_answer || ""
      });
    } else {
      setEditingQuestion({
        ...base,
        option_a: null,
        option_b: null,
        option_c: null,
        option_d: null,
        correct_answer: null
      });
    }
  };
  const add = async () => {
    if (!draft.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (draft.question_type === "mcq") {
      if (!draft.option_a?.trim() || !draft.option_b?.trim()) {
        toast.error("At least Option A and Option B are required for MCQ");
        return;
      }
    } else if (draft.question_type === "one_word") {
      if (!draft.correct_answer || !draft.correct_answer.trim()) {
        toast.error("Correct answer word is required for One Word questions");
        return;
      }
    }
    const payload = {
      ...draft
    };
    const {
      error
    } = await supabase.from("questions").insert(payload);
    if (error) {
      toast.error(error.message || "Failed to add question");
      return;
    }
    toast.success("Question added successfully");
    load();
  };
  const remove = async (id) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this question?")) return;
    const {
      error
    } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      toast.error(error.message || "Failed to delete question");
      return;
    }
    toast.success("Question deleted successfully");
    load();
  };
  const saveEdit = async () => {
    if (!editingQuestion || !editingQuestion.id) return;
    if (!editingQuestion.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (editingQuestion.question_type === "mcq") {
      if (!editingQuestion.option_a?.trim() || !editingQuestion.option_b?.trim()) {
        toast.error("At least Option A and Option B are required for MCQ");
        return;
      }
    } else if (editingQuestion.question_type === "one_word") {
      if (!editingQuestion.correct_answer || !editingQuestion.correct_answer.trim()) {
        toast.error("Correct answer word is required for One Word questions");
        return;
      }
    }
    const payload = {
      question_text: editingQuestion.question_text,
      question_type: editingQuestion.question_type,
      option_a: editingQuestion.option_a,
      option_b: editingQuestion.option_b,
      option_c: editingQuestion.option_c,
      option_d: editingQuestion.option_d,
      correct_answer: editingQuestion.correct_answer,
      marks: editingQuestion.marks,
      position: editingQuestion.position
    };
    const {
      error
    } = await supabase.from("questions").update(payload).eq("id", editingQuestion.id);
    if (error) {
      toast.error(error.message || "Failed to update question");
      return;
    }
    toast.success("Question updated successfully");
    setEditingQuestion(null);
    load();
  };
  const fileRef = reactExports.useRef(null);
  const downloadTemplate = () => {
    const rows = [{
      question_type: "mcq",
      question_text: "What is 2+2?",
      option_a: "3",
      option_b: "4",
      option_c: "5",
      option_d: "6",
      correct_answer: "B",
      marks: 1
    }, {
      question_type: "one_word",
      question_text: "What is the capital of Saudi Arabia?",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "Riyadh",
      marks: 2
    }, {
      question_type: "descriptive",
      question_text: "Explain the significance of Hijra.",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "",
      marks: 5
    }];
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Questions");
    writeFileSync(wb, "questions-template.xlsx");
  };
  const importExcel = async (file) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = readSync(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = utils.sheet_to_json(ws, {
        defval: ""
      });
      if (!data.length) {
        toast.error("The selected file is empty");
        return;
      }
      const payload = [];
      let pos = list.length;
      for (const row of data) {
        const type = String(row.question_type || row.type || "mcq").toLowerCase().trim();
        const isMcq = type.startsWith("mcq") || type === "multiple_choice" || type === "optional";
        const isOneWord = type.includes("one_word") || type.includes("one word") || type === "short" || type === "short_answer" || type === "oneword";
        const qt = String(row.question_text || row.question || "").trim();
        if (!qt) continue;
        const marks = Number(row.marks ?? (isMcq ? 1 : isOneWord ? 2 : 5)) || (isMcq ? 1 : isOneWord ? 2 : 5);
        if (isMcq) {
          const correct = String(row.correct_answer || "A").trim().toUpperCase().charAt(0);
          if (!"ABCD".includes(correct)) {
            continue;
          }
          payload.push({
            quiz_id: quizId,
            question_type: "mcq",
            question_text: qt,
            option_a: String(row.option_a || "").trim() || null,
            option_b: String(row.option_b || "").trim() || null,
            option_c: String(row.option_c || "").trim() || null,
            option_d: String(row.option_d || "").trim() || null,
            correct_answer: correct,
            marks,
            position: pos++
          });
        } else if (isOneWord) {
          payload.push({
            quiz_id: quizId,
            question_type: "one_word",
            question_text: qt,
            option_a: null,
            option_b: null,
            option_c: null,
            option_d: null,
            correct_answer: String(row.correct_answer || "").trim(),
            marks,
            position: pos++
          });
        } else {
          payload.push({
            quiz_id: quizId,
            question_type: "descriptive",
            question_text: qt,
            option_a: null,
            option_b: null,
            option_c: null,
            option_d: null,
            correct_answer: null,
            marks,
            position: pos++
          });
        }
      }
      if (!payload.length) {
        toast.error("No valid questions found in Excel file");
        return;
      }
      const {
        error
      } = await supabase.from("questions").insert(payload);
      if (error) {
        toast.error(error.message || "Failed to import questions");
        return;
      }
      toast.success(`Successfully imported ${payload.length} question(s)`);
      load();
    } catch (e) {
      toast.error("Error parsing Excel file: " + (e.message || "Unknown error"));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/quizzes", className: "text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
      " Back to quizzes"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mt-2", children: quizTitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1", children: [
      list.length,
      " question",
      list.length === 1 ? "" : "s"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-6 w-6 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Bulk import from Excel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Upload an .xlsx with columns: question_type, question_text, option_a–d, correct_answer (A/B/C/D), marks." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: downloadTemplate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-1" }),
        " Template"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => fileRef.current?.click(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4 mr-1" }),
        " Import .xlsx"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".xlsx,.xls,.csv", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) importExcel(f);
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-3", children: list.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold", children: q.question_type === "mcq" ? "MCQ (Optional)" : q.question_type === "one_word" ? "One Word" : "Descriptive" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold mt-1", children: [
            "Q",
            i + 1,
            ". ",
            q.question_text
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => startEdit(q), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4 text-muted-foreground hover:text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(q.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }),
      q.question_type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-2 gap-2 mt-3 text-sm", children: ["A", "B", "C", "D"].map((k) => {
        const v = q[`option_${k.toLowerCase()}`];
        if (!v) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `px-3 py-2 rounded-lg border ${q.correct_answer === k ? "border-primary bg-primary/5 text-primary font-medium" : "border-border"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs mr-2", children: k }),
          v
        ] }, k);
      }) }),
      q.question_type === "one_word" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-sm flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "Correct answer:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono bg-success/10 text-success px-2.5 py-1 rounded-md font-semibold text-xs", children: q.correct_answer })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-2", children: [
        "Marks: ",
        q.marks
      ] })
    ] }, q.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-2xl border border-border bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add question"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => switchType("mcq"), className: `px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${draft.question_type === "mcq" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`, children: "Multiple choice (Optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => switchType("one_word"), className: `px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${draft.question_type === "one_word" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`, children: "One word question" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => switchType("descriptive"), className: `px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${draft.question_type === "descriptive" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`, children: "Descriptive (Essay type)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Question" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: draft.question_text, onChange: (e) => setDraft({
            ...draft,
            question_text: e.target.value
          }) })
        ] }),
        draft.question_type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Option ",
              k.toUpperCase()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft[`option_${k}`] ?? "", onChange: (e) => setDraft({
              ...draft,
              [`option_${k}`]: e.target.value
            }) })
          ] }, k)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Correct answer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3", value: draft.correct_answer ?? "A", onChange: (e) => setDraft({
              ...draft,
              correct_answer: e.target.value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "B" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "C" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "D" })
            ] })
          ] })
        ] }),
        draft.question_type === "one_word" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Correct answer word" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Riyadh", value: draft.correct_answer ?? "", onChange: (e) => setDraft({
            ...draft,
            correct_answer: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Candidates must type this word. Auto-grading will check case-insensitively and trim spaces." })
        ] }),
        draft.question_type === "descriptive" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground rounded-lg bg-muted/40 p-3", children: "Candidates will type a written answer. You'll grade it manually in the Results page." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Marks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.25", value: draft.marks, onChange: (e) => setDraft({
            ...draft,
            marks: Number(e.target.value)
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: add, className: "w-full", children: "Add question" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editingQuestion !== null, onOpenChange: (open) => {
      if (!open) setEditingQuestion(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Question" }) }),
      editingQuestion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => switchEditType("mcq"), className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editingQuestion.question_type === "mcq" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`, children: "Multiple choice (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => switchEditType("one_word"), className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editingQuestion.question_type === "one_word" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`, children: "One word question" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => switchEditType("descriptive"), className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editingQuestion.question_type === "descriptive" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`, children: "Descriptive (Essay type)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Question Text" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: editingQuestion.question_text, onChange: (e) => setEditingQuestion({
            ...editingQuestion,
            question_text: e.target.value
          }) })
        ] }),
        editingQuestion.question_type === "mcq" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Option ",
              k.toUpperCase()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editingQuestion[`option_${k}`] ?? "", onChange: (e) => setEditingQuestion({
              ...editingQuestion,
              [`option_${k}`]: e.target.value
            }) })
          ] }, k)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Correct Answer Option" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full h-10 rounded-md border border-input bg-background px-3 text-sm animate-none", value: editingQuestion.correct_answer ?? "A", onChange: (e) => setEditingQuestion({
              ...editingQuestion,
              correct_answer: e.target.value
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "B" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "C" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "D" })
            ] })
          ] })
        ] }),
        editingQuestion.question_type === "one_word" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Correct Answer Word" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "e.g. Riyadh", value: editingQuestion.correct_answer ?? "", onChange: (e) => setEditingQuestion({
            ...editingQuestion,
            correct_answer: e.target.value
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Candidates must type this word. Auto-grading will check case-insensitively and trim spaces." })
        ] }),
        editingQuestion.question_type === "descriptive" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground rounded-lg bg-muted/40 p-3", children: "Candidates will type a written answer. You'll grade it manually in the Results page." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Marks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.25", value: editingQuestion.marks, onChange: (e) => setEditingQuestion({
              ...editingQuestion,
              marks: Number(e.target.value)
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Display Order / Position" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: editingQuestion.position, onChange: (e) => setEditingQuestion({
              ...editingQuestion,
              position: Number(e.target.value)
            }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditingQuestion(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: saveEdit, children: "Save Changes" })
      ] })
    ] }) })
  ] });
}
export {
  QuestionsPage as component
};
