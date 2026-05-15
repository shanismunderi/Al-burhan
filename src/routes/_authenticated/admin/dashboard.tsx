import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  username?: string;
  quiz_title?: string;
}

interface CheatRow {
  id: string;
  user_id: string;
  event_type: string;
  occurred_at: string;
  username?: string;
}

function LiveDashboard() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [events, setEvents] = useState<CheatRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [quizzes, setQuizzes] = useState<Record<string, string>>({});

  const refresh = async () => {
    const [{ data: a }, { data: p }, { data: q }, { data: e }] = await Promise.all([
      supabase.from("quiz_attempts").select("*").order("started_at", { ascending: false }).limit(100),
      supabase.from("profiles").select("id, username"),
      supabase.from("quizzes").select("id, title"),
      supabase.from("cheat_events").select("*").order("occurred_at", { ascending: false }).limit(50),
    ]);
    const pMap = Object.fromEntries((p ?? []).map((x) => [x.id, x.username]));
    const qMap = Object.fromEntries((q ?? []).map((x) => [x.id, x.title]));
    setProfiles(pMap);
    setQuizzes(qMap);
    setAttempts((a ?? []).map((r) => ({ ...r, username: pMap[r.user_id], quiz_title: qMap[r.quiz_id] })));
    setEvents((e ?? []).map((r) => ({ ...r, username: pMap[r.user_id] })));
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
  const totalWarnings = attempts.reduce((s, a) => s + a.warnings, 0);

  return (
    <div className="p-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live monitoring</h1>
          <p className="text-muted-foreground mt-1">Realtime feed of every participant's exam activity.</p>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <Stat icon={Users} label="Active now" value={active} tone="primary" />
        <Stat icon={CheckCircle2} label="Submitted" value={submitted} tone="success" />
        <Stat icon={AlertTriangle} label="Total warnings" value={totalWarnings} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-8">
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border font-semibold">Participants</div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2">User</th>
                <th className="text-left px-4 py-2">Quiz</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Warnings</th>
                <th className="text-left px-4 py-2">Score</th>
                <th className="text-left px-4 py-2">Time left</th>
              </tr>
            </thead>
            <tbody>
              {attempts.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No attempts yet.</td></tr>
              )}
              {attempts.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{a.username ?? a.user_id.slice(0,8)}</td>
                  <td className="px-4 py-3">{a.quiz_title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={a.warnings >= 2 ? "text-destructive font-semibold" : ""}>{a.warnings}</span>
                  </td>
                  <td className="px-4 py-3">{a.status === "in_progress" ? "—" : a.score}</td>
                  <td className="px-4 py-3"><TimeLeft endsAt={a.ends_at} status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <div className="font-medium">{e.username ?? e.user_id.slice(0,8)}</div>
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
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-widest ${colorClass}`}>
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
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
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-muted"}`}>{status.replace("_"," ")}</span>;
}

function TimeLeft({ endsAt, status }: { endsAt: string; status: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (status !== "in_progress") return <span className="text-muted-foreground">—</span>;
  const ms = new Date(endsAt).getTime() - now;
  if (ms <= 0) return <span className="text-destructive">00:00</span>;
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return <span className="tabular-nums flex items-center gap-1"><Clock className="h-3 w-3" />{h>0?`${h}:`:""}{String(m).padStart(2,"0")}:{String(sec).padStart(2,"0")}</span>;
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
