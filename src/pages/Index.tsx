import { useState } from "react";
import { BookOpen, Target, Trophy, TrendingUp, PlayCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/components/QuestionCard";
import { Header } from "@/components/Header";

const mockQuestions = [
  {
    id: 1,
    institution: "ENEM",
    year: 2023,
    subject: "Biologia",
    topic: "Citologia",
    statement: "As mitocôndrias são organelas presentes em células eucarióticas e são responsáveis pela produção de energia. Sobre as mitocôndrias, é CORRETO afirmar que:",
    alternatives: [
      "Possuem DNA próprio e ribossomos, sendo capazes de se reproduzir independentemente.",
      "São encontradas apenas em células animais.",
      "Não possuem membrana própria.",
      "São responsáveis pela fotossíntese.",
      "Estão presentes no núcleo celular."
    ],
    correctAnswer: 0,
    explanation: "As mitocôndrias possuem DNA próprio (circular, semelhante ao bacteriano) e ribossomos próprios, permitindo que se reproduzam de forma semi-independente da célula. Esta característica apoia a teoria endossimbiótica."
  },
  {
    id: 2,
    institution: "FUVEST",
    year: 2023,
    subject: "Matemática",
    topic: "Função Quadrática",
    statement: "A função f(x) = ax² + bx + c tem como gráfico uma parábola que passa pelos pontos (0, 3), (1, 6) e (2, 11). O valor de a + b + c é:",
    alternatives: ["6", "8", "10", "12", "14"],
    correctAnswer: 0,
    explanation: "Substituindo os pontos na equação: f(0) = c = 3; f(1) = a + b + c = 6; f(2) = 4a + 2b + c = 11. Resolvendo o sistema: a = 1, b = 2, c = 3. Portanto, a + b + c = 6."
  }
];

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === mockQuestions[currentQuestionIndex].correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Gabarita.AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sua preparação para o vestibular com inteligência artificial. 
            Pratique com questões reais e receba feedback personalizado.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questões Resolvidas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <p className="text-xs text-muted-foreground">+12% desde ontem</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">78%</div>
              <p className="text-xs text-muted-foreground">+5% esta semana</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Simulados Feitos</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">23</div>
              <p className="text-xs text-muted-foreground">Meta: 30 este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ranking</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">#156</div>
              <p className="text-xs text-muted-foreground">Entre 10,000 usuários</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Session */}
        {score.total > 0 && (
          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Sessão Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Progresso: {score.total}/{mockQuestions.length} questões
                </span>
                <Badge variant={score.correct / score.total >= 0.7 ? "default" : "secondary"}>
                  {Math.round((score.correct / score.total) * 100)}% de acerto
                </Badge>
              </div>
              <Progress value={(score.total / mockQuestions.length) * 100} className="mb-4" />
              <div className="text-sm text-muted-foreground">
                {score.correct} acertos de {score.total} questões respondidas
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuestionCard
              question={mockQuestions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              showExplanation={showExplanation}
              onNext={nextQuestion}
              isLastQuestion={currentQuestionIndex === mockQuestions.length - 1}
              onReset={resetQuiz}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Iniciar Simulado ENEM
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Banco de Questões
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Ranking Geral
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Progresso por Matéria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { subject: "Matemática", progress: 85, color: "bg-primary" },
                  { subject: "Português", progress: 72, color: "bg-success" },
                  { subject: "Biologia", progress: 68, color: "bg-warning" },
                  { subject: "História", progress: 45, color: "bg-destructive" }
                ].map((item) => (
                  <div key={item.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.subject}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;