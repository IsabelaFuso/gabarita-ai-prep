import { useState, useEffect } from "react";
import { BookOpen, Target, Clock, Award, PenTool, RefreshCw, AlertCircle, PlayCircle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VestibularDashboardProps {
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
  onStartSimulado?: () => void;
  onStartRedacao?: () => void;
  usedQuestionIds: number[];
  onResetUsedQuestions: () => void;
}

interface PerformanceData {
  accuracy: number;
  performance_by_subject: { subject: string; accuracy: number; total_questions: number }[];
}

interface RecentActivity {
  id: number;
  completed_at: string;
  name: string;
  score: number;
}

export const VestibularDashboard = ({ selectedConfig, onStartSimulado, onStartRedacao, usedQuestionIds, onResetUsedQuestions }: VestibularDashboardProps) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<PerformanceData | null>(null);
  const [questionsToday, setQuestionsToday] = useState(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch performance summary
        const { data: performanceData, error: summaryError } = await supabase
          .rpc('get_user_performance_summary', { p_user_id: user.id });

        if (summaryError) throw summaryError;

        if (performanceData) {
            let totalCorrect = 0;
            let totalAttempted = 0;
            const subjectMap = new Map<string, { correct: number; total: number }>();

            performanceData.forEach(item => {
                totalCorrect += item.correct_attempts;
                totalAttempted += item.total_attempts;

                if (!subjectMap.has(item.subject_name)) {
                    subjectMap.set(item.subject_name, { correct: 0, total: 0 });
                }
                const subjectPerf = subjectMap.get(item.subject_name)!;
                subjectPerf.correct += item.correct_attempts;
                subjectPerf.total += item.total_attempts;
            });

            const overallAccuracy = totalAttempted > 0 ? totalCorrect / totalAttempted : 0;
            const performance_by_subject = Array.from(subjectMap.entries()).map(([subject, data]) => ({
                subject,
                accuracy: data.total > 0 ? data.correct / data.total : 0,
                total_questions: data.total,
            }));

            setSummary({
                accuracy: overallAccuracy,
                performance_by_subject,
            });
        }


        // Fetch questions answered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count, error: todayError } = await supabase
          .from('user_attempts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('attempt_date', today.toISOString());

        if (todayError) throw todayError;
        setQuestionsToday(count ?? 0);

        // Fetch recent activities (completed simulados)
        const { data: activityData, error: activityError } = await supabase
          .from('simulados')
          .select('id, completed_at, name, score')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(3);

        if (activityError) throw activityError;
        setRecentActivities(activityData as RecentActivity[]);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const hasSelection = selectedConfig.university && selectedConfig.firstChoice;

  if (!hasSelection) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Configure sua Preparação</h3>
        <p className="text-muted-foreground">
          Selecione uma instituição e seus cursos de interesse para começar
        </p>
      </div>
    );
  }

  const subjectColors: { [key: string]: string } = {
    'Matemática': 'text-primary',
    'Português': 'text-success',
    'Biologia': 'text-warning',
    'Química': 'text-destructive',
    'Física': 'text-info',
    'História': 'text-accent-foreground',
    'Geografia': 'text-secondary-foreground',
    'Filosofia': 'text-primary',
    'Sociologia': 'text-success',
    'Inglês': 'text-warning',
    'Espanhol': 'text-destructive',
  };

  return (
    <div className="space-y-6">
      {/* Study Session Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questões Hoje</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold text-primary">{questionsToday}</div>}
            <p className="text-xs text-muted-foreground invisible">+0% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-20" /> : <div className="text-2xl font-bold text-success">{summary ? Math.round(summary.accuracy * 100) : 0}%</div>}
            <p className="text-xs text-muted-foreground invisible">+0% esta semana</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Estudo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3h 42m</div>
            <p className="text-xs text-muted-foreground">Meta diária: 4h</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2,847</div>
            <p className="text-xs text-muted-foreground">Top 15% nacional</p>
          </CardContent>
        </Card>
      </div>

      {/* Questions Management */}
      {usedQuestionIds.length > 0 && (
        <Card className="shadow-soft border-warning/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                <CardTitle className="text-lg">Banco de Questões</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetUsedQuestions}
                className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive"
              >
                <RefreshCw className="w-4 h-4" />
                Resetar
              </Button>
            </div>
            <CardDescription>
              Questões já utilizadas nos seus estudos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <div>
                <p className="text-sm font-medium">
                  {usedQuestionIds.length} questões já utilizadas
                </p>
                <p className="text-xs text-muted-foreground">
                  Clique em "Resetar" para permitir repetição de questões
                </p>
              </div>
              <Badge variant="outline" className="bg-warning/20 text-warning-foreground">
                {usedQuestionIds.length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Study Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Simulados Personalizados</CardTitle>
            <CardDescription>
              Baseados nos seus cursos escolhidos e instituição alvo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg" onClick={onStartSimulado}>
              <PlayCircle className="mr-2 h-5 w-5" />
              Simulado Completo - {selectedConfig.university.toUpperCase()}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Foco no Meu Curso
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Simulado Rápido (30 min)
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Área de Redação</CardTitle>
            <CardDescription>
              Pratique redação dissertativo-argumentativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" size="lg" onClick={onStartRedacao}>
              <PenTool className="mr-2 h-5 w-5" />
              Praticar Redação
            </Button>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Temas de vestibulares anteriores</p>
              <p>• Avaliação automática</p>
              <p>• Feedback por competência</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Banco de Questões</CardTitle>
            <CardDescription>
              Pratique por matéria ou área específica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Questões por Matéria
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Minhas Dificuldades
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Questões Comentadas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Subject */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Desempenho por Área</CardTitle>
          <CardDescription>
            Acompanhe seu progresso nas principais matérias do vestibular
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))
          ) : (
            summary?.performance_by_subject.map((item) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.subject}</span>
                    <Badge variant="outline">{item.total_questions} questões</Badge>
                  </div>
                  <span className={`font-bold ${subjectColors[item.subject] || 'text-muted-foreground'}`}>{Math.round(item.accuracy * 100)}%</span>
                </div>
                <Progress value={item.accuracy * 100} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{activity.name || 'Simulado'}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.completed_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant="secondary">{Math.round(activity.score)}%</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};