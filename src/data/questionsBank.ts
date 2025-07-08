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
  },

  // ENEM 2022 - Questões Adicionais
  {
    id: 26,
    institution: "ENEM",
    year: 2022,
    subject: "Matemática",
    topic: "Probabilidade",
    statement: "Uma urna contém 3 bolas vermelhas, 4 bolas azuis e 5 bolas verdes. Qual é a probabilidade de retirar uma bola vermelha ao acaso?",
    alternatives: ["1/4", "1/3", "3/12", "5/12", "4/12"],
    correctAnswer: 2,
    explanation: "Total de bolas = 3 + 4 + 5 = 12. Probabilidade = 3/12 = 1/4."
  },
  {
    id: 27,
    institution: "ENEM",
    year: 2022,
    subject: "Física",
    topic: "Ondas",
    statement: "Uma onda sonora se propaga no ar com velocidade de 340 m/s. Se sua frequência é 680 Hz, qual é o comprimento de onda?",
    alternatives: ["0,5 m", "1,0 m", "1,5 m", "2,0 m", "2,5 m"],
    correctAnswer: 0,
    explanation: "λ = v/f = 340/680 = 0,5 m"
  },
  {
    id: 28,
    institution: "ENEM",
    year: 2022,
    subject: "Química",
    topic: "Mol",
    statement: "Quantos átomos existem em 2 mols de gás hélio (He)?",
    alternatives: ["6,02 × 10²³", "1,204 × 10²⁴", "3,01 × 10²³", "2,408 × 10²⁴", "1,2 × 10²⁴"],
    correctAnswer: 1,
    explanation: "2 mols × 6,02 × 10²³ átomos/mol = 1,204 × 10²⁴ átomos"
  },
  {
    id: 29,
    institution: "ENEM",
    year: 2022,
    subject: "Biologia",
    topic: "Fotossíntese",
    statement: "O processo de fotossíntese ocorre principalmente:",
    alternatives: ["Nos cloroplastos", "Nas mitocôndrias", "No núcleo", "No citoplasma", "No vacúolo"],
    correctAnswer: 0,
    explanation: "A fotossíntese ocorre principalmente nos cloroplastos, onde está localizada a clorofila."
  },
  {
    id: 30,
    institution: "ENEM",
    year: 2022,
    subject: "História",
    topic: "Segunda Guerra Mundial",
    statement: "O Dia D, marco da Segunda Guerra Mundial, refere-se a:",
    alternatives: [
      "O desembarque das tropas aliadas na Normandia",
      "O ataque a Pearl Harbor",
      "A rendição da Alemanha",
      "A bomba atômica em Hiroshima",
      "A invasão da Polônia"
    ],
    correctAnswer: 0,
    explanation: "O Dia D (6 de junho de 1944) marca o desembarque das tropas aliadas na Normandia, França."
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

  // ENEM 2021
  {
    id: 46,
    institution: "ENEM",
    year: 2021,
    subject: "Matemática",
    topic: "Juros Simples",
    statement: "Um capital de R$ 1.000,00 aplicado a juros simples de 5% ao mês durante 3 meses renderá:",
    alternatives: ["R$ 50,00", "R$ 100,00", "R$ 150,00", "R$ 200,00", "R$ 250,00"],
    correctAnswer: 2,
    explanation: "Juros = C × i × t = 1000 × 0,05 × 3 = R$ 150,00"
  },
  {
    id: 47,
    institution: "ENEM",
    year: 2021,
    subject: "Física",
    topic: "Velocidade",
    statement: "Um carro percorre 200 km em 2 horas. Sua velocidade média é:",
    alternatives: ["50 km/h", "75 km/h", "100 km/h", "125 km/h", "150 km/h"],
    correctAnswer: 2,
    explanation: "Velocidade média = distância/tempo = 200 km / 2 h = 100 km/h"
  },
  {
    id: 48,
    institution: "ENEM",
    year: 2021,
    subject: "Química",
    topic: "Ligações Químicas",
    statement: "A ligação entre Na⁺ e Cl⁻ no sal de cozinha (NaCl) é:",
    alternatives: ["Covalente", "Iônica", "Metálica", "Dipolo-dipolo", "Ponte de hidrogênio"],
    correctAnswer: 1,
    explanation: "A ligação entre Na⁺ e Cl⁻ é iônica, formada pela transferência de elétrons."
  },
  {
    id: 49,
    institution: "ENEM",
    year: 2021,
    subject: "Biologia",
    topic: "Respiração Celular",
    statement: "A respiração celular ocorre principalmente:",
    alternatives: ["Nos cloroplastos", "Nas mitocôndrias", "No núcleo", "No citoplasma", "No retículo"],
    correctAnswer: 1,
    explanation: "A respiração celular ocorre principalmente nas mitocôndrias."
  },
  {
    id: 50,
    institution: "ENEM",
    year: 2021,
    subject: "História",
    topic: "Proclamação da República",
    statement: "A Proclamação da República no Brasil ocorreu em:",
    alternatives: ["1888", "1889", "1890", "1891", "1892"],
    correctAnswer: 1,
    explanation: "A Proclamação da República brasileira ocorreu em 15 de novembro de 1889."
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

  // ENEM 2020
  {
    id: 66,
    institution: "ENEM",
    year: 2020,
    subject: "Matemática",
    topic: "Regra de Três",
    statement: "Se 3 operários fazem um trabalho em 6 dias, quantos dias levarão 9 operários para fazer o mesmo trabalho?",
    alternatives: ["1 dia", "2 dias", "3 dias", "4 dias", "5 dias"],
    correctAnswer: 1,
    explanation: "Regra de três inversa: 3 × 6 = 9 × x → x = 18/9 = 2 dias"
  },
  {
    id: 67,
    institution: "ENEM",
    year: 2020,
    subject: "Física",
    topic: "Trabalho",
    statement: "O trabalho realizado por uma força é dado por:",
    alternatives: ["W = F × d", "W = F/d", "W = d/F", "W = F + d", "W = F - d"],
    correctAnswer: 0,
    explanation: "Trabalho = Força × deslocamento (W = F × d)"
  },
  {
    id: 68,
    institution: "ENEM",
    year: 2020,
    subject: "Química",
    topic: "Isótopos",
    statement: "Átomos que possuem o mesmo número de prótons mas diferente número de nêutrons são chamados:",
    alternatives: ["Isóbaros", "Isótopos", "Isótonos", "Isoeletrônicos", "Alótropos"],
    correctAnswer: 1,
    explanation: "Isótopos são átomos do mesmo elemento com diferentes números de nêutrons."
  },
  {
    id: 69,
    institution: "ENEM",
    year: 2020,
    subject: "Biologia",
    topic: "Proteínas",
    statement: "As proteínas são formadas por:",
    alternatives: ["Aminoácidos", "Nucleotídeos", "Glicose", "Lipídios", "Vitaminas"],
    correctAnswer: 0,
    explanation: "As proteínas são macromoléculas formadas por sequências de aminoácidos."
  },
  {
    id: 70,
    institution: "ENEM",
    year: 2020,
    subject: "História",
    topic: "Independência do Brasil",
    statement: "A Independência do Brasil foi proclamada em:",
    alternatives: ["1820", "1821", "1822", "1823", "1824"],
    correctAnswer: 2,
    explanation: "A Independência do Brasil foi proclamada em 7 de setembro de 1822."
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