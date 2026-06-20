import { W as jsxRuntimeExports } from "./server-Bqq6KVOo.mjs";
import { c as signOut, L as Link } from "./router-BcO78Wsw.mjs";
import { m as motion } from "./proxy-DVMPGLt-.mjs";
import { C as CircleCheck } from "./circle-check-DpFvIawP.mjs";
import { L as LogOut } from "./log-out-DbrUrmLG.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-Crz2Xt2e.mjs";
import "./createLucideIcon-DGEEBEjg.mjs";
function ResultPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "pt-10 max-w-xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-primary-foreground", style: {
      background: "var(--gradient-leaf)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 text-3xl font-bold", children: "Exam submitted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Your responses have been recorded. Results will be reviewed by your administrator." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "Scores are not shown to candidates. Thank you for taking the exam." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => signOut().then(() => window.location.href = "/"), className: "inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sign out"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/participant/dashboard", className: "inline-flex items-center px-5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent/40", children: "Back to dashboard" })
    ] })
  ] }) });
}
export {
  ResultPage as component
};
