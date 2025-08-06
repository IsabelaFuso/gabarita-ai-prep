import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingDown, 
  Target, 
  Trophy, 
  BookOpen,
  RefreshCw,
  Loader2,
  AlertTriangle,
  FileText // Ícone para Redação
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PerformanceData {
  subject_name: string;
  accuracy: number;
  total_questions: number;
}

interface EssayPerformanceData {
  average_score: number;
  essays_written: number;
}

const subjectColors: { [key: string]: string } = {
  "Matemática": "text-primary",
  "Português": "text-success",
  "Biologia": "text-warning",
  "Química": "text-destructive",
  "Física": "text-muted-foreground",
  "História": "text-accent-foreground",
  "Geografia": "text-blue-500",
  "Filosofia": "text-purple-500",
  "Sociologia": "text-pink-500",
  "Inglês": "text-indigo-500",
  "Espanhol": "text-orange-500",
  "Redação": "text-teal-500", // Cor para Redação
  "Default": "text-gray-500",
};

export const DesempenhoView = () => {
  const { user } = useAuth();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [essayPerformance, setEssayPerformance] = useState<EssayPerformanceData | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch subject performance
        const { data: performance, error: rpcError } = await supabase.rpc('get_performance_summary', { p_user_id: user.id });

        if (rpcError) throw rpcError;

        if (performance && performance.length > 0) {
          const totalCorrect = performance.reduce((sum, item) => sum + (item.correct_answers || 0), 0);
          const totalQuestions = performance.reduce((sum, item) => sum + (item.total_questions || 0), 0);
          
          const formattedData = performance.map(item => ({
            subject_name: item.subject_name,
            accuracy: Math.round(item.accuracy * 100),
            total_questions: item.total_questions,
          }));

          setOverallScore(totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0);
          setTotalAttempts(totalQuestions);
          setPerformanceData(formattedData);
        } else {
          setPerformanceData([]);
          setTotalAttempts(0);
          setOverallScore(0);
        }

        // Fetch essay performance - temporarily using mock data
        const essaysWritten = 0; // profile?.essays_written || 0;
        setEssayPerformance({
          average_score: essaysWritten > 0 ? 820 + Math.floor(Math.random() * 60) - 30 : 0, 
          essays_written: essaysWritten,
        });

      } catch (err: any) {
        console.error("Error fetching performance data:", err);
        setError("Não foi possível carregar seu desempenho. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 p-6 rounded-lg">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-lg font-semibold text-destructive mb-2">Ocorreu um erro</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
      </div>
    );
  }

  const getSubjectColor = (subject: string) => subjectColors[subject] || subjectColors.Default;

  const noData = performanceData.length === 0 && (!essayPerformance || essayPerformance.essays_written === 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{overallScore}%</div>
            <p className="text-xs text-muted-foreground">Em questões de múltipla escolha</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questões</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Total respondidas</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Melhor Matéria</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {performanceData.length > 0 ? [...performanceData].sort((a, b) => b.accuracy - a.accuracy)[0].subject_name : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Sua área de destaque</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Melhorar</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
            {performanceData.length > 0 ? [...performanceData].sort((a, b) => a.accuracy - b.accuracy)[0].subject_name : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Seu ponto de foco</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Desempenho por Área</CardTitle>
              <CardDescription>
                Acompanhe seu progresso nas principais matérias do vestibular e na redação.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {essayPerformance && (
            <div className="space-y-2 p-4 border rounded-lg bg-accent/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${getSubjectColor("Redação")}`} />
                  <span className="font-medium">Redação</span>
                  <Badge variant="outline">{essayPerformance.essays_written} redações</Badge>
                </div>
                {essayPerformance.essays_written > 0 ? (
                  <div className="text-right">
                    <span className={`font-bold text-lg ${getSubjectColor("Redação")}`}>{essayPerformance.average_score}</span>
                    <span className="text-sm text-muted-foreground">/1000</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Comece a praticar!</span>
                )}
              </div>
              <Progress value={essayPerformance.average_score / 10} className="h-3" />
            </div>
          )}
          
          {performanceData.map((item) => (
            <div key={item.subject_name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{item.subject_name}</span>
                  <Badge variant="outline">{item.total_questions} questões</Badge>
                </div>
                <span className={`font-bold text-lg ${getSubjectColor(item.subject_name)}`}>{item.accuracy}%</span>
              </div>
              <Progress value={item.accuracy} className="h-3" />
            </div>
          ))}

          {noData && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum dado de desempenho encontrado.</p>
              <p className="text-sm">Comece a praticar para ver suas estatísticas aqui.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};