import { useState } from "react";
import { Header } from "@/components/Header";
import { UniversitySelector } from "@/components/UniversitySelector";
import { VestibularDashboard } from "@/components/VestibularDashboard";
import { QuestionCard } from "@/components/QuestionCard";

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
  const [selectedConfig, setSelectedConfig] = useState({
    university: "",
    firstChoice: "",
    secondChoice: ""
  });
  const [showQuestions, setShowQuestions] = useState(false);

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

  const handleSelectionChange = (config: typeof selectedConfig) => {
    setSelectedConfig(config);
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
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Sua preparação para o vestibular com inteligência artificial. 
            Configure sua instituição alvo e cursos para uma experiência personalizada.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <UniversitySelector onSelectionChange={handleSelectionChange} />
          </div>

          {/* Dashboard/Questions */}
          <div className="lg:col-span-2">
            {!showQuestions ? (
              <VestibularDashboard selectedConfig={selectedConfig} />
            ) : (
              <div className="space-y-6">
                {/* Current Session Progress */}
                {score.total > 0 && (
                  <div className="bg-card p-4 rounded-lg border shadow-soft">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progresso: {score.total}/{mockQuestions.length} questões
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round((score.correct / score.total) * 100)}% de acerto
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(score.total / mockQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <QuestionCard
                  question={mockQuestions[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  showExplanation={showExplanation}
                  onNext={nextQuestion}
                  isLastQuestion={currentQuestionIndex === mockQuestions.length - 1}
                  onReset={resetQuiz}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;