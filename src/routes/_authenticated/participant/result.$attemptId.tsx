import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/participant/result/$attemptId")({
  component: ResultPage,
});

function ResultPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pt-10 max-w-xl mx-auto">
      <div className="rounded-2xl bg-card border border-border p-10 text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-leaf)" }}>
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Exam submitted</h1>
        <p className="text-muted-foreground mt-2">
          Your responses have been recorded. Results will be reviewed by your administrator.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Scores are not shown to candidates. Thank you for taking the exam.
        </p>

        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => signOut().then(() => (window.location.href = "/"))}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <Link to="/participant/dashboard" className="inline-flex items-center px-5 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent/40">
            Back to dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
