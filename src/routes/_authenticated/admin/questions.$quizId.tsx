import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/questions/$quizId")({
  component: QuestionsPage,
});

interface Q {
  id?: string;
  quiz_id: string;
  question_text: string;
  option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: "A"|"B"|"C"|"D";
  marks: number;
  position: number;
}

const empty = (quiz_id: string, pos: number): Q => ({ quiz_id, question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "A", marks: 1, position: pos });

function QuestionsPage() {
  const { quizId } = Route.useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState<Q[]>([]);
  const [draft, setDraft] = useState<Q>(empty(quizId, 0));

  const load = async () => {
    const [{ data: quiz }, { data: qs }] = await Promise.all([
      supabase.from("quizzes").select("title").eq("id", quizId).maybeSingle(),
      supabase.from("questions").select("*").eq("quiz_id", quizId).order("position"),
    ]);
    setQuizTitle(quiz?.title ?? "");
    setList((qs as Q[]) ?? []);
    setDraft(empty(quizId, (qs?.length ?? 0)));
  };
  useEffect(() => { load(); }, [quizId]);

  const add = async () => {
    if (!draft.question_text || !draft.option_a || !draft.option_b) return toast.error("Fill question and at least options A & B");
    const { error } = await supabase.from("questions").insert(draft);
    if (error) return toast.error(error.message);
    toast.success("Added");
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/admin/quizzes" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary"><ArrowLeft className="h-3 w-3" /> Back to quizzes</Link>
      <h1 className="text-3xl font-bold mt-2">{quizTitle}</h1>
      <p className="text-muted-foreground mt-1">{list.length} question{list.length === 1 ? "" : "s"}</p>

      <div className="mt-6 space-y-3">
        {list.map((q, i) => (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-semibold">Q{i + 1}. {q.question_text}</div>
              <Button variant="ghost" size="icon" onClick={() => remove(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <ul className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {(["A","B","C","D"] as const).map((k) => (
                <li key={k} className={`px-3 py-2 rounded-lg border ${q.correct_answer === k ? "border-primary bg-primary/5 text-primary font-medium" : "border-border"}`}>
                  <span className="font-mono text-xs mr-2">{k}</span>{(q as any)[`option_${k.toLowerCase()}`]}
                </li>
              ))}
            </ul>
            <div className="text-xs text-muted-foreground mt-2">Marks: {q.marks}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add question</h2>
        <div className="mt-4 space-y-3">
          <div>
            <Label>Question</Label>
            <Textarea rows={2} value={draft.question_text} onChange={(e) => setDraft({ ...draft, question_text: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["a","b","c","d"] as const).map((k) => (
              <div key={k}>
                <Label>Option {k.toUpperCase()}</Label>
                <Input value={(draft as any)[`option_${k}`]} onChange={(e) => setDraft({ ...draft, [`option_${k}`]: e.target.value } as any)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Correct answer</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={draft.correct_answer} onChange={(e) => setDraft({ ...draft, correct_answer: e.target.value as any })}>
                <option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </div>
            <div>
              <Label>Marks</Label>
              <Input type="number" step="0.25" value={draft.marks} onChange={(e) => setDraft({ ...draft, marks: Number(e.target.value) })} />
            </div>
          </div>
          <Button onClick={add} className="w-full">Add question</Button>
        </div>
      </div>
    </div>
  );
}
