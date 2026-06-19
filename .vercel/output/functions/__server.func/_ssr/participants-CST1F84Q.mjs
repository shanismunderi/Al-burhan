import { r as reactExports, W as jsxRuntimeExports } from "./server-D0MjzJls.mjs";
import { u as useServerFn, c as createParticipant, a as updateAccessCode, d as deleteParticipant } from "./admin.functions-HG3V4qXj.mjs";
import { s as supabase } from "./client-BSypI-SM.mjs";
import { B as Button } from "./button-D9sSPSqX.mjs";
import { I as Input } from "./input-DcFwMAnw.mjs";
import { L as Label } from "./label-DR--CzEL.mjs";
import { f as formatDisplayName, t as toast } from "./router-BmJAC4mB.mjs";
import { U as Users } from "./users-DZG-8Ixd.mjs";
import { c as createLucideIcon } from "./createLucideIcon-BKV7JV2z.mjs";
import { P as Plus, a as Pencil, T as Trash2 } from "./trash-2-B8ypmbin.mjs";
import { C as Check } from "./check-AhIKdG32.mjs";
import { X } from "./x-B8mg8T4D.mjs";
import { K as KeyRound } from "./key-round-B6mQ-qYm.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./types-BoWyrJuk.mjs";
import "./index-C_oLBXPP.mjs";
const __iconNode = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode);
function ParticipantsPage() {
  const [rows, setRows] = reactExports.useState([]);
  const [m1, setM1] = reactExports.useState("");
  const [m2, setM2] = reactExports.useState("");
  const [customCode, setCustomCode] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [lastCode, setLastCode] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const create = useServerFn(createParticipant);
  const del = useServerFn(deleteParticipant);
  const updateCode = useServerFn(updateAccessCode);
  const load = async () => {
    const [{
      data: profiles
    }, {
      data: roles
    }] = await Promise.all([supabase.from("profiles").select("id, username, display_name, access_code, member1_name, member2_name").order("created_at", {
      ascending: false
    }), supabase.from("user_roles").select("user_id, role")]);
    const roleMap = {};
    (roles ?? []).forEach((r) => {
      if (r.role === "admin" || !roleMap[r.user_id]) roleMap[r.user_id] = r.role;
    });
    setRows((profiles ?? []).map((p) => ({
      ...p,
      role: roleMap[p.id] ?? "participant"
    })));
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const add = async () => {
    if (!m1.trim() || !m2.trim()) return;
    const code = customCode.trim().toUpperCase();
    if (code) {
      if (code.length < 4 || code.length > 16) {
        toast.error("Custom access code must be between 4 and 16 characters");
        return;
      }
      if (!/^[A-Z0-9]+$/.test(code)) {
        toast.error("Custom access code must contain only letters (A-Z) and numbers (0-9)");
        return;
      }
    }
    setBusy(true);
    try {
      const res = await create({
        data: {
          member1_name: m1.trim(),
          member2_name: m2.trim(),
          access_code: code || void 0
        }
      });
      setLastCode({
        name: `${m1.trim()} & ${m2.trim()}`,
        code: res.access_code
      });
      setM1("");
      setM2("");
      setCustomCode("");
      toast.success("Candidate created successfully");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to create candidate");
    }
    setBusy(false);
  };
  const remove = async (id) => {
    if (!confirm("Delete this candidate and all their attempts?")) return;
    try {
      await del({
        data: {
          user_id: id
        }
      });
      toast.success("Candidate deleted successfully");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to delete candidate");
    }
  };
  const saveEdit = async () => {
    if (!editing) return;
    const code = editing.code.trim().toUpperCase();
    if (code.length < 4 || code.length > 16) {
      toast.error("Access code must be between 4 and 16 characters");
      return;
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      toast.error("Access code must contain only letters (A-Z) and numbers (0-9)");
      return;
    }
    try {
      await updateCode({
        data: {
          user_id: editing.id,
          access_code: code
        }
      });
      setEditing(null);
      toast.success("Access code updated successfully");
      load();
    } catch (e) {
      toast.error(e.message || "Failed to update access code");
    }
  };
  const copy = (text) => {
    navigator.clipboard.writeText(text);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold", children: "Candidates" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Generate or customize access codes for exam takers. They sign in with the code only." }),
    lastCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border-2 border-primary bg-primary/5 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] uppercase tracking-widest text-primary font-semibold", children: [
          "New access code for ",
          lastCode.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl md:text-3xl font-bold mt-1 tracking-widest break-all", children: lastCode.code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Share this code with the candidate." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => copy(lastCode.code), className: "shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 mr-2" }),
        "Copy"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid lg:grid-cols-[1fr_340px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 h-fit lg:order-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Add candidate"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Team member 1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: m1, onChange: (e) => setM1(e.target.value), placeholder: "e.g. Aisha Khan" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Team member 2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: m2, onChange: (e) => setM2(e.target.value), placeholder: "e.g. Fatima Noor" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Custom access code",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: customCode, onChange: (e) => setCustomCode(e.target.value.toUpperCase()), placeholder: "Leave empty to auto-generate", className: "font-mono", maxLength: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: "A–Z and 0–9 only, 4–16 characters." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: add, disabled: busy, className: "w-full", children: busy ? "Saving…" : "Create candidate" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden lg:order-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Access code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {})
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-10 text-center text-muted-foreground", children: "No candidates yet." }) }),
            rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: formatDisplayName(r.display_name, r.username) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: editing?.id === r.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.code, onChange: (e) => setEditing({
                  id: r.id,
                  code: e.target.value.toUpperCase()
                }), className: "h-8 w-40 font-mono", maxLength: 16, autoFocus: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: saveEdit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-success" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
              ] }) : r.access_code ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => copy(r.access_code), className: "font-mono font-semibold inline-flex items-center gap-2 hover:text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
                  " ",
                  r.access_code
                ] }),
                r.role !== "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing({
                  id: r.id,
                  code: r.access_code
                }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded-full ${r.role === "admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`, children: r.role }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: r.role !== "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) }) })
            ] }, r.id))
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden divide-y divide-border", children: [
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-10 text-center text-muted-foreground text-sm", children: "No candidates yet." }),
          rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: formatDisplayName(r.display_name, r.username) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${r.role === "admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`, children: r.role })
              ] }),
              r.role !== "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => remove(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
            ] }),
            editing?.id === r.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.code, onChange: (e) => setEditing({
                id: r.id,
                code: e.target.value.toUpperCase()
              }), className: "h-9 font-mono", maxLength: 16, autoFocus: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: saveEdit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-success" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }) : r.access_code ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => copy(r.access_code), className: "font-mono font-semibold inline-flex items-center gap-2 hover:text-primary text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3" }),
                " ",
                r.access_code
              ] }),
              r.role !== "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing({
                id: r.id,
                code: r.access_code
              }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "No code" })
          ] }, r.id))
        ] })
      ] })
    ] })
  ] });
}
export {
  ParticipantsPage as component
};
