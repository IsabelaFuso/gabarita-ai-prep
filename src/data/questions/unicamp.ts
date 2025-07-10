import { Question } from "../types";

export const unicampQuestions: Question[] = [
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
  // UNICAMP 2022
  {
    id: 36,
    institution: "UNICAMP",
    year: 2022,
    subject: "Matemática",
    topic: "Equações",
    statement: "A solução da equação 2x + 6 = 14 é:",
    alternatives: ["x = 2", "x = 4", "x = 6", "x = 8", "x = 10"],
    correctAnswer: 1,
    explanation: "2x + 6 = 14 → 2x = 8 → x = 4"
  },
  {
    id: 37,
    institution: "UNICAMP",
    year: 2022,
    subject: "Física",
    topic: "Energia",
    statement: "A energia cinética de um objeto é dada por:",
    alternatives: ["E = mc²", "E = mgh", "E = mv²/2", "E = Fd", "E = Pt"],
    correctAnswer: 2,
    explanation: "A energia cinética é dada por E = mv²/2"
  },
  {
    id: 38,
    institution: "UNICAMP",
    year: 2022,
    subject: "Química",
    topic: "pH",
    statement: "Uma solução com pH = 7 é:",
    alternatives: ["Ácida", "Básica", "Neutra", "Salina", "Tampão"],
    correctAnswer: 2,
    explanation: "pH = 7 indica uma solução neutra (nem ácida nem básica)."
  },
  {
    id: 39,
    institution: "UNICAMP",
    year: 2022,
    subject: "Biologia",
    topic: "Divisão Celular",
    statement: "A mitose é um processo de divisão celular que resulta em:",
    alternatives: [
      "2 células filhas com metade dos cromossomos",
      "4 células filhas com metade dos cromossomos",
      "2 células filhas idênticas à célula mãe",
      "4 células filhas idênticas à célula mãe",
      "1 célula filha com o dobro dos cromossomos"
    ],
    correctAnswer: 2,
    explanation: "A mitose produz 2 células filhas geneticamente idênticas à célula mãe."
  },
  {
    id: 40,
    institution: "UNICAMP",
    year: 2022,
    subject: "Literatura",
    topic: "Machado de Assis",
    statement: "A obra 'Dom Casmurro' foi escrita por:",
    alternatives: ["José de Alencar", "Machado de Assis", "Clarice Lispector", "Guimarães Rosa", "Carlos Drummond"],
    correctAnswer: 1,
    explanation: "'Dom Casmurro' é uma das principais obras de Machado de Assis."
  },
  // UNICAMP 2021
  {
    id: 56,
    institution: "UNICAMP",
    year: 2021,
    subject: "Matemática",
    topic: "Raiz Quadrada",
    statement: "A raiz quadrada de 64 é:",
    alternatives: ["6", "7", "8", "9", "10"],
    correctAnswer: 2,
    explanation: "√64 = 8, pois 8² = 64"
  },
  {
    id: 57,
    institution: "UNICAMP",
    year: 2021,
    subject: "Física",
    topic: "Pressão",
    statement: "A pressão atmosférica ao nível do mar é aproximadamente:",
    alternatives: ["760 mmHg", "1013 hPa", "1 atm", "101.325 Pa", "Todas as alternativas"],
    correctAnswer: 4,
    explanation: "Todas as unidades representam a mesma pressão atmosférica ao nível do mar."
  },
  {
    id: 58,
    institution: "UNICAMP",
    year: 2021,
    subject: "Química",
    topic: "Átomo",
    statement: "O núcleo do átomo contém:",
    alternatives: ["Prótons e elétrons", "Prótons e nêutrons", "Elétrons e nêutrons", "Apenas prótons", "Apenas elétrons"],
    correctAnswer: 1,
    explanation: "O núcleo atômico contém prótons (carga positiva) e nêutrons (sem carga)."
  },
  {
    id: 59,
    institution: "UNICAMP",
    year: 2021,
    subject: "Biologia",
    topic: "Célula",
    statement: "A estrutura que controla as atividades celulares é:",
    alternatives: ["Citoplasma", "Membrana plasmática", "Núcleo", "Ribossomos", "Mitocôndrias"],
    correctAnswer: 2,
    explanation: "O núcleo contém o DNA e controla as atividades celulares."
  },
  {
    id: 60,
    institution: "UNICAMP",
    year: 2021,
    subject: "Literatura",
    topic: "Modernismo",
    statement: "A Semana de Arte Moderna ocorreu em:",
    alternatives: ["1920", "1922", "1924", "1926", "1928"],
    correctAnswer: 1,
    explanation: "A Semana de Arte Moderna ocorreu em fevereiro de 1922, em São Paulo."
  },
  // UNICAMP 2024 - Questões mais complexas
  {
    id: 93,
    institution: "UNICAMP",
    year: 2024,
    subject: "Matemática",
    topic: "Análise Combinatória",
    statement: "De quantas maneiras diferentes podemos arranjar as letras da palavra UNICAMP, de modo que as vogais fiquem sempre juntas?",
    alternatives: ["720", "1440", "2880", "5040", "14400"],
    correctAnswer: 1,
    explanation: "Tratando as vogais UIA como um bloco: 5! arranjos × 3! arranjos das vogais = 120 × 12 = 1440."
  },
  {
    id: 94,
    institution: "UNICAMP",
    year: 2024,
    subject: "Física",
    topic: "Mecânica Quântica",
    statement: "Na experiência da dupla fenda com elétrons, quando não observamos por qual fenda o elétron passa, observamos:",
    alternatives: [
      "Padrão de interferência no anteparo",
      "Duas bandas correspondentes às fendas",
      "Uma banda única no centro",
      "Dispersão aleatória dos elétrons",
      "Nenhum elétron atingindo o anteparo"
    ],
    correctAnswer: 0,
    explanation: "Sem observação, os elétrons comportam-se como ondas, criando padrão de interferência, demonstrando a dualidade onda-partícula."
  },
  {
    id: 95,
    institution: "UNICAMP",
    year: 2024,
    subject: "Química",
    topic: "Química Orgânica",
    statement: "A reação de adição de HBr ao propeno (CH₃-CH=CH₂) segue a regra de Markovnikov, produzindo preferencialmente:",
    alternatives: [
      "2-bromopropano",
      "1-bromopropano", 
      "1,2-dibromopropano",
      "2,2-dibromopropano",
      "3-bromopropano"
    ],
    correctAnswer: 0,
    explanation: "Pela regra de Markovnikov, o H liga-se ao carbono mais hidrogenado (terminal) e o Br ao menos hidrogenado (central), formando 2-bromopropano."
  },
  {
    id: 96,
    institution: "UNICAMP",
    year: 2024,
    subject: "Biologia",
    topic: "Biotecnologia",
    statement: "A técnica CRISPR-Cas9 é uma ferramenta de edição genética que permite:",
    alternatives: [
      "Cortar e modificar sequências específicas de DNA",
      "Apenas visualizar o DNA",
      "Duplicar cromossomos inteiros",
      "Converter RNA em DNA",
      "Produzir proteínas sintéticas"
    ],
    correctAnswer: 0,
    explanation: "CRISPR-Cas9 é um sistema que permite cortar o DNA em locais específicos e inserir, deletar ou modificar sequências genéticas com precisão."
  },
  {
    id: 97,
    institution: "UNICAMP",
    year: 2024,
    subject: "História",
    topic: "Ditadura Militar",
    statement: "O AI-5 (Ato Institucional nº 5), de dezembro de 1968, representou:",
    alternatives: [
      "O endurecimento máximo da ditadura militar brasileira",
      "O início da abertura democrática",
      "A criação do bipartidarismo",
      "A anistia política ampla",
      "O fim da censura à imprensa"
    ],
    correctAnswer: 0,
    explanation: "O AI-5 marcou o período mais repressivo da ditadura, fechando o Congresso, cassando mandatos e instituindo a censura prévia."
  },
  {
    id: 98,
    institution: "UNICAMP",
    year: 2024,
    subject: "Geografia",
    topic: "Mudanças Climáticas",
    statement: "O Protocolo de Kyoto (1997) estabeleceu metas para:",
    alternatives: [
      "Redução das emissões de gases do efeito estufa",
      "Proteção da camada de ozônio",
      "Conservação da biodiversidade",
      "Combate à desertificação",
      "Preservação das florestas tropicais"
    ],
    correctAnswer: 0,
    explanation: "O Protocolo de Kyoto estabeleceu metas obrigatórias para países desenvolvidos reduzirem emissões de CO₂ e outros gases do efeito estufa."
  },
  {
    id: 99,
    institution: "UNICAMP",
    year: 2024,
    subject: "Português",
    topic: "Figuras de Linguagem",
    statement: "No verso 'Seus olhos eram dois sóis brilhando', identifica-se a figura de linguagem:",
    alternatives: ["Metáfora", "Comparação", "Metonímia", "Hipérbole", "Prosopopeia"],
    correctAnswer: 0,
    explanation: "A metáfora estabelece uma comparação implícita sem uso de conectivos, identificando 'olhos' com 'sóis' diretamente."
  }
];