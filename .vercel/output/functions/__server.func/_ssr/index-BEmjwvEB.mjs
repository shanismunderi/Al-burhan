import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Brand } from "./brand-sjsfXU4S.mjs";
import { B as Button } from "./button-DEu8rnY4.mjs";
import { T as ThemeToggle } from "./theme-toggle-Dtqis5xx.mjs";
import { u as useAuth, l as logoHero } from "./router-CdCHwnXV.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-DEvGjMSn.mjs";
import "./server-CS0DRPDm.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/tailwind-merge.mjs";
function Landing() {
  const {
    session,
    role,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && session && role) {
      navigate({
        to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard"
      });
    }
  }, [loading, session, role, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 h-14 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/login", children: "Admin" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", children: [
          "Enter code ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full max-w-5xl mx-auto px-4 py-10 sm:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8 lg:gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center order-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl p-6 sm:p-8 w-full max-w-xs shadow-[var(--shadow-leaf)]", style: {
        background: "var(--gradient-leaf)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoHero, alt: "Al-Burhan National Grand Quiz Competition 2.0", width: 320, height: 320, loading: "eager", decoding: "async", className: "w-full h-auto object-contain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-center text-primary-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.3em] opacity-80", children: "Edition 2.0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl font-bold mt-1", children: "Al-Burhan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] opacity-80", children: "National Grand Quiz" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "order-2 space-y-5 text-center lg:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em]", children: "Darul Hasanath Islamic College" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight", children: [
          "National Grand Quiz on",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Islamic Civilization & Ihsan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed", children: [
          "Organised by the Department of Civilizational Studies with",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: "Book Plus Publishers" }),
          ", Malabar. Compete as a team of two. Win a share of ₹6,666."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/login", children: [
            "Start your exam ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/login", children: "Admin login" }) })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border py-4 text-center text-xs text-muted-foreground px-4", children: [
      "Powered by",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://instagram.com/flow.core__", target: "_blank", rel: "noopener noreferrer", className: "font-semibold text-foreground hover:text-primary transition-colors", children: "Flowcore" })
    ] })
  ] });
}
export {
  Landing as component
};
