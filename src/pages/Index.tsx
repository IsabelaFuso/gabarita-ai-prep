
import { UniversitySelector } from "@/components/UniversitySelector";
import { VestibularDashboard } from "@/components/VestibularDashboard";
import { SimuladoCompleto } from "@/components/SimuladoCompleto";
import { ResultadoSimulado } from "@/components/ResultadoSimulado";
import { RedacaoArea } from "@/components/RedacaoArea";
import { MainLayout } from "@/components/MainLayout";
import { PracticeQuiz } from "@/components/PracticeQuiz";
import { DesempenhoView } from "@/components/DesempenhoView";
import { SimuladosView } from "@/components/SimuladosView";
import { QuestionBankView } from "@/components/QuestionBankView";
import { useAppState } from "@/hooks/useAppState";
import { useQuestionManager } from "@/hooks/useQuestionManager";
import { useSimuladoManager } from "@/hooks/useSimuladoManager";
import { usePracticeQuiz } from "@/hooks/usePracticeQuiz";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RankingView } from "@/components/RankingView";
import { useCallback } from "react";
import { SimuladoDetailView } from "@/components/SimuladoDetailView";
import { AccountView } from "@/components/AccountView";

const Index = () => {
  const { user } = useAuth();
  
  // Custom hooks for state management
  const {
    selectedConfig,
    currentView,
    simuladoResults,
    selectedSimuladoId,
    handleSelectionChange,
    goHome,
    startRedacao,
    setCurrentView,
    setSimuladoResults,
    viewSimuladoDetails,
  } = useAppState();

  // This is still needed for the full simulado feature
  const {
    usedQuestionIds,
    generateQuestions,
    resetUsedQuestions
  } = useQuestionManager(selectedConfig, user);

  const triggerConfetti = useCallback(() => {
    // Confetti implementation here
    console.log("🎉 Confetti triggered!");
  }, []);

  const {
    currentQuestions,
    loadingSimulado,
    startSimulado,
    handleSimuladoFinish,
    handleSimuladoExit,
    restartSimulado
  } = useSimuladoManager(generateQuestions, setCurrentView, setSimuladoResults, user, triggerConfetti);

  // Updated usePracticeQuiz hook, no longer needs generateQuestions
  const {
    currentQuestionIndex,
    showExplanation,
    score,
    practiceQuestions,
    showQuestions,
    loading: loadingPracticeQuiz,
    error,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    startPractice
  } = usePracticeQuiz();

  const handleNavigation = useCallback((view: string) => {
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
        startPractice();
        setCurrentView('questoes');
        break;
      case 'desempenho':
        setCurrentView('desempenho');
        break;
      case 'tutor':
        setCurrentView('tutor');
        break;
      case 'account':
        setCurrentView('account');
        break;
      default:
        goHome();
    }
  }, [goHome, startRedacao, setCurrentView, startPractice]);

  // Renderizar diferentes views
  if (currentView === 'redacao') {
    return (
      <RedacaoArea
        onBack={goHome}
      />
    );
  }

  if (currentView === 'simulado') {
    if (loadingSimulado) {
      return (
        <MainLayout 
          onStartQuiz={() => handleNavigation('questoes')} 
          onStartSimulado={() => startSimulado('completo')}
          currentView={currentView}
          onNavigate={handleNavigation}
          showHero={false}
        >
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Carregando simulado...</p>
          </div>
        </MainLayout>
      );
    }
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

  if (currentView === 'simulado_details' && selectedSimuladoId) {
    return (
      <MainLayout 
        onStartQuiz={() => handleNavigation('questoes')} 
        onStartSimulado={() => startSimulado('completo')}
        currentView={currentView}
        onNavigate={handleNavigation}
        showHero={false}
      >
        <SimuladoDetailView 
          simuladoId={selectedSimuladoId} 
          onBack={() => setCurrentView('account')} 
        />
      </MainLayout>
    );
  }

  const renderPracticeQuiz = () => {
    if (loadingPracticeQuiz) {
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
          userAnswers={[]}
          onAnswer={handleAnswer}
          onNext={nextQuestion}
          onReset={resetQuiz}
        />
      );
    }
    
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
        return <DesempenhoView />;
      case 'banco-questoes':
        return <QuestionBankView onBack={() => setCurrentView('dashboard')} />;
      case 'tutor':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Tutor IA</h2>
            <p>Em breve: Seu tutor pessoal de estudos!</p>
          </div>
        );
      case 'questoes':
        return renderPracticeQuiz();
      case 'account':
        return <AccountView onViewSimuladoDetails={viewSimuladoDetails} />;
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            <aside className="w-full lg:w-96 lg:order-last">
              <div className="sticky top-8 h-full">
                <RankingView />
              </div>
            </aside>
            <main className="flex-1 space-y-8">
              <UniversitySelector selectedConfig={selectedConfig} onSelectionChange={handleSelectionChange} />
              <VestibularDashboard 
                selectedConfig={selectedConfig} 
                currentView={currentView}
                onNavigate={handleNavigation}
                onStartSimulado={(type) => {
                  if (type === 'por_materia' || type === 'minhas_dificuldades' || type === 'questoes_comentadas') {
                    setCurrentView('banco-questoes');
                  } else {
                    startSimulado(type);
                  }
                }}
                onStartRedacao={startRedacao}
                usedQuestionIds={usedQuestionIds}
                onResetUsedQuestions={resetUsedQuestions}
              />
            </main>
          </div>
        );
    }
  };

    return (
      <MainLayout 
        onStartQuiz={() => handleNavigation('questoes')} 
        onStartSimulado={() => startSimulado('completo')}
        currentView={currentView}
        onNavigate={handleNavigation}
        showHero={currentView === 'dashboard'}
      >
        {renderCurrentView()}
      </MainLayout>
    );
};

export default Index;
