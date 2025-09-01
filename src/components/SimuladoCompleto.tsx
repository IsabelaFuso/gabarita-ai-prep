import { useState, useEffect } from "react";
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle, AlertCircle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TutorView } from "./TutorView";
import { type Question } from "@/data/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SimuladoCompletoProps {
  questions: Question[];
  timeLimit: number; // em minutos
  onFinish: (results: {
    answers: (number | null)[];
    timeUsed: number;
    score: number;
  }) => void;
  onExit: () => void;
  selectedConfig: {
    university: string;
    firstChoice: string;
    secondChoice: string;
  };
}

export const SimuladoCompleto = ({ 
  questions, 
  timeLimit, 
  onFinish, 
  onExit,
  selectedConfig 
}: SimuladoCompletoProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // converter para segundos
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  useEffect(() => {
    // Initialize answers array only when questions are loaded
    if (questions.length > 0) {
      setAnswers(new Array(questions.length).fill(null));
    }
  }, [questions]);

  // Cronômetro
  useEffect(() => {
    if (questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
              Nenhuma Questão Encontrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Não foi possível carregar as questões para este simulado. Isso pode acontecer se não houver questões disponíveis para os filtros selecionados (universidade, matéria, etc.) ou se você já respondeu todas as questões disponíveis.</p>
            <Button onClick={onExit}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const goToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    const score = answers.reduce((acc, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const timeUsed = (timeLimit * 60) - timeRemaining;
    
    onFinish({
      answers,
      timeUsed,
      score
    });
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== null) return "answered";
    if (index === currentQuestionIndex) return "current";
    return "unanswered";
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  const timeWarning = timeRemaining < 300; // últimos 5 minutos
  const timeCritical = timeRemaining < 60; // último minuto

  // Contexto para o Tutor de IA
  const tutorContext = {
    type: "question",
    questionId: currentQuestion?.id,
    questionText: currentQuestion?.statement,
    options: currentQuestion?.alternatives,
    subject: currentQuestion?.subject,
    topic: currentQuestion?.topic,
    explanation: currentQuestion?.explanation,
    correctAnswerIndex: currentQuestion?.correctAnswer,
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header do Simulado */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmExit(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <div>
                <h1 className="font-semibold">Simulado {selectedConfig.university.toUpperCase()}</h1>
                <p className="text-sm text-muted-foreground">
                  Questão {currentQuestionIndex + 1} de {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={cn(
                  "text-lg font-mono font-bold",
                  timeCritical && "text-destructive animate-pulse",
                  timeWarning && !timeCritical && "text-warning"
                )}>
                  <Clock className="w-4 h-4 inline mr-1" />
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {answeredCount}/{questions.length} respondidas
                </p>
              </div>
              
              <Button onClick={handleFinish} className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Finalizar
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Layout Principal: Questão à Esquerda, Tutor à Direita */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna da Esquerda: Questão e Navegação */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="shadow-elevated">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">
                      {typeof currentQuestion.institution === 'string'
                        ? `${currentQuestion.institution} ${currentQuestion.year}`
                        : `${currentQuestion.institution?.name || 'N/A'} ${currentQuestion.year}`}
                    </Badge>
                    <Badge variant="secondary">
                      {typeof currentQuestion.subject === 'string'
                        ? currentQuestion.subject
                        : currentQuestion.subject?.name || 'N/A'}
                    </Badge>
                    <Badge variant="secondary">
                      {typeof currentQuestion.topic === 'string'
                        ? currentQuestion.topic
                        : currentQuestion.topic?.name || 'N/A'}
                    </Badge>
                  </div>
                  {answers[currentQuestionIndex] !== null && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.statement}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {currentQuestion.alternatives.map((alternative, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={cn(
                        "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                        "flex items-center gap-3 min-h-[60px]",
                        answers[currentQuestionIndex] === index
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      )}
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{alternative}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  <Button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="flex items-center gap-2"
                  >
                    Próxima
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Direita: Tutor de IA e Navegação */}
          <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-32 h-fit">
            <Collapsible open={isTutorOpen} onOpenChange={setIsTutorOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  {isTutorOpen ? "Fechar Tutor" : "Pedir ajuda à IA"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <TutorView context={tutorContext} />
              </CollapsibleContent>
            </Collapsible>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegação</CardTitle>
                <CardDescription>Clique para ir para uma questão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all",
                          status === "current" && "border-primary bg-primary text-primary-foreground",
                          status === "answered" && "border-success bg-success/10 text-success-foreground",
                          status === "unanswered" && "border-muted bg-background hover:border-primary/50"
                        )}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Saída */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Confirmar Saída
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Tem certeza que deseja sair do simulado? Seu progresso será perdido.</p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmExit(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={onExit}
                >
                  Sair do Simulado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};