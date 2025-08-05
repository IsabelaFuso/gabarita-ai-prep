import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export type AppView = 'dashboard' | 'simulado' | 'resultado' | 'redacao' | 'simulados' | 'questoes' | 'desempenho' | 'tutor' | 'banco-questoes';

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

  const [showConfetti, setShowConfetti] = useState(false);

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

    // Get the institution ID from its name
    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('name', config.university.toUpperCase()) // Ensure uppercase
      .single();

    if (!institution) return;

    // Save the updated config to the user's profile
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
  };

  const startRedacao = () => {
    setCurrentView('redacao');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Confetti runs for 5 seconds
  };

  return {
    selectedConfig,
    currentView,
    simuladoResults,
    showConfetti,
    handleSelectionChange,
    goHome,
    startRedacao,
    setCurrentView,
    setSimuladoResults,
    triggerConfetti,
  };
};