import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface PerformanceSummary {
  subject_id: string;
  subject_name: string;
  topic_id: string;
  topic_name: string;
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
}

export const usePerformance = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformanceData = useCallback(async () => {
    if (!user) {
      // Don't set an error, just wait for the user to be available
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/performance-summary?userId=${user.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao buscar dados de desempenho.');
      }
      const data: PerformanceSummary[] = await response.json();
      setPerformanceData(data);
    } catch (err: any) {
      console.error("Error fetching performance data:", err);
      setError(err.message || "Não foi possível carregar seu desempenho. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  return { performanceData, loading, error, refresh: fetchPerformanceData };
};
