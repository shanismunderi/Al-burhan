GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO PUBLIC, anon, authenticated;

-- Grant table-level permissions to authenticated, anon, and service_role.
-- Row-level security (RLS) is still active and will enforce row-level access rules.
GRANT ALL ON public.quizzes TO authenticated, service_role;
GRANT ALL ON public.questions TO authenticated, service_role;
GRANT ALL ON public.profiles TO authenticated, service_role;
GRANT ALL ON public.user_roles TO authenticated, service_role;
GRANT ALL ON public.quiz_attempts TO authenticated, service_role;
GRANT ALL ON public.attempt_answers TO authenticated, service_role;
GRANT ALL ON public.cheat_events TO authenticated, service_role;

GRANT SELECT ON public.quizzes TO anon;
GRANT SELECT ON public.questions TO anon;
GRANT SELECT, INSERT ON public.profiles TO anon;

-- Admin delete policies to allow deletion of candidates
DROP POLICY IF EXISTS "profiles admin delete" ON public.profiles;
CREATE POLICY "profiles admin delete" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "attempts admin delete" ON public.quiz_attempts;
CREATE POLICY "attempts admin delete" ON public.quiz_attempts FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "answers admin delete" ON public.attempt_answers;
CREATE POLICY "answers admin delete" ON public.attempt_answers FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts a
    WHERE a.id = attempt_id AND public.has_role(auth.uid(), 'admin'::app_role)
  )
);

DROP POLICY IF EXISTS "cheat admin delete" ON public.cheat_events;
CREATE POLICY "cheat admin delete" ON public.cheat_events FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));


