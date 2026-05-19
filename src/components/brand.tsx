import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png";

export function Brand({ to = "/", light = false }: { to?: string; light?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-3 group">
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shadow-[var(--shadow-leaf)] overflow-hidden"
        style={{ background: light ? "rgba(255,255,255,0.12)" : "var(--gradient-leaf)" }}
      >
        <img src={logoMark} alt="Al-Burhan" className="h-8 w-8 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
      </div>
      <div className="leading-tight">
        <div className={`font-display font-bold tracking-tight ${light ? "text-primary-foreground" : "text-foreground"}`}>
          Al-Burhan <span className="text-primary">2.0</span>
        </div>
        <div className={`text-[10px] uppercase tracking-[0.18em] ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          National Grand Quiz
        </div>
      </div>
    </Link>
  );
}
