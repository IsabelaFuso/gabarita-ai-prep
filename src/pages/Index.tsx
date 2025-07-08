import { useState } from "react";
import { Header } from "@/components/Header";
import { UniversitySelector } from "@/components/UniversitySelector";
import { VestibularDashboard } from "@/components/VestibularDashboard";
import { QuestionCard } from "@/components/QuestionCard";
import { SimuladoCompleto } from "@/components/SimuladoCompleto";
import { ResultadoSimulado } from "@/components/ResultadoSimulado";
import { RedacaoArea } from "@/components/RedacaoArea";
import { questionsBank, getRandomQuestions, type Question } from "@/data/questionsBank";

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
  const [currentView, setCurrentView] = useState<'dashboard' | 'simulado' | 'resultado' | 'redacao'>('dashboard');
  const [simuladoResults, setSimuladoResults] = useState<{
    answers: (number | null)[];
    timeUsed: number;
    score: number;
  } | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);

  // Gerar questões baseadas na configuração
  const generateQuestions = (count: number = 20, excludeUsed: boolean = true) => {
    const filters: any = {};
    
    if (selectedConfig.university && selectedConfig.university !== 'enem') {
      filters.institution = selectedConfig.university.toUpperCase();
    }
    
    const excludeIds = excludeUsed ? usedQuestionIds : undefined;
    const questions = getRandomQuestions(count, Object.keys(filters).length ? filters : undefined, excludeIds);
    
    // Adicionar os IDs das novas questões à lista de usadas
    if (excludeUsed) {
      const newIds = questions.map(q => q.id);
      setUsedQuestionIds(prev => [...prev, ...newIds]);
    }
    
    return questions;
  };

  // Resetar questões usadas
  const resetUsedQuestions = () => {
    setUsedQuestionIds([]);
  };

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === practiceQuestions[currentQuestionIndex].correctAnswer;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
    const newQuestions = generateQuestions(10);
    setPracticeQuestions(newQuestions);
  };

  const handleSelectionChange = (config: typeof selectedConfig) => {
    setSelectedConfig(config);
  };

  const startSimulado = () => {
    const simuladoQuestions = generateQuestions(25);
    setCurrentQuestions(simuladoQuestions);
    setCurrentView('simulado');
  };

  const handleSimuladoFinish = (results: { answers: (number | null)[]; timeUsed: number; score: number }) => {
    setSimuladoResults(results);
    setCurrentView('resultado');
  };

  const handleSimuladoExit = () => {
    setCurrentView('dashboard');
  };

  const restartSimulado = () => {
    setSimuladoResults(null);
    const newQuestions = generateQuestions(25);
    setCurrentQuestions(newQuestions);
    setCurrentView('simulado');
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setSimuladoResults(null);
  };

  const startPractice = () => {
    const newQuestions = generateQuestions(10);
    setPracticeQuestions(newQuestions);
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
  };

  const startRedacao = () => {
    setCurrentView('redacao');
  };

  // Renderizar diferentes views
  if (currentView === 'redacao') {
    return (
      <RedacaoArea
        onBack={goHome}
        selectedConfig={selectedConfig}
      />
    );
  }

  if (currentView === 'simulado') {
    return (
      <SimuladoCompleto
        questions={currentQuestions}
        timeLimit={120}
        onFinish={handleSimuladoFinish}
        onExit={handleSimuladoExit}
        selectedConfig={selectedConfig}
      />
    );
  }

  if (currentView === 'resultado' && simuladoResults) {
    return (
      <ResultadoSimulado
        questions={currentQuestions}
        answers={simuladoResults.answers}
        timeUsed={simuladoResults.timeUsed}
        score={simuladoResults.score}
        onRestart={restartSimulado}
        onHome={goHome}
        selectedConfig={selectedConfig}
      />
    );
  }

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
              <VestibularDashboard 
                selectedConfig={selectedConfig} 
                onStartSimulado={startSimulado}
                onStartRedacao={startRedacao}
                usedQuestionIds={usedQuestionIds}
                onResetUsedQuestions={resetUsedQuestions}
              />
            ) : (
              <div className="space-y-6">
                {/* Current Session Progress */}
                {score.total > 0 && (
                  <div className="bg-card p-4 rounded-lg border shadow-soft">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Progresso: {score.total}/{practiceQuestions.length} questões
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round((score.correct / score.total) * 100)}% de acerto
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(score.total / practiceQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {practiceQuestions.length > 0 && (
                  <QuestionCard
                    question={practiceQuestions[currentQuestionIndex]}
                    onAnswer={handleAnswer}
                    showExplanation={showExplanation}
                    onNext={nextQuestion}
                    isLastQuestion={currentQuestionIndex === practiceQuestions.length - 1}
                    onReset={resetQuiz}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;