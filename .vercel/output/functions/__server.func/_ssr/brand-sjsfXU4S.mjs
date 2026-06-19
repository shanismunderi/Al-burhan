import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
const logoMark = "/assets/logo-hero-BfZPLwnb.png";
function Brand({ to = "/", light = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex items-center gap-3 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-11 w-11 rounded-xl flex items-center justify-center shadow-[var(--shadow-leaf)] overflow-hidden",
        style: { background: light ? "rgba(255,255,255,0.12)" : "var(--gradient-leaf)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logoMark,
            alt: "Al-Burhan",
            className: "h-8 w-8 object-contain",
            style: { filter: "brightness(0) invert(1)" }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `font-display font-bold tracking-tight ${light ? "text-primary-foreground" : "text-foreground"}`,
          children: [
            "Al-Burhan ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "2.0" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `text-[10px] uppercase tracking-[0.18em] ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`,
          children: "National Grand Quiz"
        }
      )
    ] })
  ] });
}
export {
  Brand as B
};
