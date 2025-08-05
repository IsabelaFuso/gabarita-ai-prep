import { Question } from "../types";

export const extraQuestions: Question[] = [
  // Espanhol
  {
    id: "101",
    institution: "ENEM",
    year: 2023,
    subject: "Espanhol",
    topic: "Comprensión de Texto",
    statement: "Lee el siguiente fragmento: 'La tecnología ha transformado la comunicación, pero también ha generado nuevos desafíos para la privacidad.' ¿Cuál es la idea principal del texto?",
    alternatives: [
      "La tecnología solo trae beneficios.",
      "La comunicación moderna es perfecta.",
      "La tecnología tiene un impacto dual en la comunicación y la privacidad.",
      "La privacidad ya no es importante.",
      "Los desafíos tecnológicos son insuperables."
    ],
    correctAnswer: 2,
    explanation: "El texto presenta dos caras de la tecnología: la transformación positiva de la comunicación y los desafíos negativos para la privacidad, mostrando un impacto dual."
  },
  {
    id: "102",
    institution: "FUVEST",
    year: 2024,
    subject: "Espanhol",
    topic: "Vocabulario",
    statement: "En la frase 'El perro es un animal leal', ¿qué significa la palabra 'leal'?",
    alternatives: [
      "Fiel",
      "Rápido",
      "Grande",
      "Peligroso",
      "Tranquilo"
    ],
    correctAnswer: 0,
    explanation: "'Leal' es sinónimo de 'fiel', indicando una cualidad de lealtad y fidelidad."
  },

  // Matemática
  {
    id: "103",
    institution: "UNICAMP",
    year: 2023,
    subject: "Matemática",
    topic: "Logaritmos",
    statement: "Se log₂(x) = 5, qual é o valor de x?",
    alternatives: ["10", "25", "32", "64", "128"],
    correctAnswer: 2,
    explanation: "A definição de logaritmo diz que se logₐ(b) = c, então aᶜ = b. Portanto, se log₂(x) = 5, então x = 2⁵ = 32."
  },

  // Física
  {
    id: "104",
    institution: "ENEM",
    year: 2022,
    subject: "Física",
    topic: "Termodinâmica",
    statement: "Qual é a primeira lei da termodinâmica?",
    alternatives: [
      "A energia total de um sistema isolado permanece constante.",
      "A entropia de um sistema isolado tende a aumentar.",
      "A energia não pode ser criada nem destruída, apenas transformada.",
      "É impossível atingir o zero absoluto.",
      "A pressão de um gás é inversamente proporcional ao seu volume."
    ],
    correctAnswer: 2,
    explanation: "A primeira lei da termodinâmica é uma declaração do princípio da conservação de energia, afirmando que a variação da energia interna de um sistema é igual à diferença entre o calor trocado com o ambiente e o trabalho realizado."
  },

  // Química
  {
    id: "105",
    institution: "UEM",
    year: 2023,
    subject: "Química",
    topic: "Química Orgânica",
    statement: "Qual dos seguintes compostos é um álcool?",
    alternatives: [
      "CH₃-O-CH₃",
      "CH₃-COOH",
      "CH₃-CH₂-OH",
      "CH₃-CHO",
      "CH₃-CO-CH₃"
    ],
    correctAnswer: 2,
    explanation: "Um álcool é caracterizado pela presença do grupo hidroxila (-OH) ligado a um carbono saturado. CH₃-CH₂-OH é o etanol, um álcool."
  },

  // Biologia
  {
    id: "106",
    institution: "FUVEST",
    year: 2024,
    subject: "Biologia",
    topic: "Evolução",
    statement: "A seleção natural, proposta por Charles Darwin, é o principal mecanismo da evolução. Ela atua sobre:",
    alternatives: [
      "A diversidade de espécies.",
      "As mutações genéticas aleatórias.",
      "A variabilidade fenotípica dentro de uma população.",
      "A herança de caracteres adquiridos.",
      "A competição entre indivíduos de espécies diferentes."
    ],
    correctAnswer: 2,
    explanation: "A seleção natural atua sobre as variações fenotípicas (características observáveis) dos indivíduos de uma população, favorecendo aqueles mais adaptados ao ambiente."
  },

  // História
  {
    id: "107",
    institution: "ENEM",
    year: 2023,
    subject: "História",
    topic: "Guerra Fria",
    statement: "A Guerra Fria foi um período de tensão geopolítica entre quais duas superpotências?",
    alternatives: [
      "Alemanha e Japão",
      "Reino Unido e França",
      "China e Índia",
      "Estados Unidos e União Soviética",
      "Brasil e Argentina"
    ],
    correctAnswer: 3,
    explanation: "A Guerra Fria (1947-1991) foi caracterizada pela rivalidade ideológica, política, militar e econômica entre os Estados Unidos (capitalismo) e a União Soviética (comunismo)."
  }
];
