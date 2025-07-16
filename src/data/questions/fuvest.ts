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
  },
  // FUVEST 2024 - Questões mais complexas
  {
    id: 86,
    institution: "FUVEST",
    year: 2024,
    subject: "Matemática",
    topic: "Geometria Analítica",
    statement: "A equação da circunferência que passa pelos pontos A(1,2), B(3,4) e tem centro na reta x + y = 5 é:",
    alternatives: [
      "(x-2)² + (y-3)² = 2",
      "(x-3)² + (y-2)² = 5", 
      "(x-1)² + (y-4)² = 8",
      "(x-2)² + (y-3)² = 5",
      "(x-3)² + (y-2)² = 2"
    ],
    correctAnswer: 0,
    explanation: "O centro C(a,b) está na reta x+y=5, então b=5-a. Como CA=CB, temos (a-1)²+(b-2)²=(a-3)²+(b-4)². Resolvendo: a=2, b=3, raio=√2."
  },
  {
    id: 87,
    institution: "FUVEST",
    year: 2024,
    subject: "Física",
    topic: "Óptica",
    statement: "Uma lente convergente de distância focal 20 cm forma uma imagem real de um objeto. Se a distância do objeto à lente é 30 cm, a distância da imagem à lente é:",
    alternatives: ["12 cm", "50 cm", "60 cm", "75 cm", "100 cm"],
    correctAnswer: 2,
    explanation: "Pela equação de Gauss: 1/f = 1/p + 1/p' → 1/20 = 1/30 + 1/p' → 1/p' = 1/20 - 1/30 = 1/60 → p' = 60 cm."
  },
  {
    id: 88,
    institution: "FUVEST",
    year: 2024,
    subject: "Química",
    topic: "Cinética Química",
    statement: "Para uma reação de primeira ordem com constante de velocidade k = 0,693 min⁻¹, o tempo de meia-vida é:",
    alternatives: ["0,5 min", "1,0 min", "1,5 min", "2,0 min", "2,5 min"],
    correctAnswer: 1,
    explanation: "Para reação de 1ª ordem: t₁/₂ = ln(2)/k = 0,693/0,693 = 1,0 min."
  },
  {
    id: 89,
    institution: "FUVEST",
    year: 2024,
    subject: "Biologia",
    topic: "Evolução",
    statement: "O conceito de especiação alopátrica refere-se à formação de novas espécies por:",
    alternatives: [
      "Isolamento geográfico seguido de diferenciação genética",
      "Hibridização entre espécies diferentes",
      "Mutações cromossômicas em populações simpátricas",
      "Seleção sexual intensa",
      "Deriva genética em populações grandes"
    ],
    correctAnswer: 0,
    explanation: "Especiação alopátrica ocorre quando populações ficam geograficamente isoladas e acumulam diferenças genéticas até se tornarem espécies distintas."
  },
  {
    id: 90,
    institution: "FUVEST",
    year: 2024,
    subject: "História",
    topic: "Revolução Francesa",
    statement: "A Declaração dos Direitos do Homem e do Cidadão (1789) estabeleceu princípios que influenciaram:",
    alternatives: [
      "O liberalismo político e os direitos individuais modernos",
      "Apenas a organização do Estado francês",
      "O retorno ao absolutismo monárquico",
      "A manutenção do sistema feudal",
      "A organização da sociedade estamental"
    ],
    correctAnswer: 0,
    explanation: "A Declaração de 1789 estabeleceu princípios fundamentais dos direitos humanos e do liberalismo político, influenciando constituições modernas mundialmente."
  },
  {
    id: 91,
    institution: "FUVEST",
    year: 2024,
    subject: "Literatura",
    topic: "Realismo",
    statement: "Em 'O Cortiço' de Aluísio Azevedo, o personagem João Romão representa:",
    alternatives: [
      "A ascensão social através da exploração e ganância",
      "O ideal romântico do herói brasileiro",
      "A decadência da aristocracia rural",
      "O intelectual crítico da sociedade",
      "O trabalhador honesto e trabalhador"
    ],
    correctAnswer: 0,
    explanation: "João Romão exemplifica o burguês capitalista que enriquece explorando os mais pobres, representando a crítica naturalista aos vícios sociais."
  },
  {
    id: 92,
    institution: "FUVEST",
    year: 2024,
    subject: "Geografia",
    topic: "Recursos Hídricos",
    statement: "O Sistema Aquífero Guarani, um dos maiores reservatórios de água doce subterrânea do mundo, estende-se pelos territórios de:",
    alternatives: [
      "Brasil, Argentina, Uruguai e Paraguai",
      "Brasil, Peru, Bolívia e Paraguai",
      "Brasil, Venezuela, Colômbia e Guiana",
      "Brasil, Chile, Argentina e Uruguai",
      "Brasil, Equador, Peru e Bolívia"
    ],
    correctAnswer: 0,
    explanation: "O Aquífero Guarani estende-se pelos territórios do Brasil, Argentina, Uruguai e Paraguai, sendo um importante recurso hídrico compartilhado."
  },
  {
    id: 93,
    institution: "FUVEST",
    year: 2024,
    subject: "Física",
    topic: "Óptica Geométrica",
    statement: "A figura mostra um objeto (O) e sua imagem (I) conjugada por uma lente esférica delgada. Com base na figura, qual é o tipo de lente e a natureza da imagem?",
    image: "/placeholder.svg",
    alternatives: [
      "Lente convergente, imagem real",
      "Lente convergente, imagem virtual",
      "Lente divergente, imagem real",
      "Lente divergente, imagem virtual",
      "Pode ser convergente ou divergente, dependendo da distância"
    ],
    correctAnswer: 1,
    explanation: "A imagem é virtual, direita e maior que o objeto. Essa configuração é típica de uma lente convergente sendo usada como lupa, com o objeto posicionado entre o centro óptico e o foco principal."
  }
];