import { Link } from "@tanstack/react-router";

export function Brand({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-[var(--shadow-leaf)]"
        style={{ background: "var(--gradient-leaf)" }}
      >
        Q
      </div>
      <div className="leading-tight">
        <div className="font-display font-semibold text-foreground tracking-tight">QuizGreen</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Exam Platform</div>
      </div>
    </Link>
  );
}
