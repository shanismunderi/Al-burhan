# Quiz Exam Platform — Build Plan

A portfolio-grade online quiz system with anti-cheating, realtime admin monitoring, and a light green theme.

## Stack

- TanStack Start (React 19) + Tailwind v4 + shadcn/ui + Framer Motion
- Lovable Cloud (Supabase) — Postgres, Auth, Realtime, RLS
- Admin login: `admin@burhan` / `burhan@540` (seeded on first run)

## Theme

Light green palette (semantic tokens in `src/styles.css`, oklch):

- background: soft mint white
- primary: vibrant leaf green
- accent: pale green
- destructive: warm coral (for warnings)
- Typography: Space Grotesk (headings) + Inter (body)
- Subtle motion via Framer Motion

## Pages / Routes

```
/                              → Landing (login choices)
/login                         → Participant login
/admin/login                   → Admin login
/_authenticated/participant/dashboard
/_authenticated/participant/quiz/$quizId
/_authenticated/participant/result/$submissionId
/_authenticated/admin/dashboard       → Live monitoring
/_authenticated/admin/quizzes         → Create/edit quizzes
/_authenticated/admin/questions/$quizId
/_authenticated/admin/participants    → Create participant accounts
/_authenticated/admin/results
```

## Database (Lovable Cloud)

- `profiles` (id, username, display_name)
- `user_roles` (user_id, role: admin|participant) — separate table, `has_role()` security definer
- `quizzes` (id, title, instructions, duration_minutes, total_marks, negative_marks, is_active, randomize)
- `questions` (id, quiz_id, question_text, options jsonb, correct_answer, marks, type)
- `quiz_attempts` (id, user_id, quiz_id, started_at, ends_at, submitted_at, status, warnings, score)
- `attempt_answers` (id, attempt_id, question_id, selected_answer, is_correct)
- `cheat_events` (id, attempt_id, user_id, event_type, occurred_at) — feeds realtime admin feed

RLS: participants see only own attempts/answers; admins see all via `has_role(auth.uid(),'admin')`.

## Phases (built in order, single delivery)

**Phase 1 — Foundation**

- Enable Lovable Cloud, design tokens, layout shell, auth helpers, role system, seed admin user.

**Phase 2 — Admin**

- Admin dashboard, quiz CRUD, question CRUD (MCQ + True/False), participant account creation (admin creates email/password pairs).

**Phase 3 — Participant Quiz Flow**

- Dashboard listing assigned quizzes, instructions screen, fullscreen entry, question navigator, auto-save answers, server-synced countdown timer, auto-submit on timeout.

**Phase 4 — Anti-Cheat**

- Detect: tab switch (`visibilitychange`), blur, fullscreen exit, back button (`popstate`), refresh (`beforeunload`).
- 3-warning escalation → auto-submit. Each event written to `cheat_events`.

**Phase 5 — Realtime Monitoring**

- Admin dashboard subscribes to `cheat_events` + `quiz_attempts` via Supabase Realtime. Live table: participant, status, warnings, time remaining, submitted/active.

**results only see in admin dashboard** 

## Notes

- "Admin creates accounts" — implemented as admin creating Supabase auth users with email/password (using `username@burhan.local` as synthetic email so participants log in by username).
- Cannot truly block Alt+Tab / second device — system detects + warns + logs, as described.
- Will ship a focused first version covering Phases 1–6; advanced features (proctoring, certificates) left as follow-up.