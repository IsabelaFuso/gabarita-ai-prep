import { useState, useCallback } from "react";
import { type Question } from "@/data/types";
import { AppView } from "./useAppState";
import { GenerateQuestionsOptions, SimuladoType } from "./useQuestionManager";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface SimuladoResults {
  answers: (number | null)[];
  timeUsed: number;
  score: number;
}

export const useSimuladoManager = (
  generateQuestions: (options: GenerateQuestionsOptions) => Promise<Question[]>,
  setCurrentView: (view: AppView) => void,
  setSimuladoResults: (results: SimuladoResults | null) => void,
  user: User | null
) => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [loadingSimulado, setLoadingSimulado] = useState(false);
  const [currentSimuladoType, setCurrentSimuladoType] = useState<SimuladoType | null>(null);

  const startSimulado = useCallback(async (type: SimuladoType) => {
    setLoadingSimulado(true);
    setCurrentSimuladoType(type);
    try {
      const options: GenerateQuestionsOptions = {
        type: type,
        count: type === 'rapido' ? 10 : 50,
      };
      const questions = await generateQuestions(options);
      setCurrentQuestions(questions);
      setCurrentView('simulado');
    } catch (error) {
      console.error("Error starting simulado:", error);
      toast.error("Não foi possível carregar o simulado. Tente novamente.");
      setCurrentView('dashboard');
    } finally {
      setLoadingSimulado(false);
    }
  }, [generateQuestions, setCurrentView]);

  const handleSimuladoFinish = async (results: SimuladoResults) => {
    setSimuladoResults(results);

    if (user && currentSimuladoType && currentQuestions.length > 0) {
      const totalQuestions = currentQuestions.length;
      const correctAnswers = results.score;
      const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;

      const timeIncrease = Math.round(results.timeUsed);
      const xpIncrease = results.answers.reduce((acc, answer, index) => {
        if (answer === null) return acc;
        return acc + (answer === currentQuestions[index].correctAnswer ? 10 : -2);
      }, 0);

      await supabase.rpc('update_user_stats', {
        p_user_id: user.id,
        p_time_increase: timeIncrease,
        p_xp_increase: xpIncrease,
      });

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

      const institutionName = currentQuestions[0].institution;
      const { data: institution } = await supabase
        .from('institutions')
        .select('id')
        .eq('name', institutionName || '')
        .single();

      await supabase.from('simulados').insert({
        user_id: user.id,
        title: `Simulado ${currentSimuladoType.replace('_', ' ')}`,
        institution_id: institution?.id,
        total_questions: totalQuestions,
        status: 'finalizado',
      });

      const { data: newAchievements, error: achievementsError } = await supabase
        .rpc('check_and_grant_achievements', {
          p_user_id: user.id,
          p_simulado_accuracy: accuracy,
          p_simulado_question_count: totalQuestions,
        });
      
      if (achievementsError) {
        console.error("Error checking achievements:", achievementsError);
      } else if (newAchievements) {
        (newAchievements as any[]).forEach((ach: any) => {
          toast.success("Nova Conquista Desbloqueada!", {
            description: ach.name,
          });
        });
      }
    }

    setCurrentView('resultado');
  };

  const handleSimuladoExit = () => {
    setCurrentQuestions([]);
    setCurrentView('dashboard');
  };

  const restartSimulado = () => {
    if (currentSimuladoType) {
      startSimulado(currentSimuladoType);
    }
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