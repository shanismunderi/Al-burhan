import { r as reactExports, W as jsxRuntimeExports } from "./server-BoggyVwf.mjs";
import { u as useAuth, a as useNavigate, t as toast, L as Link, s as signInWithCode } from "./router-DWG96E5D.mjs";
import { B as Brand } from "./brand-n8dVcgsm.mjs";
import { B as Button } from "./button-BoWLEIxv.mjs";
import { I as Input } from "./input-BW39hASQ.mjs";
import { L as Label } from "./label-ntQMHx8Z.mjs";
import { m as motion } from "./proxy-CQvhJAH8.mjs";
import { K as KeyRound } from "./key-round-DAlHhQ47.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-CQFIE6gy.mjs";
import "./index-bO39X1mA.mjs";
import "./index-BYcfjksM.mjs";
import "./createLucideIcon-Dw1gcGK6.mjs";
function LoginPage() {
  const {
    session,
    role,
    loading,
    username
  } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const welcomedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!loading && session && role) {
      if (!welcomedRef.current) {
        welcomedRef.current = true;
        toast.success(`Welcome${username ? `, ${username}` : ""}! 🎉`, {
          description: "Signed in successfully. Redirecting…"
        });
      }
      navigate({
        to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard"
      });
    }
  }, [loading, session, role, navigate, username]);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    const {
      error
    } = await signInWithCode(code);
    setBusy(false);
    if (error) {
      toast.error("Invalid access code", {
        description: error.message
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex", style: {
    background: "var(--gradient-soft)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-1 p-12 flex-col justify-between", style: {
      background: "var(--gradient-leaf)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-primary-foreground max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl font-bold leading-tight", children: [
          "Take your exam.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Stay focused."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 opacity-90", children: "Enter the access code your administrator gave you. The exam starts in fullscreen mode." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-primary-foreground/70 text-xs", children: [
        " ",
        "Powered by",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://instagram.com/flow.core__", target: "_blank", rel: "noopener noreferrer", className: "font-semibold text-foreground hover:text-primary transition-colors", children: "Flowcore" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest", children: "Candidate access" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-3xl font-bold text-foreground", children: "Enter your access code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No username or password — just the code you were given." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "c", children: "Access code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "c", autoFocus: true, value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), placeholder: "e.g. A3K9PQ7M", className: "font-mono text-lg tracking-widest text-center", maxLength: 16, required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Signing in…" : "Start exam" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-center text-sm text-muted-foreground", children: [
        "Are you an admin?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/login", className: "text-primary font-medium", children: "Admin login" })
      ] })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
