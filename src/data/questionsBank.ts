import { Question } from "./types";
import { enemQuestions } from "./questions/enem";
import { fuvestQuestions } from "./questions/fuvest";
import { unicampQuestions } from "./questions/unicamp";
import { uemQuestions } from "./questions/uem";
import { filterQuestions as filterQuestionsUtil, getRandomQuestions as getRandomQuestionsUtil, getQuestionsStats as getQuestionsStatsUtil } from "./utils";

// Exportar todos os tipos necessários
export type { Question } from "./types";

// Combinar todas as questões
export const questionsBank: Question[] = [
  ...enemQuestions,
  ...fuvestQuestions,
  ...unicampQuestions,
  ...uemQuestions
];

// Funções utilitárias que mantêm a mesma API
export const filterQuestions = (filters: {
  institution?: string;
  subject?: string;
  topic?: string;
  year?: number;
}) => {
  return filterQuestionsUtil(questionsBank, filters);
};

export const getRandomQuestions = (count: number, filters?: {
  institution?: string;
  subject?: string;
  topic?: string;
  year?: number;
}) => {
  return getRandomQuestionsUtil(questionsBank, count, filters);
};

export const getQuestionsStats = () => {
  return getQuestionsStatsUtil(questionsBank);
};