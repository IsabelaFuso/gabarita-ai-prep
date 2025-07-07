import { CheckCircle, XCircle, Clock, Target, Trophy, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  institution: string;
  year: number;
  subject: string;
  topic: string;
  statement: string;
  alternatives: string[];
  correctAnswer: number;
  explanation: string;
}

interface ResultadoSimuladoProps {
  questions: Question[];
  answers: (number | null)[];
  timeUsed: number;
  score: number;
  onRestart: () => void;
  onHome: () => void;
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
}

export const ResultadoSimulado = ({
  questions,
  answers,
  timeUsed,
  score,
  onRestart,
  onHome,
  selectedConfig
}: ResultadoSimuladoProps) => {
  const totalQuestions = questions.length;
  const answeredQuestions = answers.filter(a => a !== null).length;
  const correctAnswers = score;
  const wrongAnswers = answeredQuestions - correctAnswers;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  
  const accuracyPercentage = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0;
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceLevel = () => {
    if (accuracyPercentage >= 80) return { level: "Excelente", color: "text-success", icon: Trophy };
    if (accuracyPercentage >= 70) return { level: "Bom", color: "text-primary", icon: Target };
    if (accuracyPercentage >= 60) return { level: "Regular", color: "text-warning", icon: Target };
    return { level: "Precisa Melhorar", color: "text-destructive", icon: Target };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  // Análise por matéria
  const subjectAnalysis = questions.reduce((acc, question, index) => {
    const subject = question.subject;
    if (!acc[subject]) {
      acc[subject] = { total: 0, correct: 0, answered: 0 };
    }
    acc[subject].total++;
    if (answers[index] !== null) {
      acc[subject].answered++;
      if (answers[index] === question.correctAnswer) {
        acc[subject].correct++;
      }
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number; answered: number }>);

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <PerformanceIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Simulado Concluído!</h1>
          <p className="text-muted-foreground">
            Simulado {selectedConfig.university.toUpperCase()} - {formatTime(timeUsed)}
          </p>
        </div>

        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Acertos</div>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-destructive mb-2">{wrongAnswers}</div>
              <div className="text-sm text-muted-foreground">Erros</div>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className={`text-3xl font-bold mb-2 ${performance.color}`}>
                {accuracyPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Acerto</div>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-warning mb-2">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Completude</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Análise Detalhada */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PerformanceIcon className={`w-5 h-5 ${performance.color}`} />
                Análise de Desempenho
              </CardTitle>
              <CardDescription>
                Classificação: <span className={`font-medium ${performance.color}`}>
                  {performance.level}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Questões Respondidas</span>
                  <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Acerto</span>
                  <span className={`font-medium ${performance.color}`}>{accuracyPercentage}%</span>
                </div>
                <Progress value={accuracyPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-2 mx-auto">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-lg font-bold text-success">{correctAnswers}</div>
                  <div className="text-xs text-muted-foreground">Corretas</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-full mb-2 mx-auto">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="text-lg font-bold text-destructive">{wrongAnswers}</div>
                  <div className="text-xs text-muted-foreground">Incorretas</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-muted/50 rounded-full mb-2 mx-auto">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-lg font-bold text-muted-foreground">{unansweredQuestions}</div>
                  <div className="text-xs text-muted-foreground">Não resp.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desempenho por Matéria */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Desempenho por Matéria</CardTitle>
              <CardDescription>
                Análise detalhada do seu desempenho em cada área
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(subjectAnalysis).map(([subject, data]) => {
                const subjectAccuracy = data.answered > 0 ? Math.round((data.correct / data.answered) * 100) : 0;
                const subjectCompletion = Math.round((data.answered / data.total) * 100);
                
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{subject}</span>
                        <Badge variant="outline">{data.answered}/{data.total}</Badge>
                      </div>
                      <span className="font-bold text-primary">{subjectAccuracy}%</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">Acerto</div>
                        <Progress value={subjectAccuracy} className="h-2" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">Completude</div>
                        <Progress value={subjectCompletion} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={onHome} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Voltar ao Início
          </Button>
          <Button onClick={onRestart} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Fazer Novo Simulado
          </Button>
        </div>
      </div>
    </div>
  );
};