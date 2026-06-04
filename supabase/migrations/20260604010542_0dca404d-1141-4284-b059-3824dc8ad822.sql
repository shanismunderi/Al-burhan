
-- 1) Hide questions.correct_answer from participants
DROP POLICY IF EXISTS "questions read" ON public.questions;

CREATE POLICY "questions admin read"
ON public.questions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Safe view for participants (no correct_answer)
CREATE OR REPLACE VIEW public.questions_public
WITH (security_invoker = false) AS
SELECT q.id, q.quiz_id, q.question_type, q.question_text,
       q.option_a, q.option_b, q.option_c, q.option_d,
       q.marks, q.position, q.created_at
FROM public.questions q
WHERE EXISTS (
  SELECT 1 FROM public.quizzes z
  WHERE z.id = q.quiz_id AND z.is_active
);

REVOKE ALL ON public.questions_public FROM PUBLIC, anon;
GRANT SELECT ON public.questions_public TO authenticated;

-- 2) Server-side scoring RPC (uses correct_answer without exposing it)
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
  _attempt_id uuid,
  _answers jsonb,
  _auto boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_attempt public.quiz_attempts%ROWTYPE;
  v_quiz public.quizzes%ROWTYPE;
  v_correct int := 0;
  v_score numeric := 0;
  v_total int := 0;
  rec record;
  v_sel text;
  v_is_correct boolean;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_attempt FROM public.quiz_attempts
  WHERE id = _attempt_id AND user_id = v_user FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Attempt not found';
  END IF;
  IF v_attempt.status <> 'in_progress' THEN
    RETURN v_attempt.id;
  END IF;

  SELECT * INTO v_quiz FROM public.quizzes WHERE id = v_attempt.quiz_id;

  FOR rec IN
    SELECT id, question_type, correct_answer, marks
    FROM public.questions WHERE quiz_id = v_attempt.quiz_id
  LOOP
    v_total := v_total + 1;
    v_sel := _answers ->> rec.id::text;
    IF v_sel IS NULL OR v_sel = '' THEN
      CONTINUE;
    END IF;
    IF rec.question_type = 'mcq' THEN
      v_is_correct := (v_sel = rec.correct_answer);
      IF v_is_correct THEN
        v_correct := v_correct + 1;
        v_score := v_score + COALESCE(rec.marks, 0);
      ELSE
        v_score := v_score - COALESCE(v_quiz.negative_marks, 0);
      END IF;
      INSERT INTO public.attempt_answers(attempt_id, question_id, selected_answer, is_correct)
      VALUES (_attempt_id, rec.id, v_sel, v_is_correct)
      ON CONFLICT (attempt_id, question_id) DO UPDATE
        SET selected_answer = EXCLUDED.selected_answer,
            is_correct = EXCLUDED.is_correct,
            updated_at = now();
    ELSE
      INSERT INTO public.attempt_answers(attempt_id, question_id, selected_answer, is_correct)
      VALUES (_attempt_id, rec.id, v_sel, NULL)
      ON CONFLICT (attempt_id, question_id) DO UPDATE
        SET selected_answer = EXCLUDED.selected_answer,
            updated_at = now();
    END IF;
  END LOOP;

  IF v_score < 0 THEN v_score := 0; END IF;

  UPDATE public.quiz_attempts
  SET status = CASE WHEN _auto THEN 'auto_submitted' ELSE 'submitted' END,
      submitted_at = now(),
      score = v_score,
      correct_count = v_correct,
      total_questions = GREATEST(v_total, v_attempt.total_questions)
  WHERE id = _attempt_id;

  RETURN _attempt_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(uuid, jsonb, boolean) TO authenticated;

-- 3) Realtime channel authorization — restrict to admins by default
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins manage realtime messages" ON realtime.messages;
CREATE POLICY "admins manage realtime messages"
ON realtime.messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
