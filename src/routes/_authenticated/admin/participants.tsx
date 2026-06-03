import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Users as UsersIcon, Copy, KeyRound, Pencil, Check, X } from "lucide-react";
import { createParticipant, deleteParticipant, updateAccessCode } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/participants")({
  component: ParticipantsPage,
});

interface Row { id: string; username: string; display_name: string | null; access_code: string | null; member1_name?: string | null; member2_name?: string | null; role?: string }

function ParticipantsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastCode, setLastCode] = useState<{ name: string; code: string } | null>(null);
  const [editing, setEditing] = useState<{ id: string; code: string } | null>(null);
  const create = useServerFn(createParticipant);
  const del = useServerFn(deleteParticipant);
  const updateCode = useServerFn(updateAccessCode);

  const load = async () => {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, username, display_name, access_code, member1_name, member2_name").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap: Record<string, string> = {};
    (roles ?? []).forEach((r) => { if (r.role === "admin" || !roleMap[r.user_id]) roleMap[r.user_id] = r.role; });
    setRows((profiles ?? []).map((p: any) => ({ ...p, role: roleMap[p.id] ?? "participant" })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!m1.trim() || !m2.trim()) return toast.error("Both team member names required");
    setBusy(true);
    try {
      const res = await create({ data: { member1_name: m1.trim(), member2_name: m2.trim(), access_code: customCode.trim() || undefined } });
      setLastCode({ name: `${m1.trim()} & ${m2.trim()}`, code: res.access_code });
      toast.success("Team created — share the access code");
      setM1(""); setM2(""); setCustomCode("");
      load();
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this candidate and all their attempts?")) return;
    try { await del({ data: { user_id: id } }); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await updateCode({ data: { user_id: editing.id, access_code: editing.code.trim().toUpperCase() } });
      toast.success("Access code updated");
      setEditing(null); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied"); };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-2"><UsersIcon className="h-6 w-6 text-primary" /><h1 className="text-2xl md:text-3xl font-bold">Candidates</h1></div>
      <p className="text-sm text-muted-foreground mt-1">Generate or customize access codes for exam takers. They sign in with the code only.</p>

      {lastCode && (
        <div className="mt-5 rounded-2xl border-2 border-primary bg-primary/5 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-widest text-primary font-semibold">New access code for {lastCode.name}</div>
            <div className="font-mono text-2xl md:text-3xl font-bold mt-1 tracking-widest break-all">{lastCode.code}</div>
            <div className="text-xs text-muted-foreground mt-1">Share this code with the candidate.</div>
          </div>
          <Button variant="outline" onClick={() => copy(lastCode.code)} className="shrink-0"><Copy className="h-4 w-4 mr-2" />Copy</Button>
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 h-fit lg:order-2">
          <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" />Add candidate</h2>
          <div className="mt-3 space-y-3">
            <div>
              <Label>Candidate name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aisha Khan" />
            </div>
            <div>
              <Label>Custom access code <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                placeholder="Leave empty to auto-generate"
                className="font-mono"
                maxLength={16}
              />
              <p className="text-[11px] text-muted-foreground mt-1">A–Z and 0–9 only, 4–16 characters.</p>
            </div>
            <Button onClick={add} disabled={busy} className="w-full">{busy ? "Saving…" : "Create candidate"}</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden lg:order-1">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Access code</th><th className="text-left px-4 py-2">Role</th><th /></tr>
              </thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No candidates yet.</td></tr>}
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{r.display_name || r.username}</td>
                    <td className="px-4 py-3">
                      {editing?.id === r.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editing.code}
                            onChange={(e) => setEditing({ id: r.id, code: e.target.value.toUpperCase() })}
                            className="h-8 w-40 font-mono"
                            maxLength={16}
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" onClick={saveEdit}><Check className="h-4 w-4 text-success" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                        </div>
                      ) : r.access_code ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => copy(r.access_code!)} className="font-mono font-semibold inline-flex items-center gap-2 hover:text-primary">
                            <KeyRound className="h-3 w-3" /> {r.access_code}
                          </button>
                          {r.role !== "admin" && (
                            <Button size="icon" variant="ghost" onClick={() => setEditing({ id: r.id, code: r.access_code! })}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      ) : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${r.role === "admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{r.role}</span></td>
                    <td className="px-4 py-3 text-right">
                      {r.role !== "admin" && <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-border">
            {rows.length === 0 && <div className="px-4 py-10 text-center text-muted-foreground text-sm">No candidates yet.</div>}
            {rows.map((r) => (
              <div key={r.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.display_name || r.username}</div>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${r.role === "admin" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{r.role}</span>
                  </div>
                  {r.role !== "admin" && (
                    <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  )}
                </div>
                {editing?.id === r.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editing.code}
                      onChange={(e) => setEditing({ id: r.id, code: e.target.value.toUpperCase() })}
                      className="h-9 font-mono"
                      maxLength={16}
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={saveEdit}><Check className="h-4 w-4 text-success" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : r.access_code ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => copy(r.access_code!)} className="font-mono font-semibold inline-flex items-center gap-2 hover:text-primary text-sm">
                      <KeyRound className="h-3 w-3" /> {r.access_code}
                    </button>
                    {r.role !== "admin" && (
                      <Button size="icon" variant="ghost" onClick={() => setEditing({ id: r.id, code: r.access_code! })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ) : <span className="text-muted-foreground text-xs">No code</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
