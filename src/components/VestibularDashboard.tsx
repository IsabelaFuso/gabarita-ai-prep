import { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  TrendingUp, 
  PlayCircle, 
  Users, 
  Clock, 
  Award, 
  PenTool, 
  RefreshCw, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePerformance } from "@/hooks/usePerformance";
import { useDashboardStats } from "@/hooks/useDashboardStats";

interface Subject {
  id: string;
  name: string;
}

interface VestibularDashboardProps {
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
  onStartSimulado?: () => void;
  onStartRedacao?: () => void;
  onStartPracticeBySubject: (subject: string) => void;
  onStartReviewed: () => void;
  usedQuestionIds: number[];
  onResetUsedQuestions: () => void;
}

export const VestibularDashboard = ({ 
  selectedConfig, 
  onStartSimulado, 
  onStartRedacao, 
  onStartPracticeBySubject,
  onStartReviewed,
  usedQuestionIds, 
  onResetUsedQuestions 
}: VestibularDashboardProps) => {
  const hasSelection = selectedConfig.university && selectedConfig.firstChoice;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { performanceData, loading: loadingPerformance } = usePerformance();
  const { stats, loading: loadingStats } = useDashboardStats();

  const formatStudyTime = (minutes: number) => {
    if (!minutes) return "0m";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m`;
  }

  const performanceBySubject = useMemo(() => {
    if (!performanceData || performanceData.length === 0) return [];

    const statsBySubject: { [key: string]: { correct: number; total: number } } = {};

    for (const item of performanceData) {
      if (!statsBySubject[item.subject_name]) {
        statsBySubject[item.subject_name] = { correct: 0, total: 0 };
      }
      statsBySubject[item.subject_name].total += item.total_attempts;
      statsBySubject[item.subject_name].correct += item.correct_attempts;
    }

    return Object.entries(statsBySubject).map(([subject, stats]) => ({
      subject,
      progress: Math.round((stats.correct / stats.total) * 100),
      questions: stats.total,
      color: "text-primary", // Simplified color for now
    })).sort((a, b) => b.questions - a.questions);
  }, [performanceData]);

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
            {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold text-primary">{stats?.questions_today || 0}</div>}
            <p className="text-xs text-muted-foreground">Total de hoje</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold text-success">{Math.round(stats?.overall_accuracy || 0)}%</div>}
            <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Estudo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold text-warning">{formatStudyTime(stats?.study_time_minutes || 0)}</div>}
            <p className="text-xs text-muted-foreground">Tempo estimado</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-elevated transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold text-primary">{stats?.total_score || 0}</div>}
            <p className="text-xs text-muted-foreground">Total de pontos</p>
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
            <Select onValueChange={(value) => onStartPracticeBySubject(value)}>
              <SelectTrigger className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Questões por Matéria" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleStartWorstSubjectPractice}
              disabled={loadingPerformance || !worstSubject}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {loadingPerformance ? 'Analisando...' : `Focar em ${worstSubject || 'Dificuldades'}`}
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={onStartReviewed}
            >
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
          {loadingPerformance ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : performanceBySubject.length > 0 ? (
            performanceBySubject.map((item) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.subject}</span>
                    <Badge variant="outline">{item.questions} questões</Badge>
                  </div>
                  <span className={`font-bold ${item.color}`}>{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">Ainda não há dados de desempenho.</p>
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
            {[
              { time: "Hoje, 14:30", action: "Completou simulado de Matemática", score: "78%" },
              { time: "Ontem, 16:45", action: "Praticou 25 questões de Biologia", score: "84%" },
              { time: "Ontem, 10:20", action: "Revisou questões de Química", score: "71%" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="secondary">{activity.score}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
