import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, FileSpreadsheet, Download, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/questions/$quizId")({
  component: QuestionsPage,
});

type QType = "mcq" | "one_word" | "descriptive";

interface Q {
  id?: string;
  quiz_id: string;
  question_type: QType;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_answer: string | null;
  marks: number;
  position: number;
}

const emptyMcq = (quiz_id: string, pos: number): Q => ({
  quiz_id,
  question_type: "mcq",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "A",
  marks: 1,
  position: pos,
});
const emptyOneWord = (quiz_id: string, pos: number): Q => ({
  quiz_id,
  question_type: "one_word",
  question_text: "",
  option_a: null,
  option_b: null,
  option_c: null,
  option_d: null,
  correct_answer: "",
  marks: 2,
  position: pos,
});
const emptyDesc = (quiz_id: string, pos: number): Q => ({
  quiz_id,
  question_type: "descriptive",
  question_text: "",
  option_a: null,
  option_b: null,
  option_c: null,
  option_d: null,
  correct_answer: null,
  marks: 5,
  position: pos,
});

function QuestionsPage() {
  const { quizId } = Route.useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [list, setList] = useState<Q[]>([]);
  const [draft, setDraft] = useState<Q>(emptyMcq(quizId, 0));
  const [editingQuestion, setEditingQuestion] = useState<Q | null>(null);

  const startEdit = (q: Q) => {
    setEditingQuestion({ ...q });
  };

  const load = async () => {
    const [{ data: quiz }, { data: qs }] = await Promise.all([
      supabase.from("quizzes").select("title").eq("id", quizId).maybeSingle(),
      supabase.rpc("admin_get_questions", { _quiz_id: quizId }),
    ]);
    setQuizTitle(quiz?.title ?? "");
    const items = (qs as Q[]) ?? [];
    setList(items);
    setDraft((d) =>
      (d.question_type === "descriptive"
        ? emptyDesc
        : d.question_type === "one_word"
          ? emptyOneWord
          : emptyMcq)(quizId, items.length),
    );
  };
  useEffect(() => {
    load();
  }, [quizId]);

  const switchType = (t: QType) => {
    setDraft(
      (t === "mcq" ? emptyMcq : t === "one_word" ? emptyOneWord : emptyDesc)(quizId, list.length),
    );
  };

  const switchEditType = (t: QType) => {
    if (!editingQuestion) return;
    const base = {
      ...editingQuestion,
      question_type: t,
    };
    if (t === "mcq") {
      setEditingQuestion({
        ...base,
        option_a: editingQuestion.option_a || "",
        option_b: editingQuestion.option_b || "",
        option_c: editingQuestion.option_c || "",
        option_d: editingQuestion.option_d || "",
        correct_answer: ["A", "B", "C", "D"].includes(editingQuestion.correct_answer || "")
          ? editingQuestion.correct_answer
          : "A",
      });
    } else if (t === "one_word") {
      setEditingQuestion({
        ...base,
        option_a: null,
        option_b: null,
        option_c: null,
        option_d: null,
        correct_answer: editingQuestion.correct_answer || "",
      });
    } else {
      setEditingQuestion({
        ...base,
        option_a: null,
        option_b: null,
        option_c: null,
        option_d: null,
        correct_answer: null,
      });
    }
  };

  const add = async () => {
    if (!draft.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (draft.question_type === "mcq") {
      if (!draft.option_a?.trim() || !draft.option_b?.trim()) {
        toast.error("At least Option A and Option B are required for MCQ");
        return;
      }
    } else if (draft.question_type === "one_word") {
      if (!draft.correct_answer || !draft.correct_answer.trim()) {
        toast.error("Correct answer word is required for One Word questions");
        return;
      }
    }
    const payload: any = { ...draft };
    const { error } = await supabase.from("questions").insert(payload);
    if (error) {
      toast.error(error.message || "Failed to add question");
      return;
    }
    toast.success("Question added successfully");
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this question?")) return;
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      toast.error(error.message || "Failed to delete question");
      return;
    }
    toast.success("Question deleted successfully");
    load();
  };

  const saveEdit = async () => {
    if (!editingQuestion || !editingQuestion.id) return;
    if (!editingQuestion.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (editingQuestion.question_type === "mcq") {
      if (!editingQuestion.option_a?.trim() || !editingQuestion.option_b?.trim()) {
        toast.error("At least Option A and Option B are required for MCQ");
        return;
      }
    } else if (editingQuestion.question_type === "one_word") {
      if (!editingQuestion.correct_answer || !editingQuestion.correct_answer.trim()) {
        toast.error("Correct answer word is required for One Word questions");
        return;
      }
    }

    const payload = {
      question_text: editingQuestion.question_text,
      question_type: editingQuestion.question_type,
      option_a: editingQuestion.option_a,
      option_b: editingQuestion.option_b,
      option_c: editingQuestion.option_c,
      option_d: editingQuestion.option_d,
      correct_answer: editingQuestion.correct_answer,
      marks: editingQuestion.marks,
      position: editingQuestion.position,
    };

    const { error } = await supabase.from("questions").update(payload).eq("id", editingQuestion.id);

    if (error) {
      toast.error(error.message || "Failed to update question");
      return;
    }

    toast.success("Question updated successfully");
    setEditingQuestion(null);
    load();
  };

  const fileRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const rows = [
      {
        question_type: "mcq",
        question_text: "What is 2+2?",
        option_a: "3",
        option_b: "4",
        option_c: "5",
        option_d: "6",
        correct_answer: "B",
        marks: 1,
      },
      {
        question_type: "one_word",
        question_text: "What is the capital of Saudi Arabia?",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "Riyadh",
        marks: 2,
      },
      {
        question_type: "descriptive",
        question_text: "Explain the significance of Hijra.",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        marks: 5,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "questions-template.xlsx");
  };

  const importExcel = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<any>(ws, { defval: "" });
      if (!data.length) {
        toast.error("The selected file is empty");
        return;
      }
      const payload: any[] = [];
      let pos = list.length;
      for (const row of data) {
        const type = String(row.question_type || row.type || "mcq")
          .toLowerCase()
          .trim();
        const isMcq = type.startsWith("mcq") || type === "multiple_choice" || type === "optional";
        const isOneWord =
          type.includes("one_word") ||
          type.includes("one word") ||
          type === "short" ||
          type === "short_answer" ||
          type === "oneword";
        const qt = String(row.question_text || row.question || "").trim();
        if (!qt) continue;
        const marks =
          Number(row.marks ?? (isMcq ? 1 : isOneWord ? 2 : 5)) || (isMcq ? 1 : isOneWord ? 2 : 5);
        if (isMcq) {
          const correct = String(row.correct_answer || "A")
            .trim()
            .toUpperCase()
            .charAt(0);
          if (!"ABCD".includes(correct)) {
            continue;
          }
          payload.push({
            quiz_id: quizId,
            question_type: "mcq",
            question_text: qt,
            option_a: String(row.option_a || "").trim() || null,
            option_b: String(row.option_b || "").trim() || null,
            option_c: String(row.option_c || "").trim() || null,
            option_d: String(row.option_d || "").trim() || null,
            correct_answer: correct,
            marks,
            position: pos++,
          });
        } else if (isOneWord) {
          payload.push({
            quiz_id: quizId,
            question_type: "one_word",
            question_text: qt,
            option_a: null,
            option_b: null,
            option_c: null,
            option_d: null,
            correct_answer: String(row.correct_answer || "").trim(),
            marks,
            position: pos++,
          });
        } else {
          payload.push({
            quiz_id: quizId,
            question_type: "descriptive",
            question_text: qt,
            option_a: null,
            option_b: null,
            option_c: null,
            option_d: null,
            correct_answer: null,
            marks,
            position: pos++,
          });
        }
      }
      if (!payload.length) {
        toast.error("No valid questions found in Excel file");
        return;
      }
      const { error } = await supabase.from("questions").insert(payload);
      if (error) {
        toast.error(error.message || "Failed to import questions");
        return;
      }
      toast.success(`Successfully imported ${payload.length} question(s)`);
      load();
    } catch (e: any) {
      toast.error("Error parsing Excel file: " + (e.message || "Unknown error"));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link
        to="/admin/quizzes"
        className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary"
      >
        <ArrowLeft className="h-3 w-3" /> Back to quizzes
      </Link>
      <h1 className="text-3xl font-bold mt-2">{quizTitle}</h1>
      <p className="text-muted-foreground mt-1">
        {list.length} question{list.length === 1 ? "" : "s"}
      </p>

      {/* Excel import */}
      <div className="mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 flex flex-wrap items-center gap-3">
        <FileSpreadsheet className="h-6 w-6 text-primary" />
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold">Bulk import from Excel</div>
          <div className="text-xs text-muted-foreground">
            Upload an .xlsx with columns: question_type, question_text, option_a–d, correct_answer
            (A/B/C/D), marks.
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-1" /> Template
        </Button>
        <Button size="sm" onClick={() => fileRef.current?.click()}>
          <FileSpreadsheet className="h-4 w-4 mr-1" /> Import .xlsx
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importExcel(f);
          }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {list.map((q, i) => (
          <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {q.question_type === "mcq"
                    ? "MCQ (Optional)"
                    : q.question_type === "one_word"
                      ? "One Word"
                      : "Descriptive"}
                </span>
                <div className="font-semibold mt-1">
                  Q{i + 1}. {q.question_text}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(q)}>
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(q.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            {q.question_type === "mcq" && (
              <ul className="grid grid-cols-2 gap-2 mt-3 text-sm">
                {(["A", "B", "C", "D"] as const).map((k) => {
                  const v = (q as any)[`option_${k.toLowerCase()}`];
                  if (!v) return null;
                  return (
                    <li
                      key={k}
                      className={`px-3 py-2 rounded-lg border ${q.correct_answer === k ? "border-primary bg-primary/5 text-primary font-medium" : "border-border"}`}
                    >
                      <span className="font-mono text-xs mr-2">{k}</span>
                      {v}
                    </li>
                  );
                })}
              </ul>
            )}
            {q.question_type === "one_word" && (
              <div className="mt-3 text-sm flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Correct answer:</span>
                <span className="font-mono bg-success/10 text-success px-2.5 py-1 rounded-md font-semibold text-xs">
                  {q.correct_answer}
                </span>
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">Marks: {q.marks}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add question
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => switchType("mcq")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${draft.question_type === "mcq" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`}
          >
            Multiple choice (Optional)
          </button>
          <button
            onClick={() => switchType("one_word")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${draft.question_type === "one_word" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`}
          >
            One word question
          </button>
          <button
            onClick={() => switchType("descriptive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${draft.question_type === "descriptive" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`}
          >
            Descriptive (Essay type)
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label>Question</Label>
            <Textarea
              rows={2}
              value={draft.question_text}
              onChange={(e) => setDraft({ ...draft, question_text: e.target.value })}
            />
          </div>
          {draft.question_type === "mcq" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {(["a", "b", "c", "d"] as const).map((k) => (
                  <div key={k}>
                    <Label>Option {k.toUpperCase()}</Label>
                    <Input
                      value={(draft as any)[`option_${k}`] ?? ""}
                      onChange={(e) =>
                        setDraft({ ...draft, [`option_${k}`]: e.target.value } as any)
                      }
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label>Correct answer</Label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                  value={draft.correct_answer ?? "A"}
                  onChange={(e) => setDraft({ ...draft, correct_answer: e.target.value })}
                >
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>
            </>
          )}
          {draft.question_type === "one_word" && (
            <div>
              <Label>Correct answer word</Label>
              <Input
                placeholder="e.g. Riyadh"
                value={draft.correct_answer ?? ""}
                onChange={(e) => setDraft({ ...draft, correct_answer: e.target.value })}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Candidates must type this word. Auto-grading will check case-insensitively and trim
                spaces.
              </div>
            </div>
          )}
          {draft.question_type === "descriptive" && (
            <div className="text-xs text-muted-foreground rounded-lg bg-muted/40 p-3">
              Candidates will type a written answer. You'll grade it manually in the Results page.
            </div>
          )}
          <div>
            <Label>Marks</Label>
            <Input
              type="number"
              step="0.25"
              value={draft.marks}
              onChange={(e) => setDraft({ ...draft, marks: Number(e.target.value) })}
            />
          </div>
          <Button onClick={add} className="w-full">
            Add question
          </Button>
        </div>
      </div>

      <Dialog
        open={editingQuestion !== null}
        onOpenChange={(open) => {
          if (!open) setEditingQuestion(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>

          {editingQuestion && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => switchEditType("mcq")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editingQuestion.question_type === "mcq" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`}
                >
                  Multiple choice (Optional)
                </button>
                <button
                  onClick={() => switchEditType("one_word")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editingQuestion.question_type === "one_word" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`}
                >
                  One word question
                </button>
                <button
                  onClick={() => switchEditType("descriptive")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${editingQuestion.question_type === "descriptive" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted/50"}`}
                >
                  Descriptive (Essay type)
                </button>
              </div>

              <div>
                <Label>Question Text</Label>
                <Textarea
                  rows={3}
                  value={editingQuestion.question_text}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, question_text: e.target.value })
                  }
                />
              </div>

              {editingQuestion.question_type === "mcq" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {(["a", "b", "c", "d"] as const).map((k) => (
                      <div key={k}>
                        <Label>Option {k.toUpperCase()}</Label>
                        <Input
                          value={(editingQuestion as any)[`option_${k}`] ?? ""}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              [`option_${k}`]: e.target.value,
                            } as any)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label>Correct Answer Option</Label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm animate-none"
                      value={editingQuestion.correct_answer ?? "A"}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })
                      }
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                    </select>
                  </div>
                </>
              )}

              {editingQuestion.question_type === "one_word" && (
                <div>
                  <Label>Correct Answer Word</Label>
                  <Input
                    placeholder="e.g. Riyadh"
                    value={editingQuestion.correct_answer ?? ""}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, correct_answer: e.target.value })
                    }
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Candidates must type this word. Auto-grading will check case-insensitively and
                    trim spaces.
                  </div>
                </div>
              )}

              {editingQuestion.question_type === "descriptive" && (
                <div className="text-xs text-muted-foreground rounded-lg bg-muted/40 p-3">
                  Candidates will type a written answer. You'll grade it manually in the Results
                  page.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    step="0.25"
                    value={editingQuestion.marks}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, marks: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Display Order / Position</Label>
                  <Input
                    type="number"
                    value={editingQuestion.position}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, position: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
