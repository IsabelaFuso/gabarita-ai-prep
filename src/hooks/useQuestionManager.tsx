
import { useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { Question } from "@/data/types";
import { SelectedConfig } from "./useAppState";

export type SimuladoType = 'diagnóstico' | 'completo' | 'rapido' | 'foco_curso' | 'por_materia' | 'minhas_dificuldades' | 'questoes_comentadas';

export interface GenerateQuestionsOptions {
  type: SimuladoType;
  count: number;
  subjects?: string[];
  difficulty?: ('facil' | 'medio' | 'dificil')[];
  excludeUsed?: boolean;
  prioritizeWeaknesses?: boolean;
}

export const useQuestionManager = (selectedConfig: SelectedConfig, user: any) => {
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);

  const generateQuestions = async (options: GenerateQuestionsOptions): Promise<Question[]> => {
    const { type, count, subjects, difficulty, excludeUsed = true, prioritizeWeaknesses = false } = options;

    const rpcParams = {
      p_user_id: user.id,
      p_university_name: selectedConfig.university.toUpperCase(),
      p_question_count: count,
      p_subject_names: subjects,
      p_difficulty_levels: difficulty,
      p_exclude_ids: excludeUsed ? usedQuestionIds : null,
      p_prioritize_weaknesses: prioritizeWeaknesses,
    };

    const { data, error } = await supabase.rpc('get_custom_simulado_questions', rpcParams);

    if (error) {
      console.error(`Error fetching questions for ${type} simulado:`, error);
      return [];
    }

    const fetchedQuestions: Question[] = data.map((q: any) => {
      const alternatives: string[] = q.alternatives;
      const correctAnswerText: string = q.correct_answer;
      const correctAnswerIndex = alternatives.indexOf(correctAnswerText);

      return {
        id: q.question_id,
        institution: q.institution_name || 'N/A',
        year: q.year,
        subject: q.subject_name || 'N/A',
        topic: q.topic_name || 'N/A',
        statement: q.statement,
        image: q.image_url || undefined,
        alternatives: alternatives,
        correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 0,
        explanation: q.explanation,
      };
    });

    if (excludeUsed) {
      const newIds = fetchedQuestions.map(q => q.id);
      setUsedQuestionIds(prev => [...new Set([...prev, ...newIds])]);
    }

    return fetchedQuestions;
  };

  const resetUsedQuestions = () => {
    setUsedQuestionIds([]);
  };

  return {
    usedQuestionIds,
    generateQuestions,
    resetUsedQuestions,
  };
};
