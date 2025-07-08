import { useState } from "react";
import { type Question } from "@/data/questionsBank";
import { AppView } from "./useAppState";

interface SimuladoResults {
  answers: (number | null)[];
  timeUsed: number;
  score: number;
}

export const useSimuladoManager = (
  generateQuestions: (count?: number, excludeUsed?: boolean) => Question[],
  setCurrentView: (view: AppView) => void,
  setSimuladoResults: (results: SimuladoResults | null) => void
) => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  const startSimulado = () => {
    const simuladoQuestions = generateQuestions(25);
    setCurrentQuestions(simuladoQuestions);
    setCurrentView('simulado');
  };

  const handleSimuladoFinish = (results: SimuladoResults) => {
    setSimuladoResults(results);
    setCurrentView('resultado');
  };

  const handleSimuladoExit = () => {
    setCurrentView('dashboard');
  };

  const restartSimulado = () => {
    setSimuladoResults(null);
    const newQuestions = generateQuestions(25);
    setCurrentQuestions(newQuestions);
    setCurrentView('simulado');
  };

  return {
    currentQuestions,
    startSimulado,
    handleSimuladoFinish,
    handleSimuladoExit,
    restartSimulado
  };
};