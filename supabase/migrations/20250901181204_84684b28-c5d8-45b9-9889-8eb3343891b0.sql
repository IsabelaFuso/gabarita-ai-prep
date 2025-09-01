-- Create storage bucket for PDF question sources
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('question-pdfs', 'question-pdfs', false, 52428800, ARRAY['application/pdf']);

-- Create policies for admin PDF access
CREATE POLICY "Admins can view PDF files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'question-pdfs' AND auth.jwt() ->> 'email' = 'prof.rafaelfuso@gmail.com');

CREATE POLICY "Admins can upload PDF files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'question-pdfs' AND auth.jwt() ->> 'email' = 'prof.rafaelfuso@gmail.com');

CREATE POLICY "Admins can update PDF files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'question-pdfs' AND auth.jwt() ->> 'email' = 'prof.rafaelfuso@gmail.com');

CREATE POLICY "Admins can delete PDF files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'question-pdfs' AND auth.jwt() ->> 'email' = 'prof.rafaelfuso@gmail.com');

-- Create table to track PDF metadata
CREATE TABLE public.pdf_question_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  file_size BIGINT,
  description TEXT,
  institution_name TEXT,
  exam_year INTEGER,
  processed BOOLEAN NOT NULL DEFAULT false,
  questions_extracted INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.pdf_question_sources ENABLE ROW LEVEL SECURITY;

-- Create policies for PDF metadata
CREATE POLICY "Admins can manage PDF metadata" 
ON public.pdf_question_sources 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'prof.rafaelfuso@gmail.com');