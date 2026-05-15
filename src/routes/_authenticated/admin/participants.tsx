import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Users as UsersIcon } from "lucide-react";
import { createParticipant, deleteParticipant } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/participants")({
  component: ParticipantsPage,
});

interface Row { id: string; username: string; display_name: string | null; role?: string }

function ParticipantsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [n, setN] = useState("");
  const [busy, setBusy] = useState(false);
  const create = useServerFn(createParticipant);
  const del = useServerFn(deleteParticipant);

  const load = async () => {
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, username, display_name").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap: Record<string, string> = {};
    (roles ?? []).forEach((r) => { if (r.role === "admin" || !roleMap[r.user_id]) roleMap[r.user_id] = r.role; });
    setRows((profiles ?? []).map((p: any) => ({ ...p, role: roleMap[p.id] ?? "participant" })));
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!u || !p) return toast.error("Username and password required");
    setBusy(true);
    try {
      await create({ data: { username: u, password: p, display_name: n || undefined } });
      toast.success("Participant created");
      setU(""); setP(""); setN("");
      load();
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this participant and all their attempts?")) return;
    try { await del({ data: { user_id: id } }); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2"><UsersIcon className="h-6 w-6 text-primary" /><h1 className="text-3xl font-bold">Participants</h1></div>
      <p className="text-muted-foreground mt-1">Create login credentials for exam takers.</p>

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr><th className="text-left px-4 py-2">Username</th><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Role</th><th /></tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No accounts yet.</td></tr>}
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{r.username}</td>
                  <td className="px-4 py-3">{r.display_name}</td>
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
          <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" />Add participant</h2>
          <div className="mt-3 space-y-3">
            <div><Label>Username</Label><Input value={u} onChange={(e) => setU(e.target.value)} placeholder="quiz101" /></div>
            <div><Label>Password</Label><Input type="text" value={p} onChange={(e) => setP(e.target.value)} placeholder="strong password" /></div>
            <div><Label>Display name (optional)</Label><Input value={n} onChange={(e) => setN(e.target.value)} /></div>
            <Button onClick={add} disabled={busy} className="w-full">{busy ? "Creating…" : "Create account"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
