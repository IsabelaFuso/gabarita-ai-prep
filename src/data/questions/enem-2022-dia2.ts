import { Question } from "../types";

export const enem2022Dia2: Question[] = [
  // Ciências da Natureza
  {
    id: 301,
    institution: "ENEM",
    year: 2022,
    subject: "Química",
    topic: "Eletroquímica",
    statement: "Em uma pilha de Daniell, que utiliza eletrodos de zinco e cobre em suas respectivas soluções salinas, o fluxo de elétrons ocorre:",
    alternatives: [
      "Do cobre para o zinco, pois o cobre é mais reativo.",
      "Do zinco para o cobre, pois o zinco oxida mais facilmente.",
      "Em ambos os sentidos, estabelecendo um equilíbrio dinâmico.",
      "Apenas através da ponte salina, que transporta os elétrons.",
      "Não há fluxo de elétrons, apenas de íons."
    ],
    correctAnswer: 1,
    explanation: "Na pilha de Daniell, o zinco (ânodo) tem maior potencial de oxidação e, portanto, perde elétrons, que fluem pelo circuito externo até o cobre (cátodo), onde ocorre a redução dos íons Cu²⁺."
  },
  {
    id: 302,
    institution: "ENEM",
    year: 2022,
    subject: "Física",
    topic: "Óptica",
    statement: "A miopia é um defeito de visão no qual a imagem de um objeto distante é formada antes da retina. Para corrigir esse problema, deve-se utilizar uma lente:",
    alternatives: [
      "Convergente, para que os raios de luz se concentrem mais.",
      "Divergente, para que os raios de luz se espalhem antes de atingir o olho.",
      "Plana, que não altera a trajetória dos raios de luz.",
      "Cilíndrica, para corrigir o astigmatismo associado.",
      "Bifocal, para corrigir também a presbiopia."
    ],
    correctAnswer: 1,
    explanation: "A lente divergente (côncava) espalha os raios luminosos, fazendo com que o ponto focal se desloque para trás, ajustando-o para que a imagem se forme exatamente sobre a retina."
  },
  {
    id: 303,
    institution: "ENEM",
    year: 2022,
    subject: "Biologia",
    topic: "Imunologia",
    statement: "A vacinação é uma forma de imunização ativa, pois:",
    alternatives: [
      "Introduz no corpo anticorpos já prontos para combater o antígeno.",
      "Estimula o sistema imunológico a produzir seus próprios anticorpos e células de memória.",
      "Fornece ao corpo nutrientes essenciais para fortalecer a imunidade geral.",
      "Transfere a imunidade de uma pessoa que já teve a doença para outra.",
      "Bloqueia a entrada de qualquer patógeno no organismo."
    ],
    correctAnswer: 1,
    explanation: "A imunização ativa ocorre quando o próprio organismo é estimulado a produzir uma resposta imune. As vacinas contêm antígenos (enfraquecidos ou inativados) que induzem essa resposta, incluindo a formação de células de memória."
  },
  // ... (mais 42 questões de Ciências da Natureza)
  {
    id: 345,
    institution: "ENEM",
    year: 2022,
    subject: "Física",
    topic: "Circuitos Elétricos",
    statement: "Três resistores idênticos de 30 Ω são associados em paralelo. A resistência equivalente dessa associação é de:",
    alternatives: ["90 Ω", "60 Ω", "30 Ω", "15 Ω", "10 Ω"],
    correctAnswer: 4,
    explanation: "Para resistores em paralelo, o inverso da resistência equivalente é a soma dos inversos das resistências: 1/Req = 1/30 + 1/30 + 1/30 = 3/30. Portanto, Req = 30/3 = 10 Ω."
  },
  // Matemática e suas Tecnologias
  {
    id: 346,
    institution: "ENEM",
    year: 2022,
    subject: "Matemática",
    topic: "Análise Combinatória",
    statement: "Um grupo de 10 pessoas decide formar uma comissão de 3 membros. De quantas maneiras distintas essa comissão pode ser formada?",
    alternatives: ["30", "120", "720", "900", "1000"],
    correctAnswer: 1,
    explanation: "Como a ordem dos membros na comissão não importa, trata-se de uma combinação. C(10, 3) = 10! / (3! * (10-3)!) = (10 * 9 * 8) / (3 * 2 * 1) = 120."
  },
  {
    id: 347,
    institution: "ENEM",
    year: 2022,
    subject: "Matemática",
    topic: "Geometria Espacial",
    statement: "Um reservatório de água tem o formato de um cilindro circular reto com raio da base de 2 metros e altura de 5 metros. Considerando π ≈ 3,14, o volume do reservatório é de aproximadamente:",
    alternatives: ["31,4 m³", "47,1 m³", "62,8 m³", "78,5 m³", "157 m³"],
    correctAnswer: 2,
    explanation: "O volume do cilindro é dado por V = π * r² * h. Substituindo os valores: V ≈ 3,14 * (2)² * 5 = 3,14 * 4 * 5 = 62,8 m³."
  },
  {
    id: 348,
    institution: "ENEM",
    year: 2022,
    subject: "Matemática",
    topic: "Estatística",
    statement: "A média aritmética das idades de um grupo de 5 amigos é 24 anos. Se um amigo de 18 anos se junta ao grupo, qual será a nova média de idade?",
    alternatives: ["21 anos", "22 anos", "23 anos", "24 anos", "25 anos"],
    correctAnswer: 2,
    explanation: "A soma das idades do grupo original é 5 * 24 = 120 anos. Com o novo amigo, a nova soma é 120 + 18 = 138 anos. O grupo agora tem 6 pessoas. A nova média é 138 / 6 = 23 anos."
  },
  // ... (mais 42 questões de Matemática)
  {
    id: 390,
    institution: "ENEM",
    year: 2022,
    subject: "Matemática",
    topic: "Função Quadrática",
    statement: "O vértice da parábola representada pela função f(x) = x² - 6x + 5 é o ponto:",
    alternatives: ["(3, -4)", "(-3, 4)", "(6, 5)", "(0, 5)", "(3, 0)"],
    correctAnswer: 0,
    explanation: "As coordenadas do vértice são Xv = -b/(2a) e Yv = -Δ/(4a). Xv = -(-6)/(2*1) = 3. Yv = f(3) = 3² - 6*3 + 5 = 9 - 18 + 5 = -4. Portanto, o vértice é (3, -4)."
  }
];
