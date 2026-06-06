import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, FileSpreadsheet, Download } from "lucide-react";

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
      supabase.rpc("admin_get_questions", { _quiz_id: quizId }),
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
    if (!draft.question_text.trim()) return;
    if (draft.question_type === "mcq") {
      if (!draft.option_a || !draft.option_b) return;
    }
    const payload: any = { ...draft };
    const { error } = await supabase.from("questions").insert(payload);
    if (error) return;
    load();
  };

  const remove = async (id?: string) => {
    if (!id) return;
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) return;
    load();
  };

  const fileRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const rows = [
      { question_type: "mcq", question_text: "What is 2+2?", option_a: "3", option_b: "4", option_c: "5", option_d: "6", correct_answer: "B", marks: 1 },
      { question_type: "descriptive", question_text: "Explain the significance of Hijra.", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "", marks: 5 },
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
      if (!data.length) return;
      const payload: any[] = [];
      let pos = list.length;
      for (const row of data) {
        const type = String(row.question_type || row.type || "mcq").toLowerCase().trim();
        const isMcq = type.startsWith("mcq") || type === "multiple_choice";
        const qt = String(row.question_text || row.question || "").trim();
        if (!qt) continue;
        const marks = Number(row.marks ?? (isMcq ? 1 : 5)) || (isMcq ? 1 : 5);
        if (isMcq) {
          const correct = String(row.correct_answer || "A").trim().toUpperCase().charAt(0);
          if (!"ABCD".includes(correct)) {
            continue;
          }
          payload.push({
            quiz_id: quizId, question_type: "mcq", question_text: qt,
            option_a: String(row.option_a || "").trim() || null,
            option_b: String(row.option_b || "").trim() || null,
            option_c: String(row.option_c || "").trim() || null,
            option_d: String(row.option_d || "").trim() || null,
            correct_answer: correct, marks, position: pos++,
          });
        } else {
          payload.push({
            quiz_id: quizId, question_type: "descriptive", question_text: qt,
            option_a: null, option_b: null, option_c: null, option_d: null,
            correct_answer: null, marks, position: pos++,
          });
        }
      }
      if (!payload.length) return;
      const { error } = await supabase.from("questions").insert(payload);
      if (error) return;
      load();
    } catch (e: any) {
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/admin/quizzes" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary"><ArrowLeft className="h-3 w-3" /> Back to quizzes</Link>
      <h1 className="text-3xl font-bold mt-2">{quizTitle}</h1>
      <p className="text-muted-foreground mt-1">{list.length} question{list.length === 1 ? "" : "s"}</p>

      {/* Excel import */}
      <div className="mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 flex flex-wrap items-center gap-3">
        <FileSpreadsheet className="h-6 w-6 text-primary" />
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold">Bulk import from Excel</div>
          <div className="text-xs text-muted-foreground">Upload an .xlsx with columns: question_type, question_text, option_a–d, correct_answer (A/B/C/D), marks.</div>
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
          onChange={(e) => { const f = e.target.files?.[0]; if (f) importExcel(f); }}
        />
      </div>


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
