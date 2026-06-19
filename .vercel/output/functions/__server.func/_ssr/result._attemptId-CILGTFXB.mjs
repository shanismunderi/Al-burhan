import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as signOut } from "./router-DPsvKmVx.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { C as CircleCheck, L as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-CTrZHiUK.mjs";
import "./server-CN8XglyB.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
