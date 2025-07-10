import { Question } from "../types";

export const enemQuestions: Question[] = [
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
  // ENEM 2022
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
  // ENEM 2024 - Questões mais complexas
  {
    id: 76,
    institution: "ENEM",
    year: 2024,
    subject: "Matemática",
    topic: "Função Exponencial",
    statement: "Uma população de bactérias cresce segundo a função P(t) = 1000 × 2^(t/3), onde t é o tempo em horas. Para que a população atinja 8000 bactérias, será necessário um tempo de:",
    alternatives: ["6 horas", "9 horas", "12 horas", "15 horas", "18 horas"],
    correctAnswer: 1,
    explanation: "8000 = 1000 × 2^(t/3) → 8 = 2^(t/3) → 2³ = 2^(t/3) → t/3 = 3 → t = 9 horas."
  },
  {
    id: 77,
    institution: "ENEM",
    year: 2024,
    subject: "Física",
    topic: "Eletromagnetismo",
    statement: "Um condutor retilíneo de 2 metros, percorrido por uma corrente de 5 A, está imerso em um campo magnético uniforme de 0,4 T, perpendicular ao condutor. A força magnética sobre o condutor é:",
    alternatives: ["2 N", "4 N", "6 N", "8 N", "10 N"],
    correctAnswer: 1,
    explanation: "F = B × i × L = 0,4 × 5 × 2 = 4 N."
  },
  {
    id: 78,
    institution: "ENEM",
    year: 2024,
    subject: "Química",
    topic: "Equilíbrio Químico",
    statement: "Para a reação N₂(g) + 3H₂(g) ⇌ 2NH₃(g), se as concentrações de equilíbrio são [N₂] = 0,1 M, [H₂] = 0,3 M e [NH₃] = 0,2 M, a constante de equilíbrio Kc vale:",
    alternatives: ["14,8", "1,48", "0,148", "148", "1480"],
    correctAnswer: 0,
    explanation: "Kc = [NH₃]²/([N₂] × [H₂]³) = (0,2)²/(0,1 × (0,3)³) = 0,04/(0,1 × 0,027) = 0,04/0,0027 ≈ 14,8."
  },
  {
    id: 79,
    institution: "ENEM",
    year: 2024,
    subject: "Biologia",
    topic: "Genética Molecular",
    statement: "Na síntese proteica, a sequência de DNA 3'-TAC-GGA-CTA-5' será transcrita em RNA mensageiro como:",
    alternatives: ["5'-AUG-CCU-GAU-3'", "5'-ATG-CCT-GAT-3'", "3'-AUG-CCU-GAU-5'", "5'-UAC-GGA-CUA-3'", "3'-TAC-GGA-CTA-5'"],
    correctAnswer: 0,
    explanation: "Na transcrição, a fita molde de DNA 3'-TAC-GGA-CTA-5' gera o RNA 5'-AUG-CCU-GAU-3' (complementar e antiparalelo, com U no lugar de T)."
  },
  {
    id: 80,
    institution: "ENEM",
    year: 2024,
    subject: "Português",
    topic: "Análise Sintática",
    statement: "Na oração 'Espera-se que os resultados sejam divulgados amanhã', a classificação correta da oração subordinada é:",
    alternatives: [
      "Substantiva subjetiva",
      "Substantiva objetiva direta", 
      "Adjetiva restritiva",
      "Adverbial temporal",
      "Substantiva predicativa"
    ],
    correctAnswer: 0,
    explanation: "A oração 'que os resultados sejam divulgados amanhã' é substantiva subjetiva, pois funciona como sujeito da oração principal com verbo na voz passiva sintética."
  },
  {
    id: 81,
    institution: "ENEM",
    year: 2024,
    subject: "História",
    topic: "República Velha",
    statement: "A política do 'café-com-leite' durante a República Velha (1889-1930) caracterizou-se pela alternância no poder entre oligarquias de:",
    alternatives: [
      "São Paulo e Minas Gerais",
      "Rio de Janeiro e São Paulo", 
      "Minas Gerais e Rio Grande do Sul",
      "São Paulo e Bahia",
      "Minas Gerais e Pernambuco"
    ],
    correctAnswer: 0,
    explanation: "A política do 'café-com-leite' refere-se ao revezamento entre as oligarquias paulista (café) e mineira (leite) no controle da presidência da República."
  },
  {
    id: 82,
    institution: "ENEM",
    year: 2024,
    subject: "Geografia",
    topic: "Geopolitica",
    statement: "O conceito de 'Estado-nação' pressupõe a coincidência entre:",
    alternatives: [
      "Território político e identidade cultural",
      "Economia e política",
      "Religião e território",
      "Língua e economia",
      "Cultura e religião"
    ],
    correctAnswer: 0,
    explanation: "O Estado-nação ideal pressupõe a coincidência entre fronteiras políticas (Estado) e identidade cultural homogênea (nação)."
  },
  {
    id: 83,
    institution: "ENEM",
    year: 2024,
    subject: "Sociologia",
    topic: "Movimentos Sociais",
    statement: "Segundo a teoria de Manuel Castells, os movimentos sociais na era da informação caracterizam-se principalmente por:",
    alternatives: [
      "Organização em rede e identidade coletiva",
      "Hierarquia rígida e liderança centralizada",
      "Foco exclusivo em questões econômicas",
      "Dependência de partidos políticos",
      "Ação limitada ao espaço local"
    ],
    correctAnswer: 0,
    explanation: "Castells identifica que os novos movimentos sociais se organizam em rede, são descentralizados e focam na construção de identidade coletiva."
  },
  {
    id: 84,
    institution: "ENEM",
    year: 2024,
    subject: "Filosofia",
    topic: "Ética",
    statement: "Para Immanuel Kant, uma ação é moralmente correta quando:",
    alternatives: [
      "Pode ser universalizada sem contradição",
      "Produz a maior felicidade para o maior número",
      "Está de acordo com os costumes sociais",
      "Gera consequências favoráveis",
      "É aprovada pela maioria"
    ],
    correctAnswer: 0,
    explanation: "O imperativo categórico kantiano estabelece que uma ação é moral quando sua máxima pode ser universalizada sem contradição lógica."
  },
  {
    id: 85,
    institution: "ENEM",
    year: 2024,
    subject: "Inglês",
    topic: "Reading Comprehension",
    statement: "Read the text: 'Climate change mitigation requires unprecedented global cooperation.' The word 'unprecedented' means:",
    alternatives: [
      "Never happened before",
      "Highly expected",
      "Frequently occurring",
      "Easily achievable",
      "Previously planned"
    ],
    correctAnswer: 0,
    explanation: "'Unprecedented' significa 'sem precedentes', ou seja, algo que nunca aconteceu antes."
  }
];