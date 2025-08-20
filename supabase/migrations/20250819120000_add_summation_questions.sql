-- Add 'summation' to the question_type ENUM
ALTER TYPE public.question_type ADD VALUE 'summation';

-- Rename 'alternatives' to 'options' for clarity
ALTER TABLE public.questions RENAME COLUMN alternatives TO options;

-- Rename 'correct_answer' to 'correct_answers'
ALTER TABLE public.questions RENAME COLUMN correct_answer TO correct_answers;

-- Change the type of 'correct_answers' to JSONB to store more complex answer data
-- First, add a temporary column to hold the new JSONB data
ALTER TABLE public.questions ADD COLUMN temp_correct_answers JSONB;

-- Convert existing text answers to a simple JSON structure
-- For example, 'A' becomes '{"answer": "A"}'
UPDATE public.questions
SET temp_correct_answers = jsonb_build_object('answer', correct_answers);

-- Drop the old text column
ALTER TABLE public.questions DROP COLUMN correct_answers;

-- Rename the temporary column to the final name
ALTER TABLE public.questions RENAME COLUMN temp_correct_answers TO correct_answers;

-- Add a new column for the correct sum, which will only be used by summation questions
ALTER TABLE public.questions ADD COLUMN correct_sum INTEGER;

-- Make sure the new columns are not null where appropriate
-- For existing multiple choice questions, correct_answers should not be null
UPDATE public.questions
SET correct_answers = '{}'::jsonb
WHERE correct_answers IS NULL;

ALTER TABLE public.questions ALTER COLUMN correct_answers SET NOT NULL;
