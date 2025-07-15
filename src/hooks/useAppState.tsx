import { useState } from "react";

export type AppView = 'dashboard' | 'simulado' | 'resultado' | 'redacao' | 'simulados' | 'questoes' | 'desempenho';

export interface SelectedConfig {
  university: string;
  firstChoice: string;
  secondChoice: string;
}

export const useAppState = () => {
  const [selectedConfig, setSelectedConfig] = useState<SelectedConfig>({
    university: "",
    firstChoice: "",
    secondChoice: ""
  });
  
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  
  const [simuladoResults, setSimuladoResults] = useState<{
    answers: (number | null)[];
    timeUsed: number;
    score: number;
  } | null>(null);

  const handleSelectionChange = (config: SelectedConfig) => {
    setSelectedConfig(config);
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setSimuladoResults(null);
  };

  const startRedacao = () => {
    setCurrentView('redacao');
  };

  return {
    selectedConfig,
    currentView,
    simuladoResults,
    handleSelectionChange,
    goHome,
    startRedacao,
    setCurrentView,
    setSimuladoResults
  };
};