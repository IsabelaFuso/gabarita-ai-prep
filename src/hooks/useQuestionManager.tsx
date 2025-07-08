import { useState } from "react";
import { getRandomQuestions, type Question } from "@/data/questionsBank";
import { SelectedConfig } from "./useAppState";

export const useQuestionManager = (selectedConfig: SelectedConfig) => {
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);

  // Gerar questões baseadas na configuração
  const generateQuestions = (count: number = 20, excludeUsed: boolean = true) => {
    const filters: any = {};
    
    if (selectedConfig.university && selectedConfig.university !== 'enem') {
      filters.institution = selectedConfig.university.toUpperCase();
    }
    
    const excludeIds = excludeUsed ? usedQuestionIds : undefined;
    const questions = getRandomQuestions(count, Object.keys(filters).length ? filters : undefined, excludeIds);
    
    // Adicionar os IDs das novas questões à lista de usadas
    if (excludeUsed) {
      const newIds = questions.map(q => q.id);
      setUsedQuestionIds(prev => [...prev, ...newIds]);
    }
    
    return questions;
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