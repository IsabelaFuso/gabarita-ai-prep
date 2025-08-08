import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export type AppView = 'dashboard' | 'simulado' | 'resultado' | 'redacao' | 'simulados' | 'questoes' | 'desempenho' | 'tutor' | 'banco-questoes' | 'account' | 'simulado_details';

export interface SelectedConfig {
  university: string;
  firstChoice: string;
  secondChoice: string;
}

export const useAppState = () => {
  const { user } = useAuth();
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

  const [selectedSimuladoId, setSelectedSimuladoId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);

  // Fetch user's saved config on initial load
  useEffect(() => {
    const fetchUserConfig = async () => {
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          first_choice_course,
          second_choice_course,
          institution:target_institution_id ( name )
        `)
        .eq('user_id', user.id)
        .single();

      if (profile && profile.institution) {
        setSelectedConfig({
          university: profile.institution.name,
          firstChoice: profile.first_choice_course || "",
          secondChoice: profile.second_choice_course || "",
        });
      }
    };

    fetchUserConfig();
  }, [user]);

  const handleSelectionChange = async (config: SelectedConfig) => {
    setSelectedConfig(config);

    if (!user) return;

    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('name', config.university.toUpperCase())
      .single();

    if (!institution) return;

    await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        target_institution_id: institution.id,
        first_choice_course: config.firstChoice,
        second_choice_course: config.secondChoice,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setSimuladoResults(null);
    setSelectedSimuladoId(null);
  };

  const viewSimuladoDetails = (simuladoId: string) => {
    setSelectedSimuladoId(simuladoId);
    setCurrentView('simulado_details');
  };

  const startRedacao = () => {
    setCurrentView('redacao');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const triggerAchievementNotification = (newAchievements: any[]) => {
    setAchievements(newAchievements);
    setShowAchievementNotification(true);
  };

  const closeAchievementNotification = () => {
    setShowAchievementNotification(false);
    setAchievements([]);
  };

  return {
    selectedConfig,
    currentView,
    simuladoResults,
    selectedSimuladoId,
    showConfetti,
    achievements,
    showAchievementNotification,
    handleSelectionChange,
    goHome,
    startRedacao,
    setCurrentView,
    setSimuladoResults,
    triggerConfetti,
    triggerAchievementNotification,
    closeAchievementNotification,
    viewSimuladoDetails,
  };
};
