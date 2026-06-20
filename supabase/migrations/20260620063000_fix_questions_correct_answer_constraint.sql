-- Drop the legacy check constraint that restricts correct_answer to A, B, C, D
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_correct_answer_check;

-- Re-create the constraint so that:
-- 1. If it's a multiple choice question (mcq), correct_answer must be NULL or one of A, B, C, D.
-- 2. If it's any other question type (one_word, descriptive), correct_answer can be any string.
ALTER TABLE public.questions ADD CONSTRAINT questions_correct_answer_check CHECK (
  (question_type = 'mcq' AND (correct_answer IS NULL OR correct_answer IN ('A','B','C','D'))) OR
  (question_type <> 'mcq')
);
