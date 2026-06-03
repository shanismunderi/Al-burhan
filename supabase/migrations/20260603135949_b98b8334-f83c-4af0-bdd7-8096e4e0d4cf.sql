ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS member1_name text,
  ADD COLUMN IF NOT EXISTS member2_name text;