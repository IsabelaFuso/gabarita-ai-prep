import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface DashboardStats {
  questions_today: number;
  overall_accuracy: number;
  study_time_minutes: number;
  total_score: number;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      // Don't set an error, just wait for the user to be available
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard-stats?userId=${user.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao buscar estatísticas.');
      }
      const data: DashboardStats = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message || "Não foi possível carregar as estatísticas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
};
