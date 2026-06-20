import { r as reactExports, W as jsxRuntimeExports, a2 as Outlet, O as useRouter } from "./server-Bqq6KVOo.mjs";
import { u as useAuth, a as useNavigate, L as Link, c as signOut, d as cn } from "./router-BcO78Wsw.mjs";
import { B as Brand } from "./brand-ClkPix7O.mjs";
import { B as Button, c as cva } from "./button-EbpQ9Y5m.mjs";
import { R as Root, T as Trigger, P as Portal, C as Content, a as Close, O as Overlay, b as Title, D as Description } from "./index-C9fYHjm0.mjs";
import { X } from "./x-Dvw_npiP.mjs";
import { T as ThemeToggle } from "./theme-toggle-CYqWTibt.mjs";
import { c as createLucideIcon } from "./createLucideIcon-DGEEBEjg.mjs";
import { L as ListChecks } from "./list-checks-B7gnEcgV.mjs";
import { U as Users } from "./users-DLSXHNbx.mjs";
import { T as Trophy } from "./trophy-Z3JUxvTr.mjs";
import { L as LogOut } from "./log-out-DbrUrmLG.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./client-Crz2Xt2e.mjs";
import "./index-CmdK_Dpz.mjs";
import "./index-w_uaxoVA.mjs";
import "./index-CsiSyuBk.mjs";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
const __iconNode = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
];
const Menu = createLucideIcon("menu", __iconNode);
const Sheet = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
const NAV = [{
  to: "/admin/dashboard",
  label: "Live monitor",
  icon: LayoutDashboard
}, {
  to: "/admin/quizzes",
  label: "Quiz settings",
  icon: ListChecks
}, {
  to: "/admin/participants",
  label: "Participants",
  icon: Users
}, {
  to: "/admin/results",
  label: "Results",
  icon: Trophy
}];
function AdminLayout() {
  const {
    role,
    loading,
    username
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && role !== "admin") navigate({
      to: "/login"
    });
  }, [loading, role, navigate]);
  reactExports.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  if (loading || role !== "admin") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center text-muted-foreground", children: "Loading…" });
  }
  const NavContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, { to: "/admin/dashboard" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "mt-6 space-y-1 flex-1", children: NAV.map((n) => {
      const active = location.pathname.startsWith(n.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, className: `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: "h-4 w-4" }),
        " ",
        n.label
      ] }, n.to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 mt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground px-3", children: "Signed in as" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold px-3 truncate", children: username }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "flex-1 justify-start", onClick: () => {
          signOut().then(() => navigate({
            to: "/"
          }));
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-2" }),
          " Sign out"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col md:flex-row bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "md:hidden sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border bg-background/80 backdrop-blur px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, { to: "/admin/dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: setOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", "aria-label": "Open menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "w-72 p-4 flex flex-col bg-sidebar", children: NavContent })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden md:flex w-64 border-r border-border bg-sidebar p-4 flex-col", children: NavContent }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
