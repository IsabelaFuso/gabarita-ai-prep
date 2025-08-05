import { Question } from "../types";

export const enemQuestions: Question[] = [
  // ENEM - Biologia
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
  }
];