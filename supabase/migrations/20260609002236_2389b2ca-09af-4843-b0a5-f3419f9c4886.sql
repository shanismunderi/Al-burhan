REVOKE SELECT ON public.questions FROM authenticated;
REVOKE SELECT ON public.questions FROM anon;
GRANT SELECT (id, quiz_id, question_text, question_type, option_a, option_b, option_c, option_d, marks, position, created_at) ON public.questions TO authenticated;