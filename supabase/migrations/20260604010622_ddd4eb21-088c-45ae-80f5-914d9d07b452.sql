
-- Drop the security-definer view approach
DROP VIEW IF EXISTS public.questions_public;

-- Restore the original participant-readable policy on questions (active quizzes)
DROP POLICY IF EXISTS "questions admin read" ON public.questions;
CREATE POLICY "questions read"
ON public.questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes q
    WHERE q.id = questions.quiz_id
      AND (q.is_active OR public.has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Column-level: hide correct_answer from PostgREST entirely
REVOKE SELECT (correct_answer) ON public.questions FROM authenticated, anon;

-- Admin RPC to fetch full question rows (including correct_answer)
CREATE OR REPLACE FUNCTION public.admin_get_questions(_quiz_id uuid)
RETURNS SETOF public.questions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY SELECT * FROM public.questions
  WHERE quiz_id = _quiz_id ORDER BY position;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_get_questions(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_get_questions(uuid) TO authenticated;
