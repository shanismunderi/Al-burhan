import { r as reactExports, W as jsxRuntimeExports, a2 as Outlet } from "./server-Ch0vJZt1.mjs";
import { u as useAuth, a as useNavigate, c as signOut } from "./router-CYdX2XWb.mjs";
import { B as Brand } from "./brand-CCsDLR9r.mjs";
import { B as Button } from "./button-CXBXhJZn.mjs";
import { T as ThemeToggle } from "./theme-toggle-Cpo7MVcH.mjs";
import { L as LogOut } from "./log-out-D5r0bqk3.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-CE4Kzw5M.mjs";
import "./createLucideIcon-Buug_fTc.mjs";
function ParticipantLayout() {
  const {
    role,
    loading,
    username
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && role !== "participant" && role !== "admin") navigate({
      to: "/login"
    });
  }, [loading, role, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen", style: {
    background: "var(--gradient-soft)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-5xl mx-auto px-6 py-5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, { to: "/participant/dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-sm text-muted-foreground", children: username }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => {
          signOut().then(() => navigate({
            to: "/"
          }));
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-1" }),
          " Sign out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-5xl mx-auto px-6 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  ParticipantLayout as component
};
