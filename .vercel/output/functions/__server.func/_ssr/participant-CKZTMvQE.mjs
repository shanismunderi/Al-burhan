import { r as reactExports, W as jsxRuntimeExports, a2 as Outlet } from "./server-B8EOA1g9.mjs";
import { u as useAuth, a as useNavigate, c as signOut } from "./router-DNeZYB4o.mjs";
import { B as Brand } from "./brand-BLVpaOjV.mjs";
import { B as Button } from "./button-DcZS9F61.mjs";
import { T as ThemeToggle } from "./theme-toggle-C18ZyIrv.mjs";
import { L as LogOut } from "./log-out-BH1Mxews.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-AZ_j6hi0.mjs";
import "./createLucideIcon-BWZTZ3a8.mjs";
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
