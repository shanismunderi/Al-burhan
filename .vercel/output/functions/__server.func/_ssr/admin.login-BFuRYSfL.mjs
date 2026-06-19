import { r as reactExports, W as jsxRuntimeExports } from "./server-4Gn8qr2y.mjs";
import { u as useAuth, a as useNavigate, t as toast, L as Link, b as signInWithUsername } from "./router-f9iG_t3k.mjs";
import { u as useServerFn, s as seedAdmin } from "./admin.functions-L4_u0fZC.mjs";
import { B as Brand } from "./brand-BUPUHTFf.mjs";
import { B as Button } from "./button-c1WbrIAI.mjs";
import { I as Input } from "./input-Cry0N7l6.mjs";
import { L as Label } from "./label-D1BI9duZ.mjs";
import { m as motion } from "./proxy-CdBxU2mj.mjs";
import { S as Shield } from "./shield-CSFhkN8b.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-Y0ab6YHk.mjs";
import "./types-BoWyrJuk.mjs";
import "./index-PSItf4X9.mjs";
import "./createLucideIcon-CJHpKEEo.mjs";
function AdminLogin() {
  const {
    session,
    role,
    loading,
    username: displayName
  } = useAuth();
  const navigate = useNavigate();
  const seed = useServerFn(seedAdmin);
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const welcomedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    seed().catch(() => {
    });
  }, [seed]);
  reactExports.useEffect(() => {
    if (loading || !session || !role) return;
    if (role !== "admin") return;
    if (!welcomedRef.current) {
      welcomedRef.current = true;
      toast.success(`Welcome${displayName ? `, ${displayName}` : " back"}! 🎉`, {
        description: "Admin dashboard loading…"
      });
    }
    navigate({
      to: "/admin/dashboard",
      replace: true
    });
  }, [loading, session, role, navigate, displayName]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await seed();
    } catch {
    }
    const {
      error
    } = await signInWithUsername(username, password);
    setBusy(false);
    if (error) {
      toast.error("Sign-in failed", {
        description: error.message
      });
      return;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6", style: {
    background: "var(--gradient-soft)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border p-8 shadow-[var(--shadow-leaf)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest", children: "Admin area" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-bold", children: "Administrator login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Use your admin credentials to access the control panel." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "u", children: "Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u", value: username, onChange: (e) => setUsername(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "p", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: busy, children: busy ? "Signing in…" : "Sign in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hover:text-primary", children: "← Participant login" }) })
    ] })
  ] }) });
}
export {
  AdminLogin as component
};
