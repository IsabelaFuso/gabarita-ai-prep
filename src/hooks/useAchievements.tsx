import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Achievement } from "@/data/types";

export const useAchievements = () => {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all achievements
        const { data: allAchievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('code');

        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
          return;
        }

        // Fetch user's unlocked achievements
        const { data: userAchievementsData, error: userError } = await supabase
          .from('user_achievements')
          .select('achievement_code')
          .eq('user_id', user.id);

        if (userError) {
          console.error('Error fetching user achievements:', userError);
          return;
        }

        setAllAchievements(allAchievementsData || []);
        setUnlockedAchievements(new Set(userAchievementsData?.map(ua => ua.achievement_code) || []));
      } catch (error) {
        console.error('Error in achievements fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const checkForNewAchievements = async () => {
    if (!user) return [];

    try {
      const { data: newAchievements } = await supabase.rpc('check_and_grant_achievements', {
        p_user_id: user.id,
        p_simulado_accuracy: 0,
        p_simulado_question_count: 0
      });

      if (newAchievements && newAchievements.length > 0) {
        // Update unlocked achievements
        const newCodes = newAchievements.map((ach: Achievement) => ach.code);
        setUnlockedAchievements(prev => new Set([...prev, ...newCodes]));
        return newAchievements;
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }

    return [];
  };

  return {
    allAchievements,
    unlockedAchievements,
    loading,
    checkForNewAchievements
  };
};