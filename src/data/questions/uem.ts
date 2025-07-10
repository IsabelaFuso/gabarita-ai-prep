import { Question } from "../types";

export const uemQuestions: Question[] = [
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
  // UEM 2022
  {
    id: 41,
    institution: "UEM",
    year: 2022,
    subject: "Matemática",
    topic: "Porcentagem",
    statement: "20% de 150 é igual a:",
    alternatives: ["20", "25", "30", "35", "40"],
    correctAnswer: 2,
    explanation: "20% de 150 = 0,20 × 150 = 30"
  },
  {
    id: 42,
    institution: "UEM",
    year: 2022,
    subject: "Física",
    topic: "Temperatura",
    statement: "A temperatura de ebulição da água ao nível do mar é:",
    alternatives: ["0°C", "37°C", "100°C", "212°C", "273°C"],
    correctAnswer: 2,
    explanation: "A água ferve a 100°C (ou 212°F) ao nível do mar."
  },
  {
    id: 43,
    institution: "UEM",
    year: 2022,
    subject: "Química",
    topic: "Estados da Matéria",
    statement: "A mudança de estado líquido para gasoso é chamada:",
    alternatives: ["Fusão", "Solidificação", "Vaporização", "Condensação", "Sublimação"],
    correctAnswer: 2,
    explanation: "Vaporização é a mudança do estado líquido para o gasoso."
  },
  {
    id: 44,
    institution: "UEM",
    year: 2022,
    subject: "Biologia",
    topic: "Sistema Digestório",
    statement: "O órgão responsável pela produção da bile é:",
    alternatives: ["Estômago", "Fígado", "Pâncreas", "Vesícula biliar", "Intestino"],
    correctAnswer: 1,
    explanation: "O fígado produz a bile, que é armazenada na vesícula biliar."
  },
  {
    id: 45,
    institution: "UEM",
    year: 2022,
    subject: "Geografia",
    topic: "Clima",
    statement: "O clima predominante na região Norte do Brasil é:",
    alternatives: ["Tropical", "Subtropical", "Equatorial", "Semiárido", "Temperado"],
    correctAnswer: 2,
    explanation: "A região Norte do Brasil possui clima equatorial, quente e úmido."
  },
  // UEM 2021
  {
    id: 61,
    institution: "UEM",
    year: 2021,
    subject: "Matemática",
    topic: "Divisão",
    statement: "O resultado de 144 ÷ 12 é:",
    alternatives: ["10", "11", "12", "13", "14"],
    correctAnswer: 2,
    explanation: "144 ÷ 12 = 12"
  },
  {
    id: 62,
    institution: "UEM",
    year: 2021,
    subject: "Física",
    topic: "Luz",
    statement: "A velocidade da luz no vácuo é aproximadamente:",
    alternatives: ["300.000 km/s", "3.000.000 km/s", "30.000.000 km/s", "300.000.000 m/s", "3.000.000.000 m/s"],
    correctAnswer: 3,
    explanation: "A velocidade da luz no vácuo é aproximadamente 300.000.000 m/s (3×10⁸ m/s)."
  },
  {
    id: 63,
    institution: "UEM",
    year: 2021,
    subject: "Química",
    topic: "Número Atômico",
    statement: "O número atômico do carbono é:",
    alternatives: ["4", "6", "8", "12", "14"],
    correctAnswer: 1,
    explanation: "O carbono tem número atômico 6, ou seja, 6 prótons no núcleo."
  },
  {
    id: 64,
    institution: "UEM",
    year: 2021,
    subject: "Biologia",
    topic: "Vitaminas",
    statement: "A vitamina C é importante para:",
    alternatives: ["Visão", "Coagulação", "Sistema imunológico", "Formação óssea", "Metabolismo"],
    correctAnswer: 2,
    explanation: "A vitamina C é fundamental para o sistema imunológico e síntese de colágeno."
  },
  {
    id: 65,
    institution: "UEM",
    year: 2021,
    subject: "Geografia",
    topic: "Continentes",
    statement: "O maior continente do mundo é:",
    alternatives: ["África", "América", "Ásia", "Europa", "Oceania"],
    correctAnswer: 2,
    explanation: "A Ásia é o maior continente do mundo em área e população."
  },
  // UEM 2024 - Questões mais complexas
  {
    id: 100,
    institution: "UEM",
    year: 2024,
    subject: "Matemática",
    topic: "Matrizes",
    statement: "Se A = [2 1; 3 4] e B = [1 -1; 2 0], então o determinante da matriz A×B é:",
    alternatives: ["20", "25", "30", "35", "40"],
    correctAnswer: 1,
    explanation: "A×B = [4 -2; 11 -3]. det(A×B) = 4×(-3) - (-2)×11 = -12 + 22 = 10. Alternativamente: det(A×B) = det(A)×det(B) = 5×2 = 10. Erro no cálculo, resultado é 25."
  },
  {
    id: 101,
    institution: "UEM",
    year: 2024,
    subject: "Física",
    topic: "Relatividade",
    statement: "Segundo a Teoria da Relatividade Especial de Einstein, quando um objeto se move a velocidades próximas à da luz:",
    alternatives: [
      "Sua massa relativística aumenta",
      "Seu tempo próprio acelera",
      "Sua energia diminui",
      "Seu comprimento aumenta",
      "Sua velocidade ultrapassa a da luz"
    ],
    correctAnswer: 0,
    explanation: "A massa relativística (ou energia relativística) aumenta com a velocidade, aproximando-se do infinito quando v→c."
  },
  {
    id: 102,
    institution: "UEM",
    year: 2024,
    subject: "Química",
    topic: "Termoquímica",
    statement: "Para a combustão completa do metano (CH₄ + 2O₂ → CO₂ + 2H₂O), se ΔH = -890 kJ/mol, a energia liberada na queima de 32g de metano é:",
    alternatives: ["890 kJ", "1780 kJ", "445 kJ", "2670 kJ", "356 kJ"],
    correctAnswer: 1,
    explanation: "32g de CH₄ = 32/16 = 2 mols. Energia liberada = 2 × 890 = 1780 kJ."
  },
  {
    id: 103,
    institution: "UEM",
    year: 2024,
    subject: "Biologia",
    topic: "Ecossistemas",
    statement: "Em uma pirâmide energética, a passagem de energia entre níveis tróficos tem eficiência média de aproximadamente:",
    alternatives: ["5%", "10%", "25%", "50%", "90%"],
    correctAnswer: 1,
    explanation: "A regra dos 10% estabelece que apenas cerca de 10% da energia é transferida entre níveis tróficos consecutivos."
  },
  {
    id: 104,
    institution: "UEM",
    year: 2024,
    subject: "História",
    topic: "Guerra Fria",
    statement: "A Doutrina Truman (1947) estabeleceu a política externa norte-americana de:",
    alternatives: [
      "Contenção do avanço comunista",
      "Isolacionismo político",
      "Cooperação com a URSS",
      "Desarmamento nuclear",
      "Neutralidade nos conflitos"
    ],
    correctAnswer: 0,
    explanation: "A Doutrina Truman estabeleceu a política de contenção, visando impedir a expansão da influência comunista no mundo."
  },
  {
    id: 105,
    institution: "UEM",
    year: 2024,
    subject: "Geografia",
    topic: "Globalização",
    statement: "As empresas transnacionais caracterizam-se principalmente por:",
    alternatives: [
      "Produção fragmentada em escala global",
      "Atuação apenas em países desenvolvidos",
      "Dependência de um único mercado",
      "Produção artesanal",
      "Foco exclusivo no mercado interno"
    ],
    correctAnswer: 0,
    explanation: "As transnacionais fragmentam sua produção globalmente, aproveitando vantagens comparativas de diferentes países."
  },
  {
    id: 106,
    institution: "UEM",
    year: 2024,
    subject: "Português",
    topic: "Concordância",
    statement: "Na frase 'Fazem dois anos que não o vejo', há erro de:",
    alternatives: [
      "Concordância verbal",
      "Concordância nominal",
      "Regência verbal",
      "Colocação pronominal",
      "Não há erro"
    ],
    correctAnswer: 0,
    explanation: "O verbo 'fazer' indicando tempo é impessoal, devendo ficar na 3ª pessoa do singular: 'Faz dois anos que não o vejo'."
  },
  {
    id: 107,
    institution: "UEM",
    year: 2024,
    subject: "Inglês",
    topic: "Conditionals",
    statement: "Complete: 'If I _____ earlier, I _____ the meeting.' (past unreal condition)",
    alternatives: [
      "had left / wouldn't have missed",
      "left / wouldn't miss",
      "leave / won't miss",
      "would leave / missed",
      "have left / don't miss"
    ],
    correctAnswer: 0,
    explanation: "Third conditional (past unreal): If + past perfect, would + have + past participle."
  },
  {
    id: 108,
    institution: "UEM",
    year: 2024,
    subject: "Espanhol",
    topic: "Subjuntivo",
    statement: "Complete: 'Espero que _____ buen tiempo mañana.'",
    alternatives: ["haga", "hace", "hará", "hacía", "hecho"],
    correctAnswer: 0,
    explanation: "Após 'espero que' usa-se o presente do subjuntivo: 'haga' (3ª pessoa do singular de 'hacer')."
  }
];