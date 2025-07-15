import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Trophy, 
  BookOpen,
  RefreshCw,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DesempenhoViewProps {
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
}

interface PerformanceData {
  subject: string;
  score: number;
  questions: number;
  color: string;
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
  "Default": "text-gray-500",
};

export const DesempenhoView = ({ selectedConfig }: DesempenhoViewProps) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformanceData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const { data: attempts, error: attemptsError } = await supabase
        .from('user_attempts')
        .select(`
          is_correct,
          question:questions (
            subject:subjects (name)
          )
        `)
        .eq('user_id', user.id);

      if (attemptsError) throw attemptsError;

      if (!attempts || attempts.length === 0) {
        setPerformanceData([]);
        setTotalAttempts(0);
        setOverallScore(0);
        setLoading(false);
        return;
      }

      const statsBySubject: { [key: string]: { correct: number; total: number } } = {};

      for (const attempt of attempts) {
        if (attempt.question?.subject?.name) {
          const subjectName = attempt.question.subject.name;
          if (!statsBySubject[subjectName]) {
            statsBySubject[subjectName] = { correct: 0, total: 0 };
          }
          statsBySubject[subjectName].total++;
          if (attempt.is_correct) {
            statsBySubject[subjectName].correct++;
          }
        }
      }

      const formattedData: PerformanceData[] = Object.entries(statsBySubject).map(([subject, stats]) => ({
        subject,
        score: Math.round((stats.correct / stats.total) * 100),
        questions: stats.total,
        color: subjectColors[subject] || subjectColors.Default,
      }));

      const totalCorrect = attempts.filter(a => a.is_correct).length;
      setOverallScore(Math.round((totalCorrect / attempts.length) * 100));
      setTotalAttempts(attempts.length);
      setPerformanceData(formattedData.sort((a, b) => b.questions - a.questions));

    } catch (err: any) {
      console.error("Error fetching performance data:", err);
      setError("Não foi possível carregar seu desempenho. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

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
        <Button onClick={fetchPerformanceData}>Tentar Novamente</Button>
      </div>
    );
  }

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
            <p className="text-xs text-muted-foreground">Em todas as matérias</p>
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
              {performanceData.length > 0 ? performanceData.reduce((prev, current) => (prev.score > current.score) ? prev : current).subject : '-'}
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
            {performanceData.length > 0 ? performanceData.reduce((prev, current) => (prev.score < current.score) ? prev : current).subject : '-'}
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
              <CardTitle className="text-lg">Desempenho por Matéria</CardTitle>
              <CardDescription>
                Análise detalhada do seu progresso em cada área
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPerformanceData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceData.length > 0 ? (
            performanceData.map((item) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.subject}</span>
                    <Badge variant="outline">{item.questions} questões</Badge>
                  </div>
                  <span className={`font-bold text-lg ${item.color}`}>{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-3" />
              </div>
            ))
          ) : (
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
