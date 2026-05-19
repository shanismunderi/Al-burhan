import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { BookOpen, Trophy, Calendar, ScrollText, Sparkles, Users } from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      { name: "description", content: "Darul Hasanath Islamic College's National Grand Quiz Competition on Islamic Civilization & Ihsan." },
      { property: "og:title", content: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      { property: "og:description", content: "Compete in a national-level quiz on Islamic civilization. Cash prizes of ₹2222, ₹3333, ₹1111." },
    ],
  }),
});

function Landing() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-arch)" }}>
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost"><Link to="/admin/login">Admin</Link></Button>
          <Button asChild><Link to="/login">Enter code</Link></Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-6 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <motion.img
            src={logoHero}
            alt="Al-Burhan National Grand Quiz Competition 2.0"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mx-auto w-full max-w-md drop-shadow-[0_20px_40px_oklch(0.4_0.12_55_/_0.25)]"
          />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Darul Hasanath Islamic College
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            National Grand Quiz on<br />
            <span className="text-primary">Islamic Civilization & Ihsan</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Organized by the Department of Civilizational Studies, Darul Hasanath Islamic College,
            in association with <b className="text-foreground">Book Plus</b> Publishers, Malabar.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="text-base"><Link to="/login">Start your exam</Link></Button>
            <Button asChild size="lg" variant="outline" className="text-base"><Link to="/admin/login">Admin login</Link></Button>
          </div>
        </motion.div>

        {/* Prizes */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Cash Prizes</span>
            <h2 className="text-3xl font-bold mt-2">Win a share of ₹6,666</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { rank: "1st Prize", amount: "₹2,222", tone: "from-[oklch(0.78_0.12_75)] to-[oklch(0.6_0.13_55)]" },
              { rank: "2nd Prize", amount: "₹3,333", tone: "from-[oklch(0.72_0.1_60)] to-[oklch(0.5_0.11_50)]" },
              { rank: "3rd Prize", amount: "₹1,111", tone: "from-[oklch(0.68_0.09_55)] to-[oklch(0.45_0.1_45)]" },
            ].map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`rounded-2xl p-8 text-center text-primary-foreground bg-gradient-to-br ${p.tone} shadow-[var(--shadow-leaf)]`}
              >
                <Trophy className="h-8 w-8 mx-auto opacity-90" />
                <div className="text-xs uppercase tracking-[0.2em] mt-3 opacity-90">{p.rank}</div>
                <div className="text-4xl font-bold mt-1">{p.amount}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-20 grid md:grid-cols-2 gap-5">
          {[
            { icon: ScrollText, title: "22 Questions", desc: "Each question is unique. The quiz contains a balanced mix of MCQ and descriptive questions." },
            { icon: BookOpen, title: "Two Reference Books", desc: '"Islamic Civilization" and "Ehsanul Iman" by Book Plus Publishers form the syllabus.' },
            { icon: Sparkles, title: "100 Marks", desc: "Total marks for the competition. Negative marks may apply for wrong answers." },
            { icon: Users, title: "Open to All", desc: "Students, scholars, and enthusiasts across the nation are invited to participate." },
            { icon: Trophy, title: "Top 3 Cash Prizes", desc: "1st: ₹2,222 · 2nd: ₹3,333 · 3rd: ₹1,111 awarded to the highest scorers." },
            { icon: Calendar, title: "June 15, 2026", desc: "Result announcement on June 15. The exam runs in secure fullscreen mode with live monitoring." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="rounded-2xl bg-card border border-border p-6 hover:shadow-[var(--shadow-leaf)] transition-shadow flex gap-4"
            >
              <div className="h-11 w-11 shrink-0 rounded-xl bg-accent/60 flex items-center justify-center text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-3xl p-10 text-center" style={{ background: "var(--gradient-leaf)" }}>
          <h3 className="text-3xl font-bold text-primary-foreground">Ready to compete?</h3>
          <p className="text-primary-foreground/85 mt-3 max-w-xl mx-auto">
            Get your access code from the organizers, then sign in to begin your exam.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/login">Enter access code</Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © Al-Burhan 2.0 · Darul Hasanath Islamic College · Book Plus · Civilization Hasanath
      </footer>
    </div>
  );
}
