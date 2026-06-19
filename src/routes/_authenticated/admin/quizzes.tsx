import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ListChecks, Save, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/quizzes")({
  component: QuizSettingsPage,
});

interface Quiz {
  id: string;
  title: string;
  instructions: string | null;
  duration_minutes: number;
  negative_marks: number;
  is_active: boolean;
  randomize: boolean;
}

function QuizSettingsPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    let q = data as Quiz | null;
    if (!q) {
      // Auto-create the singleton quiz on first visit
      const { data: created, error } = await supabase
        .from("quizzes")
        .insert({
          title: "Main Examination",
          instructions: "Read each question carefully. Manage your time wisely.",
          duration_minutes: 30,
          negative_marks: 0,
          is_active: true,
          randomize: false,
        })
        .select()
        .single();
      if (error) {
        setLoading(false);
        return;
      }
      q = created as Quiz;
    } else {
      // Cleanup: if multiple legacy quizzes exist, keep only the first
      await supabase.from("quizzes").delete().neq("id", q.id);
    }
    setQuiz(q);
    const { count } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", q.id);
    setQuestionCount(count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!quiz) return;
    if (!quiz.title.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("quizzes")
      .update({
        title: quiz.title,
        instructions: quiz.instructions ?? "",
        duration_minutes: Number(quiz.duration_minutes),
        negative_marks: Number(quiz.negative_marks),
        is_active: quiz.is_active,
        randomize: quiz.randomize,
      })
      .eq("id", quiz.id);
    setSaving(false);
    if (error) return;
  };

  if (loading || !quiz) {
    return (
      <div className="p-8 text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading quiz…
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Quiz settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure the single exam available to all candidates.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/admin/questions/$quizId" params={{ quizId: quiz.id }}>
            <ListChecks className="h-4 w-4 mr-2" /> Manage questions ({questionCount})
          </Link>
        </Button>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border p-6 space-y-5">
        <div>
          <Label>Exam title</Label>
          <Input
            className="mt-1.5"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />
        </div>

        <div>
          <Label>Instructions shown to candidates</Label>
          <Textarea
            className="mt-1.5"
            rows={5}
            value={quiz.instructions ?? ""}
            onChange={(e) => setQuiz({ ...quiz, instructions: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Duration (minutes)</Label>
            <Input
              className="mt-1.5"
              type="number"
              min={1}
              value={quiz.duration_minutes}
              onChange={(e) => setQuiz({ ...quiz, duration_minutes: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Negative marks per wrong MCQ</Label>
            <Input
              className="mt-1.5"
              type="number"
              step="0.25"
              value={quiz.negative_marks}
              onChange={(e) => setQuiz({ ...quiz, negative_marks: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div>
            <Label className="!m-0">Exam is active</Label>
            <div className="text-xs text-muted-foreground mt-0.5">
              When off, candidates cannot start the exam.
            </div>
          </div>
          <Switch
            checked={quiz.is_active}
            onCheckedChange={(v) => setQuiz({ ...quiz, is_active: v })}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div>
            <Label className="!m-0">Randomize question order</Label>
            <div className="text-xs text-muted-foreground mt-0.5">
              Each candidate sees questions in a different order.
            </div>
          </div>
          <Switch
            checked={quiz.randomize}
            onCheckedChange={(v) => setQuiz({ ...quiz, randomize: v })}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save changes
          </Button>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Each candidate may attempt this exam <b className="text-foreground">only once</b>. After
        submission they will see a confirmation message.
      </div>
    </div>
  );
}
