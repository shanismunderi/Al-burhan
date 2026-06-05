import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Trophy, ScrollText, Clock } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      {
        name: "description",
        content:
          "Darul Hasanath Islamic College's National Grand Quiz on Islamic Civilization & Ihsan. Cash prizes ₹6,666.",
      },
    ],
    links: [
      { rel: "preload", as: "image", href: logoHero, fetchpriority: "high" },
    ],
  }),
});

function Landing() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session && role) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/admin/login">Admin</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/login">
                Enter code <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <section className="w-full max-w-5xl mx-auto px-4 py-10 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Logo */}
            <div className="flex justify-center order-1">
              <div
                className="relative rounded-3xl p-6 sm:p-8 w-full max-w-xs shadow-[var(--shadow-leaf)]"
                style={{ background: "var(--gradient-leaf)" }}
              >
                <img
                  src={logoHero}
                  alt="Al-Burhan National Grand Quiz Competition 2.0"
                  width={320}
                  height={320}
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-3 text-center text-primary-foreground">
                  <div className="text-[10px] uppercase tracking-[0.3em] opacity-80">
                    Edition 2.0
                  </div>
                  <div className="font-display text-xl font-bold mt-1">Al-Burhan</div>
                  <div className="text-[11px] opacity-80">National Grand Quiz</div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="order-2 space-y-5 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em]">
                Darul Hasanath Islamic College
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                National Grand Quiz on{" "}
                <span className="text-primary">Islamic Civilization & Ihsan</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Organised by the Department of Civilizational Studies with{" "}
                <b className="text-foreground">Book Plus Publishers</b>, Malabar. Compete as a
                team of two. Win a share of ₹6,666.
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: ScrollText, label: "Questions", value: "22" },
                  { icon: Trophy, label: "Marks", value: "100" },
                  { icon: Clock, label: "Duration", value: "30m" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-card border border-border p-3 text-center"
                  >
                    <s.icon className="h-4 w-4 mx-auto text-primary" />
                    <div className="mt-1 text-lg font-bold text-foreground">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/login">
                    Start your exam <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link to="/admin/login">Admin login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground px-4">
        Powered by{" "}
        <a
          href="https://instagram.com/flow.core__"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          Flowcore
        </a>
      </footer>
    </div>
  );
}
