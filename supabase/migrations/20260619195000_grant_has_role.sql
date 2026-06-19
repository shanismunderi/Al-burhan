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

