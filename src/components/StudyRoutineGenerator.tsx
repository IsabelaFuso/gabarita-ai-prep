import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Clock,
  PlayCircle,
  BookOpen,
  Target,
  TrendingUp,
  Video,
  PenTool,
  Lightbulb,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface PerformanceData {
  subject_name: string;
  accuracy: number;
  total_questions: number;
}

interface StudyTask {
  id: string;
  type: 'video' | 'simulado' | 'redacao' | 'questoes';
  subject: string;
  title: string;
  description: string;
  duration: number;
  priority: 'alta' | 'media' | 'baixa';
  completed: boolean;
  videoUrl?: string;
}

interface WeeklyRoutine {
  weekNumber: number;
  focus: string;
  tasks: StudyTask[];
  goalAccuracy: number;
}

interface StudyRoutineGeneratorProps {
  performanceData: PerformanceData[];
  userProfile?: {
    target_exam?: string;
    first_choice_course?: string;
    target_subjects?: string[];
  };
}

export const StudyRoutineGenerator = ({ performanceData, userProfile }: StudyRoutineGeneratorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [routine, setRoutine] = useState<WeeklyRoutine[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);

  const generateRoutine = async () => {
    if (!user || performanceData.length === 0) return;

    setLoading(true);
    try {
      // Analyze performance to identify weak areas
      const weakSubjects = performanceData
        .filter(subject => subject.accuracy < 70)
        .sort((a, b) => a.accuracy - b.accuracy);
      
      const strongSubjects = performanceData
        .filter(subject => subject.accuracy >= 70)
        .sort((a, b) => b.accuracy - a.accuracy);

      // Create 4-week routine
      const generatedRoutine: WeeklyRoutine[] = [];

      for (let week = 1; week <= 4; week++) {
        const weeklyTasks: StudyTask[] = [];
        
        // Focus on 2-3 weak subjects per week
        const focusSubjects = weakSubjects.slice(0, 3);
        const focusSubject = focusSubjects[0]?.subject_name || 'Matemática';

        // Generate video learning tasks
        for (const subject of focusSubjects) {
          const videoTask: StudyTask = {
            id: `video-${week}-${subject.subject_name}`,
            type: 'video',
            subject: subject.subject_name,
            title: `Aula de ${subject.subject_name} - Conceitos Fundamentais`,
            description: `Revisão dos conceitos básicos e exercícios práticos`,
            duration: 45,
            priority: 'alta',
            completed: false,
            videoUrl: await searchYouTubeVideo(subject.subject_name)
          };
          weeklyTasks.push(videoTask);
        }

        // Add practice questions for weak subjects
        for (const subject of focusSubjects) {
          const questionTask: StudyTask = {
            id: `questions-${week}-${subject.subject_name}`,
            type: 'questoes',
            subject: subject.subject_name,
            title: `Exercícios de ${subject.subject_name}`,
            description: `Resolva 20 questões para fortalecer o conhecimento`,
            duration: 30,
            priority: 'alta',
            completed: false
          };
          weeklyTasks.push(questionTask);
        }

        // Add simulado for overall practice
        const simuladoTask: StudyTask = {
          id: `simulado-${week}`,
          type: 'simulado',
          subject: 'Geral',
          title: `Simulado da Semana ${week}`,
          description: 'Simulado completo com foco nas matérias de menor desempenho',
          duration: 120,
          priority: 'media',
          completed: false
        };
        weeklyTasks.push(simuladoTask);

        // Add essay practice (every 2 weeks)
        if (week % 2 === 0) {
          const essayTask: StudyTask = {
            id: `essay-${week}`,
            type: 'redacao',
            subject: 'Redação',
            title: 'Prática de Redação',
            description: 'Redação dissertativa sobre tema atual',
            duration: 90,
            priority: 'media',
            completed: false
          };
          weeklyTasks.push(essayTask);
        }

        // Add review for strong subjects (lower priority)
        if (strongSubjects.length > 0) {
          const reviewTask: StudyTask = {
            id: `review-${week}`,
            type: 'questoes',
            subject: strongSubjects[0].subject_name,
            title: `Revisão de ${strongSubjects[0].subject_name}`,
            description: 'Mantenha o bom desempenho com exercícios de revisão',
            duration: 20,
            priority: 'baixa',
            completed: false
          };
          weeklyTasks.push(reviewTask);
        }

        generatedRoutine.push({
          weekNumber: week,
          focus: focusSubject,
          tasks: weeklyTasks,
          goalAccuracy: Math.min(100, (focusSubjects[0]?.accuracy || 50) + 15)
        });
      }

      setRoutine(generatedRoutine);
      toast({
        title: "Rotina Criada!",
        description: "Sua rotina de estudos personalizada foi gerada com base no seu desempenho.",
      });
    } catch (error) {
      console.error("Error generating routine:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a rotina de estudos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchYouTubeVideo = async (subject: string): Promise<string> => {
    try {
      // This would integrate with your existing video search function
      // For now, return a placeholder URL
      const searchTerms = {
        'Matemática': 'matematica basica enem',
        'Português': 'portugues gramatica enem',
        'Física': 'fisica mecanica enem',
        'Química': 'quimica organica enem',
        'Biologia': 'biologia celular enem',
        'História': 'historia brasil enem',
        'Geografia': 'geografia fisica enem'
      };
      
      const searchTerm = searchTerms[subject as keyof typeof searchTerms] || `${subject} enem`;
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
    } catch (error) {
      return 'https://www.youtube.com/results?search_query=enem+estudos';
    }
  };

  const markTaskCompleted = (weekIndex: number, taskId: string) => {
    setRoutine(prev => prev.map((week, index) => {
      if (index === weekIndex) {
        return {
          ...week,
          tasks: week.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return week;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'warning';
      case 'baixa': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'simulado': return Target;
      case 'redacao': return PenTool;
      case 'questoes': return BookOpen;
      default: return BookOpen;
    }
  };

  const currentWeekProgress = routine[currentWeek] ? 
    (routine[currentWeek].tasks.filter(task => task.completed).length / routine[currentWeek].tasks.length) * 100 : 0;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Rotina de Estudos Personalizada
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Plano de estudos baseado no seu desempenho e objetivos
            </p>
          </div>
          <Button onClick={generateRoutine} disabled={loading || performanceData.length === 0}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            {routine.length > 0 ? 'Atualizar Rotina' : 'Gerar Rotina'}
          </Button>
        </div>
      </CardHeader>

      {routine.length > 0 && (
        <CardContent>
          <Tabs value={currentWeek.toString()} onValueChange={(value) => setCurrentWeek(parseInt(value))}>
            <TabsList className="grid w-full grid-cols-4">
              {routine.map((week, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Semana {week.weekNumber}
                </TabsTrigger>
              ))}
            </TabsList>

            {routine.map((week, weekIndex) => (
              <TabsContent key={weekIndex} value={weekIndex.toString()}>
                <div className="space-y-4">
                  {/* Week Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Foco da Semana</p>
                          <p className="font-semibold">{week.focus}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                          <p className="text-sm text-muted-foreground">Progresso</p>
                          <p className="font-semibold">{Math.round(currentWeekProgress)}%</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-warning" />
                          <p className="text-sm text-muted-foreground">Meta de Acertos</p>
                          <p className="font-semibold">{week.goalAccuracy}%</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso da Semana</span>
                      <span>{Math.round(currentWeekProgress)}%</span>
                    </div>
                    <Progress value={currentWeekProgress} />
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Tarefas da Semana</h3>
                    {week.tasks.map((task) => {
                      const IconComponent = getTaskIcon(task.type);
                      return (
                        <Card key={task.id} className={task.completed ? 'opacity-70' : ''}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <IconComponent className="w-5 h-5 mt-1 text-primary" />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{task.title}</h4>
                                    <Badge variant={getPriorityColor(task.priority) as any}>
                                      {task.priority}
                                    </Badge>
                                    {task.completed && (
                                      <CheckCircle2 className="w-4 h-4 text-success" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {task.duration} min
                                    </span>
                                    <span>{task.subject}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {task.videoUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(task.videoUrl, '_blank')}
                                  >
                                    <PlayCircle className="w-4 h-4 mr-1" />
                                    Assistir
                                  </Button>
                                )}
                                <Button
                                  variant={task.completed ? "secondary" : "default"}
                                  size="sm"
                                  onClick={() => markTaskCompleted(weekIndex, task.id)}
                                >
                                  {task.completed ? 'Concluído' : 'Marcar como Concluído'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      )}

      {routine.length === 0 && !loading && (
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Gere uma rotina de estudos personalizada baseada no seu desempenho
            </p>
            <p className="text-sm text-muted-foreground">
              {performanceData.length === 0 ? 
                'Resolva algumas questões primeiro para que possamos analisar seu desempenho' :
                'Clique em "Gerar Rotina" para começar'
              }
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};