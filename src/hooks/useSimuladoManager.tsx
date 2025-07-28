import { useState } from "react";
import { type Question } from "@/data/types";
import { AppView } from "./useAppState";
import { GenerateQuestionsOptions, SimuladoType } from "./useQuestionManager";

interface SimuladoResults {
  answers: (number | null)[];
  timeUsed: number;
  score: number;
}

export const useSimuladoManager = (
  generateQuestions: (options: GenerateQuestionsOptions) => Promise<Question[]>,
  setCurrentView: (view: AppView) => void,
  setSimuladoResults: (results: SimuladoResults | null) => void
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
        // Here you could add logic to get subjects for the user's course
        break;
      case 'por_materia':
        defaultOptions.count = 20;
        break;
      case 'minhas_dificuldades':
        defaultOptions.count = 20;
        // Add logic to get user's weak subjects
        break;
    }

    const simuladoQuestions = await generateQuestions({ ...defaultOptions, ...options });
    setCurrentQuestions(simuladoQuestions);
    setLoadingSimulado(false);
    setCurrentView('simulado');
  };

  const handleSimuladoFinish = (results: SimuladoResults) => {
    setSimuladoResults(results);
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
