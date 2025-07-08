import { Question } from "../types";

export const fuvestQuestions: Question[] = [
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
  // FUVEST 2022
  {
    id: 31,
    institution: "FUVEST",
    year: 2022,
    subject: "Matemática",
    topic: "Trigonometria",
    statement: "O valor de sen(60°) é:",
    alternatives: ["1/2", "√2/2", "√3/2", "1", "√3"],
    correctAnswer: 2,
    explanation: "sen(60°) = √3/2"
  },
  {
    id: 32,
    institution: "FUVEST",
    year: 2022,
    subject: "Física",
    topic: "Dinâmica",
    statement: "A Segunda Lei de Newton é expressa pela equação:",
    alternatives: ["F = ma", "F = mv", "F = m/a", "F = a/m", "F = m + a"],
    correctAnswer: 0,
    explanation: "A Segunda Lei de Newton: F = ma (força = massa × aceleração)"
  },
  {
    id: 33,
    institution: "FUVEST",
    year: 2022,
    subject: "Química",
    topic: "Tabela Periódica",
    statement: "O elemento químico com símbolo 'Au' é:",
    alternatives: ["Prata", "Ouro", "Alumínio", "Arsênio", "Argônio"],
    correctAnswer: 1,
    explanation: "Au é o símbolo químico do ouro (do latim aurum)."
  },
  {
    id: 34,
    institution: "FUVEST",
    year: 2022,
    subject: "Biologia",
    topic: "Sistema Circulatório",
    statement: "O coração humano possui:",
    alternatives: ["2 câmaras", "3 câmaras", "4 câmaras", "5 câmaras", "6 câmaras"],
    correctAnswer: 2,
    explanation: "O coração humano possui 4 câmaras: 2 átrios e 2 ventrículos."
  },
  {
    id: 35,
    institution: "FUVEST",
    year: 2022,
    subject: "Geografia",
    topic: "Cartografia",
    statement: "A escala 1:100.000 significa que:",
    alternatives: [
      "1 cm no mapa representa 100.000 cm na realidade",
      "1 m no mapa representa 100.000 m na realidade",
      "1 km no mapa representa 100.000 km na realidade",
      "O mapa é 100.000 vezes menor que a realidade",
      "Alternativas A e D estão corretas"
    ],
    correctAnswer: 4,
    explanation: "A escala 1:100.000 significa que 1 cm no mapa representa 100.000 cm (1 km) na realidade, ou seja, o mapa é 100.000 vezes menor."
  },
  // FUVEST 2021
  {
    id: 51,
    institution: "FUVEST",
    year: 2021,
    subject: "Matemática",
    topic: "Área",
    statement: "A área de um retângulo com base 8 cm e altura 5 cm é:",
    alternatives: ["13 cm²", "26 cm²", "40 cm²", "80 cm²", "120 cm²"],
    correctAnswer: 2,
    explanation: "Área = base × altura = 8 × 5 = 40 cm²"
  },
  {
    id: 52,
    institution: "FUVEST",
    year: 2021,
    subject: "Física",
    topic: "Força",
    statement: "A unidade de força no Sistema Internacional é:",
    alternatives: ["Joule", "Newton", "Watt", "Pascal", "Coulomb"],
    correctAnswer: 1,
    explanation: "A unidade de força no SI é o Newton (N)."
  },
  {
    id: 53,
    institution: "FUVEST",
    year: 2021,
    subject: "Química",
    topic: "Densidade",
    statement: "A densidade da água pura a 4°C é:",
    alternatives: ["0,5 g/cm³", "1,0 g/cm³", "1,5 g/cm³", "2,0 g/cm³", "2,5 g/cm³"],
    correctAnswer: 1,
    explanation: "A densidade da água pura a 4°C é 1,0 g/cm³."
  },
  {
    id: 54,
    institution: "FUVEST",
    year: 2021,
    subject: "Biologia",
    topic: "Sangue",
    statement: "Os glóbulos vermelhos são responsáveis por:",
    alternatives: ["Defesa do organismo", "Transporte de oxigênio", "Coagulação", "Produção de hormônios", "Digestão"],
    correctAnswer: 1,
    explanation: "Os glóbulos vermelhos (hemácias) transportam oxigênio através da hemoglobina."
  },
  {
    id: 55,
    institution: "FUVEST",
    year: 2021,
    subject: "Geografia",
    topic: "Hidrografia",
    statement: "O maior rio do mundo em volume de água é:",
    alternatives: ["Rio Nilo", "Rio Amazonas", "Rio Mississipi", "Rio Yangtzé", "Rio Ganges"],
    correctAnswer: 1,
    explanation: "O Rio Amazonas é o maior rio do mundo em volume de água."
  },
  // FUVEST 2020
  {
    id: 71,
    institution: "FUVEST",
    year: 2020,
    subject: "Matemática",
    topic: "Potenciação",
    statement: "O valor de 2⁴ é:",
    alternatives: ["8", "12", "16", "20", "24"],
    correctAnswer: 2,
    explanation: "2⁴ = 2 × 2 × 2 × 2 = 16"
  },
  {
    id: 72,
    institution: "FUVEST",
    year: 2020,
    subject: "Física",
    topic: "Densidade",
    statement: "A densidade é definida como:",
    alternatives: ["massa/volume", "volume/massa", "massa × volume", "massa + volume", "massa - volume"],
    correctAnswer: 0,
    explanation: "Densidade = massa/volume (d = m/V)"
  },
  {
    id: 73,
    institution: "FUVEST",
    year: 2020,
    subject: "Química",
    topic: "Oxidação",
    statement: "A oxidação é caracterizada por:",
    alternatives: ["Ganho de elétrons", "Perda de elétrons", "Ganho de prótons", "Perda de prótons", "Ganho de nêutrons"],
    correctAnswer: 1,
    explanation: "Oxidação é a perda de elétrons por um átomo, íon ou molécula."
  },
  {
    id: 74,
    institution: "FUVEST",
    year: 2020,
    subject: "Biologia",
    topic: "DNA",
    statement: "O DNA é encontrado principalmente:",
    alternatives: ["No citoplasma", "Na membrana", "No núcleo", "Nos ribossomos", "Nas mitocôndrias"],
    correctAnswer: 2,
    explanation: "O DNA está localizado principalmente no núcleo das células eucarióticas."
  },
  {
    id: 75,
    institution: "FUVEST",
    year: 2020,
    subject: "Geografia",
    topic: "Latitude",
    statement: "A latitude é medida:",
    alternatives: ["De leste a oeste", "De norte a sul", "Da linha do Equador aos polos", "Do meridiano de Greenwich", "Em graus Celsius"],
    correctAnswer: 2,
    explanation: "A latitude é a distância angular da linha do Equador até os polos (0° a 90°)."
  }
];