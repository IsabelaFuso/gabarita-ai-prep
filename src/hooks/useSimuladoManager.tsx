import { useState } from "react";
import { type Question } from "@/data/types";
import { AppView } from "./useAppState";
import { GenerateQuestionsOptions, SimuladoType } from "./useQuestionManager";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface SimuladoResults {
  answers: (number | null)[];
  timeUsed: number;
  score: number;
}

export const useSimuladoManager = (
  generateQuestions: (options: GenerateQuestionsOptions) => Promise<Question[]>,
  setCurrentView: (view: AppView) => void,
  setSimuladoResults: (results: SimuladoResults | null) => void,
  user: any
) => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [loadingSimulado, setLoadingSimulado] = useState(false);
  const [currentSimuladoType, setCurrentSimuladoType] = useState<SimuladoType | null>(null);

  const startSimulado = async (type: SimuladoType, options?: Partial<GenerateQuestionsOptions>) => {
    setLoadingSimulado(true);
    setCurrentQuestions([]);
    setCurrentSimuladoType(type);

    const defaultOptions: GenerateQuestionsOptions = {
      type: type,
      count: 0,
      excludeUsed: true,
      prioritizeWeaknesses: false,
    };

    switch (type) {
      case 'completo':
        defaultOptions.count = 90;
        break;
      case 'rapido':
        defaultOptions.count = 30;
        break;
      case 'foco_curso':
        defaultOptions.count = 45;
        if (user) {
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('target_subjects')
            .eq('user_id', user.id)
            .single();
          
          if (profile && profile.target_subjects) {
            const { data: subjects, error: subjectsError } = await supabase
              .from('subjects')
              .select('name')
              .in('id', profile.target_subjects);

            if (subjects) {
              defaultOptions.subjects = subjects.map(s => s.name);
            }
          }
        }
        break;
      case 'por_materia':
        defaultOptions.count = 20;
        // This would require a UI to select subjects, passing them in options
        break;
      case 'minhas_dificuldades':
        defaultOptions.count = 20;
        defaultOptions.prioritizeWeaknesses = true;
        break;
    }

    const simuladoQuestions = await generateQuestions({ ...defaultOptions, ...options });
    setCurrentQuestions(simuladoQuestions);
    setLoadingSimulado(false);
    setCurrentView('simulado');
  };

  const handleSimuladoFinish = async (results: SimuladoResults) => {
    setSimuladoResults(results);

    if (user && currentSimuladoType && currentQuestions.length > 0) {
      // 1. Calculate score and time
      const timeIncrease = Math.round(results.timeUsed);
      const scoreIncrease = results.answers.reduce((acc, answer, index) => {
        if (answer === null) return acc; // Skip unanswered
        return acc + (answer === currentQuestions[index].correctAnswer ? 10 : -2);
      }, 0);

      // 2. Update stats in user_profiles
      await supabase.rpc('update_user_stats', {
        p_user_id: user.id,
        p_time_increase: timeIncrease,
        p_score_increase: scoreIncrease,
      });

      // 3. Save individual attempts
      const attemptsToInsert = results.answers.map((answer, index) => {
        const question = currentQuestions[index];
        return {
          user_id: user.id,
          question_id: question.id,
          user_answer: answer !== null ? question.alternatives[answer] : null,
          is_correct: answer === question.correctAnswer,
          context: `simulado_${currentSimuladoType}`,
        };
      }).filter(attempt => attempt.user_answer !== null);

      if (attemptsToInsert.length > 0) {
        await supabase.from('user_attempts').insert(attemptsToInsert);
      }

      // 4. Save the simulado summary
      const institutionName = currentQuestions[0].institution;
      const { data: institution } = await supabase
        .from('institutions')
        .select('id')
        .eq('name', institutionName)
        .single();

      await supabase.from('simulados').insert({
        user_id: user.id,
        title: `Simulado ${currentSimuladoType.replace('_', ' ')}`,
        institution_id: institution?.id,
        total_questions: currentQuestions.length,
        status: 'finalizado',
      });
    }

    setCurrentView('resultado');
  };

  const handleSimuladoExit = () => {
    setCurrentView('dashboard');
  };

  const restartSimulado = async () => {
    if (!currentSimuladoType) return;
    setLoadingSimulado(true);
    setSimuladoResults(null);
    setCurrentQuestions([]);
    await startSimulado(currentSimuladoType);
    setLoadingSimulado(false);
  };

  return {
    currentQuestions,
    loadingSimulado,
    startSimulado,
    handleSimuladoFinish,
    handleSimuladoExit,
    restartSimulado,
  };
};

