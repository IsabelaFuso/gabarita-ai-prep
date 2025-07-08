import { UniversitySelector } from "@/components/UniversitySelector";
import { VestibularDashboard } from "@/components/VestibularDashboard";
import { SimuladoCompleto } from "@/components/SimuladoCompleto";
import { ResultadoSimulado } from "@/components/ResultadoSimulado";
import { RedacaoArea } from "@/components/RedacaoArea";
import { MainLayout } from "@/components/MainLayout";
import { PracticeQuiz } from "@/components/PracticeQuiz";
import { useAppState } from "@/hooks/useAppState";
import { useQuestionManager } from "@/hooks/useQuestionManager";
import { useSimuladoManager } from "@/hooks/useSimuladoManager";
import { usePracticeQuiz } from "@/hooks/usePracticeQuiz";

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

  const {
    currentQuestionIndex,
    showExplanation,
    score,
    practiceQuestions,
    showQuestions,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    startPractice
  } = usePracticeQuiz(generateQuestions);

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
    <MainLayout>
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
            <PracticeQuiz
              currentQuestionIndex={currentQuestionIndex}
              showExplanation={showExplanation}
              score={score}
              practiceQuestions={practiceQuestions}
              onAnswer={handleAnswer}
              onNext={nextQuestion}
              onReset={resetQuiz}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;