import { r as reactExports, W as jsxRuntimeExports } from "./server-BoggyVwf.mjs";
import { B as Button } from "./button-BoWLEIxv.mjs";
import { c as createLucideIcon } from "./createLucideIcon-Dw1gcGK6.mjs";
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
      key: "kfwtm"
    }
  ]
];
const Moon = createLucideIcon("moon", __iconNode$1);
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode);
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}
function ThemeToggle({ className }) {
  const [theme, setTheme] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      onClick: toggle,
      "aria-label": `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
      className,
      children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
    }
  );
}
export {
  ThemeToggle as T
};
