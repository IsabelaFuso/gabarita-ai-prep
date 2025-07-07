import { useState } from "react";
import { Header } from "@/components/Header";
import { UniversitySelector } from "@/components/UniversitySelector";
import { VestibularDashboard } from "@/components/VestibularDashboard";
import { QuestionCard } from "@/components/QuestionCard";
import { SimuladoCompleto } from "@/components/SimuladoCompleto";
import { ResultadoSimulado } from "@/components/ResultadoSimulado";

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
  },
  {
    id: 3,
    institution: "ENEM",
    year: 2023,
    subject: "Português",
    topic: "Interpretação de Texto",
    statement: "Leia o texto a seguir e responda: 'A literatura brasileira contemporânea tem se destacado no cenário internacional.' Qual das alternativas melhor define a característica mencionada?",
    alternatives: [
      "O reconhecimento mundial da qualidade literária nacional.",
      "A tradução de obras estrangeiras para o português.",
      "A influência da literatura europeia no Brasil.",
      "A diminuição da produção literária nacional.",
      "O foco exclusivo em temas regionais."
    ],
    correctAnswer: 0,
    explanation: "O destaque no cenário internacional refere-se ao reconhecimento mundial da qualidade e relevância da literatura brasileira contemporânea."
  },
  {
    id: 4,
    institution: "FUVEST",
    year: 2023,
    subject: "Química",
    topic: "Reações Orgânicas",
    statement: "Na reação de combustão completa do etanol (C₂H₅OH), quais são os produtos formados?",
    alternatives: [
      "CO₂ e H₂O",
      "CO e H₂O",
      "C e H₂O",
      "CO₂ e H₂",
      "C₂H₄ e O₂"
    ],
    correctAnswer: 0,
    explanation: "Na combustão completa do etanol, este reage com oxigênio produzindo dióxido de carbono (CO₂) e água (H₂O) como produtos."
  },
  {
    id: 5,
    institution: "ENEM",
    year: 2023,
    subject: "Física",
    topic: "Cinemática",
    statement: "Um objeto é lançado verticalmente para cima com velocidade inicial de 20 m/s. Considerando g = 10 m/s², qual é a altura máxima atingida?",
    alternatives: ["10 m", "15 m", "20 m", "25 m", "30 m"],
    correctAnswer: 2,
    explanation: "Usando a equação v² = v₀² - 2gh, onde v = 0 no ponto mais alto: 0 = 400 - 20h, logo h = 20 m."
  },
  {
    id: 6,
    institution: "UNICAMP",
    year: 2023,
    subject: "História",
    topic: "Brasil República",
    statement: "A Era Vargas (1930-1945) foi marcada por importantes transformações sociais e econômicas. Qual foi uma característica marcante deste período?",
    alternatives: [
      "A criação das leis trabalhistas e consolidação dos direitos do trabalhador.",
      "A total abertura econômica ao mercado internacional.",
      "A descentralização total do poder político.",
      "A extinção completa do setor industrial.",
      "A implementação do sistema parlamentarista."
    ],
    correctAnswer: 0,
    explanation: "O governo Vargas foi responsável pela criação da CLT (Consolidação das Leis do Trabalho) e pela implementação de importantes direitos trabalhistas no Brasil."
  },
  {
    id: 7,
    institution: "ENEM",
    year: 2023,
    subject: "Geografia",
    topic: "Climatologia",
    statement: "O fenômeno El Niño é caracterizado por:",
    alternatives: [
      "Aquecimento anômalo das águas do Pacífico Equatorial.",
      "Resfriamento das águas do Atlântico Sul.",
      "Intensificação dos ventos alísios.",
      "Diminuição da temperatura global.",
      "Aumento das chuvas na região Nordeste do Brasil."
    ],
    correctAnswer: 0,
    explanation: "El Niño é caracterizado pelo aquecimento anômalo das águas superficiais do Oceano Pacífico Equatorial, causando alterações climáticas globais."
  },
  {
    id: 8,
    institution: "FUVEST",
    year: 2023,
    subject: "Matemática",
    topic: "Geometria Analítica",
    statement: "A distância entre os pontos A(2, 3) e B(6, 6) é:",
    alternatives: ["3", "4", "5", "6", "7"],
    correctAnswer: 2,
    explanation: "Usando a fórmula da distância: d = √[(6-2)² + (6-3)²] = √[16 + 9] = √25 = 5."
  },
  {
    id: 9,
    institution: "ENEM",
    year: 2023,
    subject: "Biologia",
    topic: "Genética",
    statement: "No cruzamento entre dois indivíduos heterozigotos (Aa x Aa), qual é a probabilidade de nascimento de um descendente homozigoto recessivo?",
    alternatives: ["0%", "25%", "50%", "75%", "100%"],
    correctAnswer: 1,
    explanation: "No cruzamento Aa x Aa, a probabilidade de aa (homozigoto recessivo) é 1/4 ou 25%, seguindo a proporção mendeliana 1:2:1."
  },
  {
    id: 10,
    institution: "UNICAMP",
    year: 2023,
    subject: "Química",
    topic: "Estequiometria",
    statement: "Na reação 2H₂ + O₂ → 2H₂O, quantos moles de água são produzidos a partir de 4 moles de hidrogênio?",
    alternatives: ["2 moles", "4 moles", "6 moles", "8 moles", "10 moles"],
    correctAnswer: 1,
    explanation: "Pela estequiometria da reação, a proporção é 2:2, então 4 moles de H₂ produzem 4 moles de H₂O."
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'simulado' | 'resultado'>('dashboard');
  const [simuladoResults, setSimuladoResults] = useState<{
    answers: (number | null)[];
    timeUsed: number;
    score: number;
  } | null>(null);

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

  const startSimulado = () => {
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
    setCurrentView('simulado');
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setSimuladoResults(null);
  };

  // Renderizar diferentes views
  if (currentView === 'simulado') {
    return (
      <SimuladoCompleto
        questions={mockQuestions}
        timeLimit={120} // 2 horas
        onFinish={handleSimuladoFinish}
        onExit={handleSimuladoExit}
        selectedConfig={selectedConfig}
      />
    );
  }

  if (currentView === 'resultado' && simuladoResults) {
    return (
      <ResultadoSimulado
        questions={mockQuestions}
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
              />
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