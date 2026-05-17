import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Users as UsersIcon, Copy, KeyRound } from "lucide-react";
import { createParticipant, deleteParticipant } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/participants")({
  component: ParticipantsPage,
});

interface Row { id: string; username: string; display_name: string | null; access_code: string | null; role?: string }

function ParticipantsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastCode, setLastCode] = useState<{ name: string; code: string } | null>(null);
  const create = useServerFn(createParticipant);
  const del = useServerFn(deleteParticipant);

  const load = async () => {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, username, display_name, access_code").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap: Record<string, string> = {};
    (roles ?? []).forEach((r) => { if (r.role === "admin" || !roleMap[r.user_id]) roleMap[r.user_id] = r.role; });
    setRows((profiles ?? []).map((p: any) => ({ ...p, role: roleMap[p.id] ?? "participant" })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return toast.error("Candidate name required");
    setBusy(true);
    try {
      const res = await create({ data: { display_name: name.trim() } });
      setLastCode({ name: name.trim(), code: res.access_code });
      toast.success("Candidate created — share the access code");
      setName("");
      load();
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this candidate and all their attempts?")) return;
    try { await del({ data: { user_id: id } }); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied"); };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2"><UsersIcon className="h-6 w-6 text-primary" /><h1 className="text-3xl font-bold">Candidates</h1></div>
      <p className="text-muted-foreground mt-1">Generate access codes for exam takers. They sign in with the code only.</p>

      {lastCode && (
        <div className="mt-5 rounded-2xl border-2 border-primary bg-primary/5 p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold">New access code for {lastCode.name}</div>
            <div className="font-mono text-3xl font-bold mt-1 tracking-widest">{lastCode.code}</div>
            <div className="text-xs text-muted-foreground mt-1">Share this code with the candidate. It is the only thing they need to log in.</div>
          </div>
          <Button variant="outline" onClick={() => copy(lastCode.code)}><Copy className="h-4 w-4 mr-2" />Copy</Button>
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
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
                    {r.access_code ? (
                      <button onClick={() => copy(r.access_code!)} className="font-mono font-semibold inline-flex items-center gap-2 hover:text-primary">
                        <KeyRound className="h-3 w-3" /> {r.access_code}
                      </button>
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

        <div className="rounded-2xl border border-border bg-card p-5 h-fit">
          <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" />Add candidate</h2>
          <div className="mt-3 space-y-3">
            <div>
              <Label>Candidate name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aisha Khan" />
            </div>
            <Button onClick={add} disabled={busy} className="w-full">{busy ? "Generating…" : "Generate access code"}</Button>
            <p className="text-xs text-muted-foreground">A unique 8-character code will be generated. Share it with the candidate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
