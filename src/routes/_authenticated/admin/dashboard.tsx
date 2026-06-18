import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDisplayName } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: LiveDashboard,
});

interface AttemptRow {
  id: string;
  user_id: string;
  quiz_id: string;
  status: string;
  warnings: number;
  score: number;
  started_at: string;
  ends_at: string;
  submitted_at: string | null;
  candidate?: string;
  access_code?: string | null;
  quiz_title?: string;
  camera_snapshot?: string | null;
  camera_active?: boolean | null;
  camera_updated_at?: string | null;
}

interface CheatRow {
  id: string;
  user_id: string;
  event_type: string;
  occurred_at: string;
  candidate?: string;
}

function LiveDashboard() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [events, setEvents] = useState<CheatRow[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "camera">("table");

  const refresh = async () => {
    const [{ data: a }, { data: p }, { data: q }, { data: e }] = await Promise.all([
      supabase.from("quiz_attempts").select("*").order("started_at", { ascending: false }).limit(100),
      supabase.from("profiles").select("id, username, display_name, access_code"),
      supabase.from("quizzes").select("id, title"),
      supabase.from("cheat_events").select("*").order("occurred_at", { ascending: false }).limit(50),
    ]);
    const pMap: Record<string, { name: string; code: string | null }> = {};
    (p ?? []).forEach((x: any) => {
      pMap[x.id] = { name: formatDisplayName(x.display_name, x.username), code: x.access_code };
    });
    const qMap = Object.fromEntries((q ?? []).map((x: any) => [x.id, x.title]));
    const uniqueAttempts: AttemptRow[] = [];
    const seen = new Set<string>();
    (a ?? []).forEach((r: any) => {
      const key = `${r.user_id}-${r.quiz_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueAttempts.push({
          ...r,
          candidate: pMap[r.user_id]?.name ?? r.user_id.slice(0, 8),
          access_code: pMap[r.user_id]?.code ?? null,
          quiz_title: qMap[r.quiz_id],
        });
      }
    });
    setAttempts(uniqueAttempts);
    setEvents((e ?? []).map((r: any) => ({ ...r, candidate: pMap[r.user_id]?.name ?? r.user_id.slice(0, 8) })));
  };

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("admin-monitor")
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_attempts" }, () => refresh())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "cheat_events" }, () => refresh())
      .subscribe();
    const t = setInterval(refresh, 5000);
    return () => { supabase.removeChannel(channel); clearInterval(t); };
  }, []);

  const active = attempts.filter((a) => a.status === "in_progress").length;
  const submitted = attempts.filter((a) => a.status !== "in_progress").length;
  const totalWarnings = attempts.reduce((s, a) => s + (a.warnings || 0), 0);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Live monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">Realtime feed of every candidate's exam activity.</p>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mt-5">
        <Stat icon={Users} label="Active" value={active} tone="primary" />
        <Stat icon={CheckCircle2} label="Submitted" value={submitted} tone="success" />
        <Stat icon={AlertTriangle} label="Warnings" value={totalWarnings} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-6 md:mt-8">
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border font-semibold flex items-center justify-between">
            <span>Candidates</span>
            <div className="flex bg-muted/60 p-0.5 rounded-lg text-xs font-medium border border-border">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === "table" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("camera")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  viewMode === "camera" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Cameras
              </button>
            </div>
          </div>

          {viewMode === "camera" ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {attempts.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground text-sm">No candidates active or registered yet.</div>
              )}
              {attempts.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border ${
                    a.warnings >= 2 ? "border-destructive bg-destructive/5" : "border-border bg-card"
                  } overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col`}
                >
                  {/* Camera Screen container */}
                  <div className="aspect-video bg-zinc-950 relative overflow-hidden flex items-center justify-center">
                    {a.camera_snapshot && a.camera_snapshot !== "simulated" ? (
                      <img
                        src={a.camera_snapshot}
                        className="w-full h-full object-cover scale-x-[-1]"
                        alt="Candidate Proctor Snapshot"
                      />
                    ) : (
                      <div className="text-center p-3 relative w-full h-full flex flex-col justify-center items-center">
                        {/* Biometric dynamic backdrop */}
                        <div className="absolute inset-0 opacity-10 flex flex-wrap gap-1 items-center justify-center text-[5px] font-mono select-none pointer-events-none">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <span key={i} className={i % 4 === 0 ? "text-emerald-500" : ""}>
                              {Math.random() > 0.5 ? "1" : "0"}
                            </span>
                          ))}
                        </div>
                        <Activity className="h-7 w-7 text-emerald-400 animate-pulse mb-2 z-10" />
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest z-10">
                          {a.camera_snapshot === "simulated" ? "SECURE FEED ACTIVE" : "SIGNALING TUNNEL..."}
                        </div>
                        <div className="text-[8px] text-muted-foreground mt-0.5 z-10">
                          {a.camera_snapshot === "simulated"
                            ? "Face scanning & tracking simulated"
                            : "Waiting for student camera feed..."}
                        </div>
                        {/* Scanning bar for mock proctoring */}
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/25 shadow-[0_0_6px_#3b82f6] animate-[scan_3s_linear_infinite]" />
                      </div>
                    )}

                    {/* CRT scanline overlay effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.15)_50%,rgba(0,0,0,0.15))] bg-[length:100%_4px] z-10" />

                    {/* Overlay header controls */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-md text-[8px] font-bold z-20">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
                      <span className="text-destructive font-black">REC</span>
                      <span className="text-zinc-500">|</span>
                      <span className="text-emerald-400">MONITOR</span>
                    </div>

                    {a.warnings > 0 && (
                      <div className="absolute top-2.5 right-2.5 bg-destructive/95 text-destructive-foreground px-2 py-0.5 rounded-md text-[8px] font-bold flex items-center gap-1 z-20 animate-bounce">
                        <AlertTriangle className="h-2.5 w-2.5" /> {a.warnings} WARN
                      </div>
                    )}

                    {/* Center face recognition guide overlay */}
                    <div className="absolute inset-0 border border-emerald-500/20 m-4 pointer-events-none z-10">
                      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-500/50" />
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-500/50" />
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-500/50" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-500/50" />
                      <div className="absolute inset-0 m-auto w-16 h-20 border border-dashed border-emerald-500/30 rounded-[50%] flex items-center justify-center">
                        <span className="text-[6px] text-emerald-400/30 tracking-widest font-mono">LOCK-ON</span>
                      </div>
                    </div>
                  </div>

                  {/* Proctor info bar */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-muted/20">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm truncate max-w-[130px]">{a.candidate}</div>
                        <span className="font-mono text-[9px] bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">
                          {a.access_code || "no code"}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{a.quiz_title}</div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[9px] font-mono">
                      <span className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 rounded-full ${a.status === "in_progress" ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"}`} />
                        {a.status.toUpperCase().replace("_", " ")}
                      </span>
                      <span>
                        EYES: <b className={a.warnings >= 2 ? "text-destructive" : "text-emerald-400"}>{a.warnings >= 2 ? "UNSTEADY" : "LOCKED"}</b>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <style>{`
                @keyframes scan {
                  0% { top: 0%; }
                  50% { top: 100%; }
                  100% { top: 0%; }
                }
              `}</style>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2">Candidate</th>
                      <th className="text-left px-4 py-2">Code</th>
                      <th className="text-left px-4 py-2">Quiz</th>
                      <th className="text-left px-4 py-2">Status</th>
                      <th className="text-left px-4 py-2">Warn</th>
                      <th className="text-left px-4 py-2">Score</th>
                      <th className="text-left px-4 py-2">Time left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.length === 0 && (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No attempts yet.</td></tr>
                    )}
                    {attempts.map((a) => (
                      <tr key={a.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{a.candidate}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.access_code ?? "—"}</td>
                        <td className="px-4 py-3">{a.quiz_title}</td>
                        <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                        <td className="px-4 py-3">
                          <span className={(a.warnings || 0) >= 2 ? "text-destructive font-semibold" : ""}>{a.warnings || 0}</span>
                        </td>
                        <td className="px-4 py-3">{a.status === "in_progress" ? "—" : a.score}</td>
                        <td className="px-4 py-3"><TimeLeft endsAt={a.ends_at} status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-border">
                {attempts.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">No attempts yet.</div>
                )}
                {attempts.map((a) => (
                  <div key={a.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{a.candidate}</div>
                        <div className="text-xs text-muted-foreground font-mono">{a.access_code ?? "—"}</div>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{a.quiz_title}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Warn: <b className={(a.warnings || 0) >= 2 ? "text-destructive" : "text-foreground"}>{a.warnings || 0}</b></span>
                      <span>Score: <b className="text-foreground">{a.status === "in_progress" ? "—" : a.score}</b></span>
                      <TimeLeft endsAt={a.ends_at} status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl bg-card border border-border">
          <div className="px-5 py-3 border-b border-border font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Suspicious activity
          </div>
          <div className="divide-y divide-border max-h-[480px] overflow-auto">
            <AnimatePresence>
              {events.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground text-center">No events.</div>
              )}
              {events.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-5 py-3 text-sm"
                >
                  <div className="font-medium">{e.candidate}</div>
                  <div className="text-muted-foreground text-xs flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    {labelEvent(e.event_type)} · {new Date(e.occurred_at).toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: number; tone: "primary"|"success"|"warning" }) {
  const colorClass = tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="rounded-2xl bg-card border border-border p-4 md:p-5">
      <div className={`flex items-center gap-2 text-[10px] md:text-xs font-medium uppercase tracking-widest ${colorClass}`}>
        <Icon className="h-4 w-4" /> <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 text-2xl md:text-3xl font-bold">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    in_progress: "bg-primary/15 text-primary",
    submitted: "bg-success/15 text-success",
    auto_submitted: "bg-warning/20 text-warning-foreground",
    terminated: "bg-destructive/15 text-destructive",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${map[status] ?? "bg-muted"}`}>{status.replace("_"," ")}</span>;
}

function TimeLeft({ endsAt, status }: { endsAt: string; status: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (status !== "in_progress") return <span className="text-muted-foreground">—</span>;
  const targetTime = new Date(endsAt).getTime();
  if (isNaN(targetTime)) return <span className="text-muted-foreground">—</span>;
  const ms = targetTime - now;
  if (ms <= 0) return <span className="text-destructive">00:00</span>;
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return <span className="tabular-nums inline-flex items-center gap-1"><Clock className="h-3 w-3" />{h>0?`${h}:`:""}{String(m).padStart(2,"0")}:{String(sec).padStart(2,"0")}</span>;
}

function labelEvent(t: string) {
  switch (t) {
    case "tab_switch": return "Switched tab";
    case "blur": return "Window lost focus";
    case "fullscreen_exit": return "Exited fullscreen";
    case "back_button": return "Pressed back";
    case "reload_attempt": return "Tried to reload/close";
    case "auto_submit": return "Auto-submitted (max warnings)";
    default: return t;
  }
}
