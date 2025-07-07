export interface Question {
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

export const questionsBank: Question[] = [
  // ENEM - Biologia
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
    id: 3,
    institution: "ENEM",
    year: 2023,
    subject: "Biologia",
    topic: "Ecologia",
    statement: "Em uma cadeia alimentar, os organismos que ocupam o primeiro nível trófico são:",
    alternatives: [
      "Produtores primários (plantas)",
      "Consumidores primários (herbívoros)",
      "Consumidores secundários (carnívoros)",
      "Decompositores",
      "Consumidores terciários"
    ],
    correctAnswer: 0,
    explanation: "Os produtores primários, principalmente as plantas, ocupam o primeiro nível trófico pois convertem energia solar em energia química através da fotossíntese."
  },

  // FUVEST - Matemática
  {
    id: 4,
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
    id: 5,
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
    id: 6,
    institution: "FUVEST",
    year: 2023,
    subject: "Matemática",
    topic: "Logaritmos",
    statement: "Se log₂(x) = 3, então o valor de x é:",
    alternatives: ["3", "6", "8", "9", "16"],
    correctAnswer: 2,
    explanation: "Se log₂(x) = 3, então 2³ = x, portanto x = 8."
  },

  // UEM - Química
  {
    id: 7,
    institution: "UEM",
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
    id: 8,
    institution: "UEM",
    year: 2023,
    subject: "Química",
    topic: "Estequiometria",
    statement: "Na reação 2H₂ + O₂ → 2H₂O, quantos moles de água são produzidos a partir de 4 moles de hidrogênio?",
    alternatives: ["2 moles", "4 moles", "6 moles", "8 moles", "10 moles"],
    correctAnswer: 1,
    explanation: "Pela estequiometria da reação, a proporção é 2:2, então 4 moles de H₂ produzem 4 moles de H₂O."
  },
  {
    id: 9,
    institution: "UEM",
    year: 2023,
    subject: "Química",
    topic: "Química Orgânica",
    statement: "Qual é a fórmula molecular do metano?",
    alternatives: ["CH₄", "C₂H₆", "C₃H₈", "C₄H₁₀", "C₅H₁₂"],
    correctAnswer: 0,
    explanation: "O metano é o hidrocarboneto mais simples, com fórmula molecular CH₄."
  },

  // ENEM - Física
  {
    id: 10,
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
    id: 11,
    institution: "ENEM",
    year: 2023,
    subject: "Física",
    topic: "Eletricidade",
    statement: "A resistência elétrica de um condutor é diretamente proporcional:",
    alternatives: [
      "ao comprimento e inversamente proporcional à área da seção transversal",
      "à área da seção transversal e inversamente proporcional ao comprimento",
      "ao comprimento e à área da seção transversal",
      "à temperatura apenas",
      "à corrente elétrica apenas"
    ],
    correctAnswer: 0,
    explanation: "Pela lei de Ohm para materiais, R = ρL/A, onde R é a resistência, L o comprimento, A a área da seção e ρ a resistividade."
  },

  // ENEM - Português
  {
    id: 12,
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
    id: 13,
    institution: "ENEM",
    year: 2023,
    subject: "Português",
    topic: "Gramática",
    statement: "Na frase 'Os meninos brincavam no parque', qual é a função sintática do termo 'no parque'?",
    alternatives: [
      "Adjunto adverbial de lugar",
      "Objeto direto",
      "Objeto indireto",
      "Predicativo do sujeito",
      "Aposto"
    ],
    correctAnswer: 0,
    explanation: "'No parque' é um adjunto adverbial de lugar, pois indica onde ocorreu a ação de brincar."
  },

  // UNICAMP - História
  {
    id: 14,
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
    id: 15,
    institution: "UNICAMP",
    year: 2023,
    subject: "História",
    topic: "História Mundial",
    statement: "A Revolução Industrial iniciada na Inglaterra no século XVIII caracterizou-se principalmente por:",
    alternatives: [
      "A mecanização da produção e o surgimento das fábricas",
      "O fim da propriedade privada",
      "A volta ao sistema feudal",
      "A diminuição da população urbana",
      "O fortalecimento da agricultura de subsistência"
    ],
    correctAnswer: 0,
    explanation: "A Revolução Industrial foi marcada pela transição da produção artesanal para a produção mecanizada em fábricas, transformando profundamente a sociedade."
  },

  // ENEM - Geografia
  {
    id: 16,
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
    id: 17,
    institution: "ENEM",
    year: 2023,
    subject: "Geografia",
    topic: "Geografia Urbana",
    statement: "O processo de conurbação urbana ocorre quando:",
    alternatives: [
      "Duas ou mais cidades se interligam fisicamente formando uma mancha urbana contínua",
      "Uma cidade diminui sua população",
      "Ocorre migração rural-urbana",
      "Há expansão da agricultura urbana",
      "Diminui a densidade demográfica"
    ],
    correctAnswer: 0,
    explanation: "Conurbação é o processo pelo qual cidades próximas crescem e se fundem fisicamente, formando uma mancha urbana contínua."
  },

  // UEM - Filosofia
  {
    id: 18,
    institution: "UEM",
    year: 2023,
    subject: "Filosofia",
    topic: "Filosofia Antiga",
    statement: "Para Aristóteles, a virtude ética é:",
    alternatives: [
      "O meio-termo entre dois extremos viciosos",
      "A busca pelo prazer máximo",
      "A negação de todos os desejos",
      "O conhecimento absoluto da verdade",
      "A submissão total à autoridade"
    ],
    correctAnswer: 0,
    explanation: "Aristóteles definiu a virtude ética como o meio-termo (mediania) entre dois extremos viciosos: o excesso e a falta."
  },

  // FUVEST - Literatura
  {
    id: 19,
    institution: "FUVEST",
    year: 2023,
    subject: "Literatura",
    topic: "Romantismo",
    statement: "José de Alencar é considerado um dos principais representantes do Romantismo brasileiro. Qual das seguintes obras é de sua autoria?",
    alternatives: [
      "O Guarani",
      "Dom Casmurro",
      "O Cortiço",
      "Memórias Póstumas de Brás Cubas",
      "Casa Grande & Senzala"
    ],
    correctAnswer: 0,
    explanation: "'O Guarani' é uma das principais obras de José de Alencar, representando o indianismo romântico brasileiro."
  },

  // ENEM - Sociologia
  {
    id: 20,
    institution: "ENEM",
    year: 2023,
    subject: "Sociologia",
    topic: "Estratificação Social",
    statement: "Max Weber identificou três dimensões da estratificação social. São elas:",
    alternatives: [
      "Classe, status e poder",
      "Economia, política e cultura",
      "Trabalho, capital e terra",
      "Individual, coletivo e social",
      "Tradicional, carismático e legal"
    ],
    correctAnswer: 0,
    explanation: "Weber identificou três dimensões da estratificação: classe (econômica), status (prestígio social) e poder (capacidade de influência)."
  },

  // UEM - Inglês
  {
    id: 21,
    institution: "UEM",
    year: 2023,
    subject: "Inglês",
    topic: "Grammar",
    statement: "Complete the sentence: 'If I _____ rich, I would travel around the world.'",
    alternatives: ["were", "was", "am", "will be", "have been"],
    correctAnswer: 0,
    explanation: "Em conditional sentences do tipo 2 (situações hipotéticas), usa-se 'were' para todas as pessoas após 'if'."
  },

  // UNICAMP - Espanhol
  {
    id: 22,
    institution: "UNICAMP",
    year: 2023,
    subject: "Espanhol",
    topic: "Gramática",
    statement: "¿Cuál es la forma correcta del verbo 'ser' en presente para 'nosotros'?",
    alternatives: ["somos", "sois", "son", "eres", "es"],
    correctAnswer: 0,
    explanation: "La conjugación del verbo 'ser' en presente para 'nosotros' es 'somos'."
  },

  // FUVEST - Física
  {
    id: 23,
    institution: "FUVEST",
    year: 2023,
    subject: "Física",
    topic: "Termodinâmica",
    statement: "A primeira lei da termodinâmica estabelece que:",
    alternatives: [
      "A energia interna de um sistema varia pela diferença entre calor absorvido e trabalho realizado",
      "A entropia de um sistema isolado sempre aumenta",
      "É impossível construir uma máquina térmica com 100% de eficiência",
      "A temperatura absoluta zero é inalcançável",
      "A pressão é inversamente proporcional ao volume"
    ],
    correctAnswer: 0,
    explanation: "A primeira lei da termodinâmica (ΔU = Q - W) estabelece a conservação de energia em processos termodinâmicos."
  },

  // UEM - Biologia
  {
    id: 24,
    institution: "UEM",
    year: 2023,
    subject: "Biologia",
    topic: "Evolução",
    statement: "O conceito de seleção natural, proposto por Darwin, baseia-se na ideia de que:",
    alternatives: [
      "Indivíduos mais adaptados ao ambiente têm maior chance de sobreviver e reproduzir",
      "Todas as espécies foram criadas simultaneamente",
      "As características adquiridas durante a vida são herdadas",
      "A evolução ocorre por saltos bruscos",
      "O ambiente não influencia a evolução das espécies"
    ],
    correctAnswer: 0,
    explanation: "A seleção natural baseia-se no princípio de que indivíduos com características mais vantajosas para o ambiente têm maior sucesso reprodutivo."
  },

  // ENEM - Matemática
  {
    id: 25,
    institution: "ENEM",
    year: 2023,
    subject: "Matemática",
    topic: "Estatística",
    statement: "Em uma turma de 30 alunos, as notas obtidas em uma prova foram: 6, 7, 8, 7, 9, 6, 8, 7, 9, 8. A moda desta distribuição é:",
    alternatives: ["6", "7", "8", "9", "Não há moda"],
    correctAnswer: 1,
    explanation: "A moda é o valor que aparece com maior frequência. Neste caso, a nota 7 aparece mais vezes."
  }
];

// Função para filtrar questões por critérios
export const filterQuestions = (filters: {
  institution?: string;
  subject?: string;
  topic?: string;
  year?: number;
}) => {
  return questionsBank.filter(question => {
    if (filters.institution && question.institution !== filters.institution) return false;
    if (filters.subject && question.subject !== filters.subject) return false;
    if (filters.topic && question.topic !== filters.topic) return false;
    if (filters.year && question.year !== filters.year) return false;
    return true;
  });
};

// Função para obter questões aleatórias
export const getRandomQuestions = (count: number, filters?: {
  institution?: string;
  subject?: string;
  topic?: string;
  year?: number;
}) => {
  const filteredQuestions = filters ? filterQuestions(filters) : questionsBank;
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Função para obter estatísticas do banco de questões
export const getQuestionsStats = () => {
  const institutions = [...new Set(questionsBank.map(q => q.institution))];
  const subjects = [...new Set(questionsBank.map(q => q.subject))];
  const topics = [...new Set(questionsBank.map(q => q.topic))];
  const years = [...new Set(questionsBank.map(q => q.year))];

  return {
    totalQuestions: questionsBank.length,
    institutions: institutions.length,
    subjects: subjects.length,
    topics: topics.length,
    years: years.length,
    breakdown: {
      byInstitution: institutions.map(inst => ({
        institution: inst,
        count: questionsBank.filter(q => q.institution === inst).length
      })),
      bySubject: subjects.map(subj => ({
        subject: subj,
        count: questionsBank.filter(q => q.subject === subj).length
      }))
    }
  };
};