import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Question } from "@/data/types"; // Import the Question type
import { SelectedConfig } from "./useAppState";

export const useQuestionManager = (selectedConfig: SelectedConfig) => {
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]); // IDs are now strings (UUIDs)

  // Gerar questões baseadas na configuração
  const generateQuestions = async (count: number = 20, excludeUsed: boolean = true): Promise<Question[]> => {
    let query = supabase
      .from('questions')
      .select(`
        id,
        year,
        statement,
        image_url,
        alternatives,
        correct_answer,
        explanation,
        institutions (name),
        subjects (name),
        topics (name)
      `);

    // Apply filters
    if (selectedConfig.university && selectedConfig.university !== 'enem') {
      query = query.eq('institutions.name', selectedConfig.university.toUpperCase());
    }
    // Add more filters if needed, e.g., subject, topic, year
    // Example: if (selectedConfig.subject) { query = query.eq('subjects.name', selectedConfig.subject); }

    if (excludeUsed && usedQuestionIds.length > 0) {
      query = query.not('id', 'in', `(${usedQuestionIds.join(',')})`);
    }

    // Order randomly and limit
    query = query.order('id', { ascending: true }).limit(count); // Supabase doesn't have direct RANDOM() in select, so order by ID and limit for a pseudo-random set

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching questions from Supabase:", error);
      return [];
    }

    const fetchedQuestions: Question[] = data.map((q: any) => {
      const alternatives: string[] = q.alternatives; // Already an array of strings from JSONB
      const correctAnswerText: string = q.correct_answer;
      const correctAnswerIndex = alternatives.indexOf(correctAnswerText);

      return {
        id: q.id,
        institution: q.institutions?.name || 'N/A',
        year: q.year,
        subject: q.subjects?.name || 'N/A',
        topic: q.topics?.name || 'N/A',
        statement: q.statement,
        image: q.image_url || undefined,
        alternatives: alternatives,
        correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 0, // Fallback to 0 if not found
        explanation: q.explanation,
      };
    });
    
    // Update usedQuestionIds
    if (excludeUsed) {
      const newIds = fetchedQuestions.map(q => q.id);
      setUsedQuestionIds(prev => [...prev, ...newIds]);
    }

    return fetchedQuestions;
  };

  // Resetar questões usadas
  const resetUsedQuestions = () => {
    setUsedQuestionIds([]);
  };

  return {
    usedQuestionIds,
    generateQuestions,
    resetUsedQuestions
  };
};