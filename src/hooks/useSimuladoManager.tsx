import { useState } from "react";
import { type Question } from "@/data/questionsBank";
import { AppView } from "./useAppState";

interface SimuladoResults {
  answers: (number | null)[];
  timeUsed: number;
  score: number;
}

export const useSimuladoManager = (
  generateQuestions: (count?: number, excludeUsed?: boolean) => Promise<Question[]>,
  setCurrentView: (view: AppView) => void,
  setSimuladoResults: (results: SimuladoResults | null) => void
) => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [loadingSimulado, setLoadingSimulado] = useState(false);

  const startSimulado = async () => {
    setLoadingSimulado(true);
    setCurrentQuestions([]); // Clear previous questions
    const simuladoQuestions = await generateQuestions(25);
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
    setLoadingSimulado(true);
    setSimuladoResults(null);
    setCurrentQuestions([]); // Clear previous questions
    const newQuestions = await generateQuestions(25);
    setCurrentQuestions(newQuestions);
    setLoadingSimulado(false);
    setCurrentView('simulado');
  };

  return {
    currentQuestions,
    loadingSimulado,
    startSimulado,
    handleSimuladoFinish,
    handleSimuladoExit,
    restartSimulado
  };
};