import { r as reactExports, W as jsxRuntimeExports } from "./server-B8EOA1g9.mjs";
import { L as Link, d as cn } from "./router-DNeZYB4o.mjs";
import { s as supabase } from "./client-AZ_j6hi0.mjs";
import { B as Button, u as useComposedRefs } from "./button-DcZS9F61.mjs";
import { I as Input } from "./input-Blk8V4ML.mjs";
import { L as Label } from "./label-DB5jPqrB.mjs";
import { T as Textarea } from "./textarea-C0nz0jw0.mjs";
import { u as useControllableState, c as composeEventHandlers, a as useLayoutEffect2, b as createContextScope } from "./index-CDCnYXXf.mjs";
import { P as Primitive } from "./index-CTApYnmi.mjs";
import { c as createLucideIcon } from "./createLucideIcon-BWZTZ3a8.mjs";
import { L as ListChecks } from "./list-checks-BjuXIpXc.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode$1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProviderImpl, useSwitchContext] = createSwitchContext(SWITCH_NAME);
function SwitchProvider(props) {
  const {
    __scopeSwitch,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: SWITCH_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    setChecked,
    disabled,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SwitchProviderImpl, { scope: __scopeSwitch, ...context, children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children });
}
var TRIGGER_NAME = "SwitchTrigger";
var SwitchTrigger = reactExports.forwardRef(
  ({ __scopeSwitch, onClick, ...switchProps }, forwardedRef) => {
    const {
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useSwitchContext(TRIGGER_NAME, __scopeSwitch);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...switchProps,
        ref: composedRefs,
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
SwitchTrigger.displayName = TRIGGER_NAME;
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchProvider,
      {
        __scopeSwitch,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SwitchTrigger,
            {
              ...switchProps,
              ref: forwardedRef,
              __scopeSwitch
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SwitchBubbleInput,
            {
              __scopeSwitch
            }
          )
        ] })
      }
    );
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({ __scopeSwitch, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useSwitchContext(BUBBLE_INPUT_NAME, __scopeSwitch);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
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
