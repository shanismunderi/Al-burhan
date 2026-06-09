import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

type Member = { name: string; role?: string; photo?: string };
type Team = {
  id: string;
  teamName: string;
  institution: string;
  location: string;
  members: [Member, Member];
};

// Edit this list to update the finalists shown on the landing page.
const FINALISTS: Team[] = [
  {
    id: "t1",
    teamName: "Team Al-Furqan",
    institution: "Darul Hasanath Islamic College",
    location: "Malappuram, Kerala",
    members: [
      { name: "Muhammad Ashiq", role: "Captain" },
      { name: "Abdul Rahman", role: "Member" },
    ],
  },
  {
    id: "t2",
    teamName: "Team Ihsan",
    institution: "Markaz Knowledge City",
    location: "Kozhikode, Kerala",
    members: [
      { name: "Hamza Iqbal", role: "Captain" },
      { name: "Yusuf Salim", role: "Member" },
    ],
  },
  {
    id: "t3",
    teamName: "Team Burhan",
    institution: "Jamia Nadwiyya",
    location: "Edavanna, Kerala",
    members: [
      { name: "Bilal Ahmed", role: "Captain" },
      { name: "Saif Anwar", role: "Member" },
    ],
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberAvatar({ m }: { m: Member }) {
  if (m.photo) {
    return (
      <img
        src={m.photo}
        alt={m.name}
        className="h-20 w-20 rounded-full object-cover border-4 border-card shadow-md"
      />
    );
  }
  return (
    <div
      className="h-20 w-20 rounded-full border-4 border-card shadow-md flex items-center justify-center text-primary-foreground font-bold text-xl"
      style={{ background: "var(--gradient-leaf)" }}
      aria-label={m.name}
    >
      {initials(m.name)}
    </div>
  );
}

export function Finalists() {
  return (
    <section
      id="finalists"
      className="w-full border-t border-border/60"
      style={{ background: "var(--gradient-soft, hsl(var(--muted)))" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em]">
            <Sparkles className="h-3.5 w-3.5" />
            Final round
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Selected Teams for the Grand Finale
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Congratulations to the qualifying teams advancing to the Al-Burhan 2.0 final round.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FINALISTS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-2xl bg-card border border-border p-5 shadow-sm hover:shadow-[var(--shadow-leaf)] transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary font-semibold">
                  <Trophy className="h-3.5 w-3.5" /> Finalist
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-foreground">{t.teamName}</h3>
              <p className="text-xs text-muted-foreground">
                {t.institution} • {t.location}
              </p>

              {/* Collage of two members */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="flex flex-col items-center -mr-3 rotate-[-4deg]">
                  <MemberAvatar m={t.members[0]} />
                </div>
                <div className="flex flex-col items-center rotate-[4deg]">
                  <MemberAvatar m={t.members[1]} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                {t.members.map((m, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 px-2 py-2">
                    <div className="text-xs font-semibold text-foreground truncate">{m.name}</div>
                    {m.role && (
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.role}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
