import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useAuth } from "@/lib/auth";
import {
  BookOpen,
  Trophy,
  Calendar,
  ScrollText,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  KeyRound,
  PlayCircle,
  Star,
} from "lucide-react";
import logoHero from "@/assets/logo-hero.png";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      {
        name: "description",
        content:
          "Darul Hasanath Islamic College's National Grand Quiz Competition on Islamic Civilization & Ihsan. Win ₹6,666 in cash prizes.",
      },
      { property: "og:title", content: "Al-Burhan 2.0 — National Grand Quiz Competition" },
      {
        property: "og:description",
        content: "Compete in a national-level quiz on Islamic civilization. Cash prizes of ₹2222, ₹3333, ₹1111.",
      },
    ],
  }),
});

const heroSlides = [
  {
    icon: Trophy,
    eyebrow: "Cash Prize Pool",
    title: "Win a share of ₹6,666",
    desc: "Top three scorers receive ₹2,222, ₹3,333 and ₹1,111 in cash awards.",
  },
  {
    icon: BookOpen,
    eyebrow: "The Syllabus",
    title: "Islamic Civilization & Ihsanul Iman",
    desc: "Two reference books from Book Plus Publishers form the complete syllabus.",
  },
  {
    icon: ScrollText,
    eyebrow: "Exam Format",
    title: "22 Questions · 100 Marks",
    desc: "A balanced mix of MCQ and descriptive questions inside a secure fullscreen window.",
  },
  {
    icon: Calendar,
    eyebrow: "Result Day",
    title: "June 15, 2026",
    desc: "Results announced live. The exam runs with anti-cheat monitoring throughout.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Fair & Secure",
    title: "Monitored Fullscreen Mode",
    desc: "Tab-switch detection, blur tracking and auto-submit keep the contest fair for everyone.",
  },
];

const howSteps = [
  { icon: KeyRound, title: "Get your code", desc: "Receive a unique access code from the organisers." },
  { icon: PlayCircle, title: "Enter & begin", desc: "Sign in with the code. The exam launches in fullscreen." },
  { icon: ScrollText, title: "Answer 22 Qs", desc: "Mix of MCQ and descriptive. Auto-saved as you type." },
  { icon: Trophy, title: "Win prizes", desc: "Top 3 scorers share the ₹6,666 prize pool." },
];

function Landing() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!loading && session && role) {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/participant/dashboard" });
    }
  }, [loading, session, role, navigate]);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSel = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSel);
    return () => { api.off("select", onSel); };
  }, [api]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--gradient-arch)" }}>
      {/* Decorative aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-aurora)" }} />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-leaf)" }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full opacity-25 blur-3xl" style={{ background: "var(--gradient-aurora)" }} />

      <header className="relative max-w-6xl mx-auto px-6 py-5">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          <Brand />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/admin/login">Admin</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Enter code <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 pt-8 pb-20">
        {/* Hero */}
        <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-center">
          {/* Left — Logo card (glass) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="absolute inset-0 -z-10 rounded-[3rem] blur-3xl opacity-50" style={{ background: "var(--gradient-leaf)" }} />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2.5rem] p-8 md:p-12 w-full max-w-md shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-leaf)" }}
            >
              <img src={logoHero} alt="Al-Burhan National Grand Quiz Competition 2.0" className="w-full h-auto object-contain mx-auto drop-shadow-2xl" />
              <div className="mt-6 text-center text-primary-foreground">
                <div className="text-xs uppercase tracking-[0.3em] opacity-80">Edition 2.0</div>
                <div className="font-display text-2xl font-bold mt-1">Al-Burhan</div>
                <div className="text-xs opacity-80 mt-1">National Grand Quiz Competition</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Details + Glass carousel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                <Sparkles className="h-3 w-3" /> Darul Hasanath Islamic College
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
                National Grand Quiz on{" "}
                <span className="bg-gradient-to-r from-primary to-[oklch(0.45_0.13_45)] bg-clip-text text-transparent">
                  Islamic Civilization & Ihsan
                </span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Organised by the Department of Civilizational Studies in association with{" "}
                <b className="text-foreground">Book Plus Publishers</b>, Malabar.
              </p>
            </div>

            {/* Glass auto-slider with arrows + dots */}
            <div className="relative">
              <Carousel
                setApi={setApi}
                opts={{ loop: true, align: "start" }}
                plugins={[Autoplay({ delay: 3800, stopOnInteraction: false })]}
                className="glass-strong rounded-2xl shadow-[var(--shadow-leaf)] overflow-hidden"
              >
                <CarouselContent>
                  {heroSlides.map((s) => (
                    <CarouselItem key={s.title}>
                      <div className="p-6 md:p-7 flex gap-4 items-start min-h-[160px]">
                        <div className="h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg" style={{ background: "var(--gradient-leaf)" }}>
                          <s.icon className="h-7 w-7" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">{s.eyebrow}</div>
                          <h3 className="mt-1 text-xl font-bold text-foreground">{s.title}</h3>
                          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 glass border-none" />
                <CarouselNext className="right-2 glass border-none" />
              </Carousel>

              {/* Dots */}
              <div className="mt-3 flex justify-center gap-1.5">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${selected === i ? "w-6 bg-primary" : "w-1.5 bg-primary/30"}`}
                  />
                ))}
              </div>
            </div>

            {/* Glass stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ScrollText, label: "Questions", value: "22" },
                { icon: Award, label: "Total Marks", value: "100" },
                { icon: Clock, label: "Duration", value: "30 min" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center transition-transform hover:-translate-y-0.5">
                  <stat.icon className="h-4 w-4 mx-auto text-primary" />
                  <div className="mt-1.5 text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="text-base shadow-[var(--shadow-glow)]">
                <Link to="/login">Start your exam <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base glass border-primary/30">
                <Link to="/admin/login">Admin login</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="mt-24">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">How it works</span>
            <h2 className="text-3xl font-bold mt-2">Four simple steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4 relative">
            {howSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 relative overflow-hidden group hover:shadow-[var(--shadow-leaf)] transition-shadow"
              >
                <span className="absolute -right-4 -top-4 text-7xl font-display font-bold text-primary/10 select-none">{i + 1}</span>
                <div className="h-11 w-11 rounded-xl flex items-center justify-center text-primary-foreground shadow-md" style={{ background: "var(--gradient-leaf)" }}>
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prizes */}
        <section className="mt-24">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Cash Prizes</span>
            <h2 className="text-3xl font-bold mt-2">Win a share of ₹6,666</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { rank: "1st Prize", amount: "₹2,222", tone: "from-[oklch(0.78_0.12_75)] to-[oklch(0.6_0.13_55)]", scale: "md:scale-100" },
              { rank: "2nd Prize", amount: "₹3,333", tone: "from-[oklch(0.72_0.1_60)] to-[oklch(0.5_0.11_50)]", scale: "md:scale-105 md:-translate-y-2" },
              { rank: "3rd Prize", amount: "₹1,111", tone: "from-[oklch(0.68_0.09_55)] to-[oklch(0.45_0.1_45)]", scale: "md:scale-100" },
            ].map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className={`rounded-2xl p-8 text-center text-primary-foreground bg-gradient-to-br ${p.tone} shadow-[var(--shadow-glow)] ${p.scale} transition-transform`}
              >
                <Trophy className="h-9 w-9 mx-auto opacity-95" />
                <div className="text-xs uppercase tracking-[0.2em] mt-3 opacity-90">{p.rank}</div>
                <div className="text-4xl font-bold mt-1">{p.amount}</div>
                <div className="mt-3 flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current opacity-80" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Details — glass */}
        <section className="mt-20 grid md:grid-cols-2 gap-5">
          {[
            { icon: ScrollText, title: "22 Questions", desc: "Each question is unique. A balanced mix of MCQ and descriptive questions." },
            { icon: BookOpen, title: "Two Reference Books", desc: '"Islamic Civilization" and "Ehsanul Iman" by Book Plus Publishers form the syllabus.' },
            { icon: Sparkles, title: "100 Marks", desc: "Total marks for the competition. Negative marks may apply for wrong answers." },
            { icon: Users, title: "Open to All", desc: "Students, scholars and enthusiasts across the nation are invited to participate." },
            { icon: Trophy, title: "Top 3 Cash Prizes", desc: "1st: ₹2,222 · 2nd: ₹3,333 · 3rd: ₹1,111 awarded to the highest scorers." },
            { icon: Calendar, title: "June 15, 2026", desc: "Result announcement on June 15. Exam runs in secure fullscreen mode with live monitoring." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="glass rounded-2xl p-6 hover:shadow-[var(--shadow-leaf)] hover:-translate-y-0.5 transition-all flex gap-4"
            >
              <div className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center text-primary-foreground shadow-md" style={{ background: "var(--gradient-leaf)" }}>
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-20 relative rounded-3xl overflow-hidden p-10 text-center" style={{ background: "var(--gradient-leaf)" }}>
          <div aria-hidden className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-aurora)" }} />
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to compete?</h3>
            <p className="text-primary-foreground/85 mt-3 max-w-xl mx-auto">
              Get your access code from the organisers, then sign in to begin your exam.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 shadow-xl">
              <Link to="/login">Enter access code <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border py-6 text-center text-xs text-muted-foreground">
        © Al-Burhan 2.0 · Darul Hasanath Islamic College · Book Plus · Civilization Hasanath
      </footer>
    </div>
  );
}
