
-- 1. Access code on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS access_code text UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_access_code ON public.profiles(access_code);

-- Allow anyone (anon) to look up a profile by access_code via RPC only (we'll use security definer fn)
-- 2. Questions: type + nullable options
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'mcq';
ALTER TABLE public.questions ALTER COLUMN option_a DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN option_b DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN option_c DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN option_d DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN correct_answer DROP NOT NULL;

-- 3. attempt_answers: manual score for descriptive
ALTER TABLE public.attempt_answers ADD COLUMN IF NOT EXISTS manual_score numeric;

-- 4. Security definer function: resolve access code -> synthetic email
CREATE OR REPLACE FUNCTION public.email_for_access_code(_code text)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'code-' || lower(p.access_code) || '@quiz.local'
  FROM public.profiles p
  WHERE lower(p.access_code) = lower(_code)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.email_for_access_code(text) TO anon, authenticated;
