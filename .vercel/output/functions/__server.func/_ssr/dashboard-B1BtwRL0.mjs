import { r as reactExports, W as jsxRuntimeExports } from "./server-4Gn8qr2y.mjs";
import { s as supabase } from "./client-Y0ab6YHk.mjs";
import { f as formatDisplayName } from "./router-f9iG_t3k.mjs";
import { U as Users } from "./users-Dzi1qBEw.mjs";
import { C as CircleCheck } from "./circle-check-BdPW_KBK.mjs";
import { T as TriangleAlert } from "./triangle-alert-T30JJeig.mjs";
import { V as VideoOff, A as AnimatePresence, C as Clock } from "./video-off-B3jjRNfz.mjs";
import { c as createLucideIcon } from "./createLucideIcon-CJHpKEEo.mjs";
import { m as motion } from "./proxy-CdBxU2mj.mjs";
import "node:async_hooks";
import "node:stream";
import "node:stream/web";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const __iconNode = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode);
function LiveDashboard() {
  const [attempts, setAttempts] = reactExports.useState([]);
  const [events, setEvents] = reactExports.useState([]);
  const [viewMode, setViewMode] = reactExports.useState("table");
  const isCameraOnline = (a) => {
    if (a.status !== "in_progress") return false;
    if (!a.camera_active || !a.camera_updated_at) return false;
    const diff = Date.now() - new Date(a.camera_updated_at).getTime();
    return diff < 2e4;
  };
  const refresh = async () => {
    const [{
      data: a
    }, {
      data: p
    }, {
      data: q
    }, {
      data: e
    }] = await Promise.all([supabase.from("quiz_attempts").select("*").order("started_at", {
      ascending: false
    }).limit(100), supabase.from("profiles").select("id, username, display_name, access_code"), supabase.from("quizzes").select("id, title"), supabase.from("cheat_events").select("*").order("occurred_at", {
      ascending: false
    }).limit(50)]);
    const pMap = {};
    (p ?? []).forEach((x) => {
      pMap[x.id] = {
        name: formatDisplayName(x.display_name, x.username),
        code: x.access_code
      };
    });
    const qMap = Object.fromEntries((q ?? []).map((x) => [x.id, x.title]));
    const uniqueAttempts = [];
    const seen = /* @__PURE__ */ new Set();
    (a ?? []).forEach((r) => {
      const key = `${r.user_id}-${r.quiz_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueAttempts.push({
          ...r,
          candidate: pMap[r.user_id]?.name ?? r.user_id.slice(0, 8),
          access_code: pMap[r.user_id]?.code ?? null,
          quiz_title: qMap[r.quiz_id]
        });
      }
    });
    setAttempts(uniqueAttempts);
    setEvents((e ?? []).map((r) => ({
      ...r,
      candidate: pMap[r.user_id]?.name ?? r.user_id.slice(0, 8)
    })));
  };
  reactExports.useEffect(() => {
    refresh();
    supabase.channel("admin-monitor").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "quiz_attempts"
    }, () => refresh()).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "cheat_events"
    }, () => refresh()).subscribe();
    const t = setInterval(refresh, 2e3);
    return () => {
      clearInterval(t);
    };
  }, []);
  const active = attempts.filter((a) => a.status === "in_progress").length;
  const submitted = attempts.filter((a) => a.status !== "in_progress").length;
  const totalWarnings = attempts.reduce((s, a) => s + (a.warnings || 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold", children: "Live monitoring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Realtime feed of every candidate's exam activity." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-success animate-pulse" }),
        " Live"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 md:gap-4 mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Users, label: "Active", value: active, tone: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: CircleCheck, label: "Submitted", value: submitted, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: TriangleAlert, label: "Warnings", value: totalWarnings, tone: "warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[2fr_1fr] gap-6 mt-6 md:mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border font-semibold flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Candidates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex bg-muted/60 p-0.5 rounded-lg text-xs font-medium border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewMode("table"), className: `px-3 py-1 rounded-md transition-all ${viewMode === "table" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`, children: "List View" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setViewMode("camera"), className: `px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${viewMode === "camera" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
              " Live Cameras"
            ] })
          ] })
        ] }),
        viewMode === "camera" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          attempts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full py-12 text-center text-muted-foreground text-sm", children: "No candidates active or registered yet." }),
          attempts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border ${a.warnings >= 2 ? "border-destructive bg-destructive/5" : "border-border bg-card"} overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-zinc-950 relative overflow-hidden flex items-center justify-center", children: [
              a.camera_snapshot && a.camera_snapshot !== "simulated" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: a.camera_snapshot, className: `w-full h-full object-cover scale-x-[-1] transition-all duration-300 ${!isCameraOnline(a) ? "opacity-40 blur-[2px]" : "opacity-100"}`, alt: "Candidate Proctor Snapshot" }),
                !isCameraOnline(a) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px] z-20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "h-6 w-6 text-destructive/80 animate-pulse mb-1.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-destructive uppercase tracking-widest", children: "FEED DISCONNECTED" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[7px] text-muted-foreground mt-0.5 font-mono", children: [
                    "Last updated:",
                    " ",
                    a.camera_updated_at ? new Date(a.camera_updated_at).toLocaleTimeString() : "never"
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 relative w-full h-full flex flex-col justify-center items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10 flex flex-wrap gap-1 items-center justify-center text-[5px] font-mono select-none pointer-events-none", children: Array.from({
                  length: 48
                }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: i % 4 === 0 ? "text-emerald-500" : "", children: Math.random() > 0.5 ? "1" : "0" }, i)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-7 w-7 text-emerald-400 animate-pulse mb-2 z-10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-emerald-400 uppercase tracking-widest z-10", children: a.camera_snapshot === "simulated" ? "SECURE FEED ACTIVE" : "SIGNALING TUNNEL..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[8px] text-muted-foreground mt-0.5 z-10", children: a.camera_snapshot === "simulated" ? "Face scanning & tracking simulated" : "Waiting for student camera feed..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-primary/25 shadow-[0_0_6px_#3b82f6] animate-[scan_3s_linear_infinite]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.15))] bg-[length:100%_4px] z-10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-md text-[8px] font-bold z-20", children: isCameraOnline(a) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-destructive animate-ping" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-black", children: "REC" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "LIVE" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-zinc-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400 font-bold", children: "OFFLINE" })
              ] }) }),
              a.warnings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2.5 right-2.5 bg-destructive/95 text-destructive-foreground px-2 py-0.5 rounded-md text-[8px] font-bold flex items-center gap-1 z-20 animate-bounce", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5" }),
                " ",
                a.warnings,
                " WARN"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 border border-emerald-500/20 m-4 pointer-events-none z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-500/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-500/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-500/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-500/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 m-auto w-16 h-20 border border-dashed border-emerald-500/30 rounded-[50%] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[6px] text-emerald-400/30 tracking-widest font-mono", children: "LOCK-ON" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 flex flex-col justify-between bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm truncate max-w-[130px]", children: a.candidate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground", children: a.access_code || "no code" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-0.5 truncate", children: a.quiz_title })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border flex items-center justify-between text-[9px] font-mono", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${a.status === "in_progress" ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}` }),
                  a.status.toUpperCase().replace("_", " ")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "EYES:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: a.warnings >= 2 ? "text-destructive" : "text-emerald-400", children: a.warnings >= 2 ? "UNSTEADY" : "LOCKED" })
                ] })
              ] })
            ] })
          ] }, a.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes scan {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
              ` })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Candidate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Quiz" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Warn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Score" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Time left" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
              attempts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-8 text-center text-muted-foreground", children: "No attempts yet." }) }),
              attempts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: a.candidate }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: a.access_code ?? "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: a.quiz_title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: (a.warnings || 0) >= 2 ? "text-destructive font-semibold" : "", children: a.warnings || 0 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: a.status === "in_progress" ? "—" : a.score }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimeLeft, { endsAt: a.ends_at, status: a.status }) })
              ] }, a.id))
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden divide-y divide-border", children: [
            attempts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-8 text-center text-muted-foreground text-sm", children: "No attempts yet." }),
            attempts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold truncate", children: a.candidate }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono", children: a.access_code ?? "—" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: a.quiz_title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Warn:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: (a.warnings || 0) >= 2 ? "text-destructive" : "text-foreground", children: a.warnings || 0 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Score:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-foreground", children: a.status === "in_progress" ? "—" : a.score })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TimeLeft, { endsAt: a.ends_at, status: a.status })
              ] })
            ] }, a.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
          " Suspicious activity"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-[480px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
          events.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-muted-foreground text-center", children: "No events." }),
          events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
            opacity: 0,
            x: 8
          }, animate: {
            opacity: 1,
            x: 0
          }, className: "px-5 py-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: e.candidate }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-xs flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 text-warning" }),
              labelEvent(e.event_type),
              " · ",
              new Date(e.occurred_at).toLocaleTimeString()
            ] })
          ] }, e.id))
        ] }) })
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  tone
}) {
  const colorClass = tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border p-4 md:p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 text-[10px] md:text-xs font-medium uppercase tracking-widest ${colorClass}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-2xl md:text-3xl font-bold", children: value })
  ] });
}
function StatusBadge({
  status
}) {
  const map = {
    in_progress: "bg-primary/15 text-primary",
    submitted: "bg-success/15 text-success",
    auto_submitted: "bg-warning/20 text-warning-foreground",
    terminated: "bg-destructive/15 text-destructive"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${map[status] ?? "bg-muted"}`, children: status.replace("_", " ") });
}
function TimeLeft({
  endsAt,
  status
}) {
  const [now, setNow] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, []);
  if (status !== "in_progress") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" });
  const targetTime = new Date(endsAt).getTime();
  if (isNaN(targetTime)) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" });
  const ms = targetTime - now;
  if (ms <= 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "00:00" });
  const s = Math.floor(ms / 1e3);
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums inline-flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
    h > 0 ? `${h}:` : "",
    String(m).padStart(2, "0"),
    ":",
    String(sec).padStart(2, "0")
  ] });
}
function labelEvent(t) {
  switch (t) {
    case "tab_switch":
      return "Switched tab";
    case "blur":
      return "Window lost focus";
    case "fullscreen_exit":
      return "Exited fullscreen";
    case "back_button":
      return "Pressed back";
    case "reload_attempt":
      return "Tried to reload/close";
    case "auto_submit":
      return "Auto-submitted (max warnings)";
    default:
      return t;
  }
}
export {
  LiveDashboard as component
};
