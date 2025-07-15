import { UniversitySelector } from "@/components/UniversitySelector";
import { VestibularDashboard } from "@/components/VestibularDashboard";
import { SimuladoCompleto } from "@/components/SimuladoCompleto";
import { ResultadoSimulado } from "@/components/ResultadoSimulado";
import { RedacaoArea } from "@/components/RedacaoArea";
import { MainLayout } from "@/components/MainLayout";
import { PracticeQuiz } from "@/components/PracticeQuiz";
import { DesempenhoView } from "@/components/DesempenhoView";
import { SimuladosView } from "@/components/SimuladosView";
import { TutorView } from "@/components/TutorView"; // Import the new view
import { useAppState } from "@/hooks/useAppState";
import { useQuestionManager } from "@/hooks/useQuestionManager";
import { useSimuladoManager } from "@/hooks/useSimuladoManager";
import { usePracticeQuiz } from "@/hooks/usePracticeQuiz";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

const Index = () => {
  // Custom hooks for state management
  const {
    selectedConfig,
    currentView,
    simuladoResults,
    handleSelectionChange,
    goHome,
    startRedacao,
    setCurrentView,
    setSimuladoResults
  } = useAppState();

  // This is still needed for the full simulado feature
  const {
    usedQuestionIds,
    generateQuestions,
    resetUsedQuestions
  } = useQuestionManager(selectedConfig);

  const {
    currentQuestions,
    startSimulado,
    handleSimuladoFinish,
    handleSimuladoExit,
    restartSimulado
  } = useSimuladoManager(generateQuestions, setCurrentView, setSimuladoResults);

  // Updated usePracticeQuiz hook, no longer needs generateQuestions
  const {
    currentQuestionIndex,
    showExplanation,
    score,
    practiceQuestions,
    showQuestions,
    loading, // New state
    error,   // New state
    handleAnswer,
    nextQuestion,
    resetQuiz,
    startPractice
  } = usePracticeQuiz();

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

  const handleNavigation = (view: string) => {
    switch (view) {
      case 'dashboard':
        goHome();
        break;
      case 'redacao':
        startRedacao();
        break;
      case 'simulados':
        setCurrentView('simulados');
        break;
      case 'questoes':
        // When navigating to 'questoes', immediately start fetching them
        startPractice();
        setCurrentView('questoes');
        break;
      case 'desempenho':
        setCurrentView('desempenho');
        break;
      case 'tutor': // Add tutor view navigation
        setCurrentView('tutor');
        break;
      default:
        goHome();
    }
  };

  const renderPracticeQuiz = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Carregando questões...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-destructive/10 p-6 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <p className="text-lg font-semibold text-destructive mb-2">Ocorreu um erro</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={startPractice}>Tentar Novamente</Button>
        </div>
      );
    }

    if (showQuestions && practiceQuestions.length > 0) {
      return (
        <PracticeQuiz
          currentQuestionIndex={currentQuestionIndex}
          showExplanation={showExplanation}
          score={score}
          practiceQuestions={practiceQuestions}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          onReset={resetQuiz}
        />
      );
    }
    
    // This case can be a fallback or initial state before practice starts
    return null;
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'simulados':
        return (
          <SimuladosView 
            selectedConfig={selectedConfig}
            onStartSimulado={startSimulado}
          />
        );
      case 'desempenho':
        return <DesempenhoView selectedConfig={selectedConfig} />;
      case 'tutor': // Add tutor view rendering
        return <TutorView />;
      case 'questoes':
        return renderPracticeQuiz();
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-1">
              <UniversitySelector onSelectionChange={handleSelectionChange} />
            </div>

            {/* Dashboard/Questions */}
            <div className="lg:col-span-2">
              <VestibularDashboard 
                selectedConfig={selectedConfig} 
                onStartSimulado={startSimulado}
                onStartRedacao={startRedacao}
                usedQuestionIds={usedQuestionIds}
                onResetUsedQuestions={resetUsedQuestions}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout 
      onStartQuiz={() => handleNavigation('questoes')} 
      onStartSimulado={startSimulado}
      currentView={currentView}
      onNavigate={handleNavigation}
      showHero={currentView === 'dashboard'}
    >
      {renderCurrentView()}
    </MainLayout>
  );
};

export default Index;
