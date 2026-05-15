import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ListChecks } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/quizzes")({
  component: QuizzesPage,
});

interface Quiz { id: string; title: string; instructions: string | null; duration_minutes: number; negative_marks: number; is_active: boolean; randomize: boolean; }

function QuizzesPage() {
  const [list, setList] = useState<Quiz[]>([]);
  const [editing, setEditing] = useState<Partial<Quiz> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
    setList((data as Quiz[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    const payload = {
      title: editing.title!,
      instructions: editing.instructions ?? "",
      duration_minutes: Number(editing.duration_minutes ?? 30),
      negative_marks: Number(editing.negative_marks ?? 0),
      is_active: editing.is_active ?? true,
      randomize: editing.randomize ?? false,
    };
    if (editing.id) {
      const { error } = await supabase.from("quizzes").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("quizzes").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this quiz and all its questions?")) return;
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="text-muted-foreground mt-1">Create and manage your exam papers.</p>
        </div>
        <Button onClick={() => setEditing({ duration_minutes: 30, negative_marks: 0, is_active: true })}><Plus className="h-4 w-4 mr-2" />New quiz</Button>
      </div>

      <div className="mt-6 grid gap-3">
        {list.length === 0 && <div className="text-muted-foreground text-sm rounded-2xl border border-dashed border-border p-12 text-center">No quizzes yet. Create one to get started.</div>}
        {list.map((q) => (
          <div key={q.id} className="rounded-2xl bg-card border border-border p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">{q.title}</span>
                {q.is_active ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/15 text-success">ACTIVE</span> : <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">PAUSED</span>}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{q.duration_minutes} min · negative {q.negative_marks}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild variant="outline" size="sm"><Link to="/admin/questions/$quizId" params={{ quizId: q.id }}><ListChecks className="h-4 w-4 mr-1" />Questions</Link></Button>
              <Button variant="ghost" size="icon" onClick={() => setEditing(q)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold">{editing.id ? "Edit quiz" : "New quiz"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <Label>Title</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Instructions</Label>
                <Textarea rows={3} value={editing.instructions ?? ""} onChange={(e) => setEditing({ ...editing, instructions: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input type="number" min={1} value={editing.duration_minutes ?? 30} onChange={(e) => setEditing({ ...editing, duration_minutes: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Negative marks</Label>
                  <Input type="number" step="0.25" value={editing.negative_marks ?? 0} onChange={(e) => setEditing({ ...editing, negative_marks: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <Label className="!m-0">Active (visible to participants)</Label>
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <Label className="!m-0">Randomize questions</Label>
                <Switch checked={editing.randomize ?? false} onCheckedChange={(v) => setEditing({ ...editing, randomize: v })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
