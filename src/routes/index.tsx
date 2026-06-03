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
  { icon: Trophy, eyebrow: "Prize Pool", title: "₹6,666 in cash awards", desc: "₹3,333 · ₹2,222 · ₹1,111 for the top three teams." },
  { icon: BookOpen, eyebrow: "Syllabus", title: "Islamic Civilization & Ihsanul Iman", desc: "Two reference books from Book Plus Publishers." },
  { icon: ScrollText, eyebrow: "Format", title: "22 Questions · 100 Marks", desc: "MCQ + descriptive in a secure fullscreen window." },
  { icon: Calendar, eyebrow: "Result Day", title: "June 15, 2026", desc: "Results announced live with full transparency." },
];

const howSteps = [
  { icon: KeyRound, title: "Get your code", desc: "Receive a team access code from the organisers." },
  { icon: PlayCircle, title: "Sign in", desc: "Enter the code. The exam launches in fullscreen." },
  { icon: ScrollText, title: "Answer 22 Qs", desc: "MCQ + descriptive. Auto-saved as you type." },
  { icon: Trophy, title: "Win prizes", desc: "Top 3 teams share the ₹6,666 prize pool." },
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
    <div className="min-h-screen bg-background">
      {/* Soft single gradient backdrop — clean, no clutter */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[520px] -z-10 opacity-60" style={{ background: "var(--gradient-soft)" }} />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/admin/login">Admin</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/login">Enter code <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-16">
        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-1 flex justify-center"
          >
            <div className="relative rounded-3xl p-6 sm:p-10 w-full max-w-sm shadow-[var(--shadow-leaf)]" style={{ background: "var(--gradient-leaf)" }}>
              <img src={logoHero} alt="Al-Burhan National Grand Quiz Competition 2.0" className="w-full h-auto object-contain" />
              <div className="mt-4 text-center text-primary-foreground">
                <div className="text-[10px] uppercase tracking-[0.3em] opacity-80">Edition 2.0</div>
                <div className="font-display text-xl sm:text-2xl font-bold mt-1">Al-Burhan</div>
                <div className="text-[11px] opacity-80">National Grand Quiz Competition</div>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 lg:order-2 space-y-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3" /> Darul Hasanath Islamic College
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              National Grand Quiz on{" "}
              <span className="text-primary">Islamic Civilization & Ihsan</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Organised by the Department of Civilizational Studies in association with{" "}
              <b className="text-foreground">Book Plus Publishers</b>, Malabar. Compete as a team of two.
            </p>

            {/* Slider */}
            <div>
              <Carousel
                setApi={setApi}
                opts={{ loop: true, align: "start" }}
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
                className="rounded-2xl bg-card border border-border overflow-hidden"
              >
                <CarouselContent>
                  {heroSlides.map((s) => (
                    <CarouselItem key={s.title}>
                      <div className="p-5 sm:p-6 flex gap-4 items-start min-h-[140px]">
                        <div className="h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-leaf)" }}>
                          <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">{s.eyebrow}</div>
                          <h3 className="mt-1 text-base sm:text-lg font-bold text-foreground">{s.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="mt-3 flex justify-center gap-1.5">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${selected === i ? "w-6 bg-primary" : "w-1.5 bg-primary/25"}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: ScrollText, label: "Questions", value: "22" },
                { icon: Award, label: "Marks", value: "100" },
                { icon: Clock, label: "Duration", value: "30m" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-card border border-border p-3 sm:p-4 text-center">
                  <stat.icon className="h-4 w-4 mx-auto text-primary" />
                  <div className="mt-1 text-lg sm:text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/login">Start your exam <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/admin/login">Admin login</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="mt-16 sm:mt-24">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] uppercase tracking-widest text-primary font-semibold">How it works</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Four simple steps</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {howSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-card border border-border p-4 sm:p-5"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-leaf)" }}>
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-widest text-primary/70 font-semibold">Step {i + 1}</div>
                <h3 className="mt-0.5 font-semibold text-sm sm:text-base">{step.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prizes */}
        <section className="mt-16 sm:mt-24">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-[11px] uppercase tracking-widest text-primary font-semibold">Cash Prizes</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Win a share of ₹6,666</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { rank: "2nd Prize", amount: "₹2,222", order: "sm:order-1" },
              { rank: "1st Prize", amount: "₹3,333", order: "sm:order-2 sm:scale-105" },
              { rank: "3rd Prize", amount: "₹1,111", order: "sm:order-3" },
            ].map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.06 }}
                className={`rounded-2xl p-6 sm:p-7 text-center text-primary-foreground shadow-[var(--shadow-leaf)] ${p.order} transition-transform`}
                style={{ background: "var(--gradient-leaf)" }}
              >
                <Trophy className="h-7 w-7 mx-auto opacity-95" />
                <div className="text-[10px] uppercase tracking-[0.2em] mt-3 opacity-90">{p.rank}</div>
                <div className="text-3xl sm:text-4xl font-bold mt-1">{p.amount}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Details */}
        <section className="mt-16 sm:mt-20 grid sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: ScrollText, title: "22 Questions", desc: "Balanced mix of MCQ and descriptive questions." },
            { icon: BookOpen, title: "Two Reference Books", desc: '"Islamic Civilization" and "Ehsanul Iman" form the syllabus.' },
            { icon: Sparkles, title: "100 Marks", desc: "Total marks. Negative marks may apply." },
            { icon: Users, title: "Team of Two", desc: "Each account hosts a team of two members." },
            { icon: ShieldCheck, title: "Secure & Fair", desc: "Tab-switch detection, blur tracking, auto-submit." },
            { icon: Calendar, title: "June 15, 2026", desc: "Results announced live on result day." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 + i * 0.04 }}
              className="rounded-2xl bg-card border border-border p-4 sm:p-5 flex gap-3 sm:gap-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-leaf)" }}>
                <f.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{f.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-16 sm:mt-20 relative rounded-3xl overflow-hidden p-8 sm:p-10 text-center" style={{ background: "var(--gradient-leaf)" }}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">Ready to compete?</h3>
          <p className="text-primary-foreground/85 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Get your team access code from the organisers, then sign in to begin.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/login">Enter access code <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground px-4">
        © Al-Burhan 2.0 · Darul Hasanath Islamic College · Book Plus
      </footer>
    </div>
  );
}
