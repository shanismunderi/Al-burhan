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

type QType = "mcq" | "descriptive";

interface Q {
  id?: string;
  quiz_id: string;
  question_type: QType;
  question_text: string;
  option_a: string | null; option_b: string | null; option_c: string | null; option_d: string | null;
  correct_answer: string | null;
  marks: number;
  position: number;
}

const emptyMcq = (quiz_id: string, pos: number): Q => ({
  quiz_id, question_type: "mcq", question_text: "",
  option_a: "", option_b: "", option_c: "", option_d: "",
  correct_answer: "A", marks: 1, position: pos,
});
const emptyDesc = (quiz_id: string, pos: number): Q => ({
  quiz_id, question_type: "descriptive", question_text: "",
  option_a: null, option_b: null, option_c: null, option_d: null,
  correct_answer: null, marks: 5, position: pos,
});

function QuestionsPage() {
  const { quizId } = Route.useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState<Q[]>([]);
  const [draft, setDraft] = useState<Q>(emptyMcq(quizId, 0));

  const load = async () => {
    const [{ data: quiz }, { data: qs }] = await Promise.all([
      supabase.from("quizzes").select("title").eq("id", quizId).maybeSingle(),
      supabase.from("questions").select("*").eq("quiz_id", quizId).order("position"),
    ]);
    setQuizTitle(quiz?.title ?? "");
    const items = (qs as Q[]) ?? [];
    setList(items);
    setDraft((d) => (d.question_type === "descriptive" ? emptyDesc : emptyMcq)(quizId, items.length));
  };
  useEffect(() => { load(); }, [quizId]);

  const switchType = (t: QType) => {
    setDraft((t === "mcq" ? emptyMcq : emptyDesc)(quizId, list.length));
  };

  const add = async () => {
    if (!draft.question_text.trim()) return toast.error("Question text required");
    if (draft.question_type === "mcq") {
      if (!draft.option_a || !draft.option_b) return toast.error("Provide at least options A and B");
    }
    const payload: any = { ...draft };
    const { error } = await supabase.from("questions").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Question added");
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
              <div>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {q.question_type === "mcq" ? "MCQ" : "Descriptive"}
                </span>
                <div className="font-semibold mt-1">Q{i + 1}. {q.question_text}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            {q.question_type === "mcq" && (
              <ul className="grid grid-cols-2 gap-2 mt-3 text-sm">
                {(["A","B","C","D"] as const).map((k) => {
                  const v = (q as any)[`option_${k.toLowerCase()}`];
                  if (!v) return null;
                  return (
                    <li key={k} className={`px-3 py-2 rounded-lg border ${q.correct_answer === k ? "border-primary bg-primary/5 text-primary font-medium" : "border-border"}`}>
                      <span className="font-mono text-xs mr-2">{k}</span>{v}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="text-xs text-muted-foreground mt-2">Marks: {q.marks}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2"><Plus className="h-4 w-4" /> Add question</h2>

        <div className="mt-4 flex gap-2">
          <button onClick={() => switchType("mcq")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${draft.question_type === "mcq" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
            Multiple choice
          </button>
          <button onClick={() => switchType("descriptive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${draft.question_type === "descriptive" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
            Descriptive (written answer)
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label>Question</Label>
            <Textarea rows={2} value={draft.question_text} onChange={(e) => setDraft({ ...draft, question_text: e.target.value })} />
          </div>
          {draft.question_type === "mcq" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {(["a","b","c","d"] as const).map((k) => (
                  <div key={k}>
                    <Label>Option {k.toUpperCase()}</Label>
                    <Input value={(draft as any)[`option_${k}`] ?? ""} onChange={(e) => setDraft({ ...draft, [`option_${k}`]: e.target.value } as any)} />
                  </div>
                ))}
              </div>
              <div>
                <Label>Correct answer</Label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3"
                  value={draft.correct_answer ?? "A"}
                  onChange={(e) => setDraft({ ...draft, correct_answer: e.target.value })}>
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </div>
            </>
          )}
          {draft.question_type === "descriptive" && (
            <div className="text-xs text-muted-foreground rounded-lg bg-muted/40 p-3">
              Candidates will type a written answer. You'll grade it manually in the Results page.
            </div>
          )}
          <div>
            <Label>Marks</Label>
            <Input type="number" step="0.25" value={draft.marks} onChange={(e) => setDraft({ ...draft, marks: Number(e.target.value) })} />
          </div>
          <Button onClick={add} className="w-full">Add question</Button>
        </div>
      </div>
    </div>
  );
}
