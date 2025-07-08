import { Question, QuestionFilters } from "./types";

// Função para filtrar questões por critérios
export const filterQuestions = (questionsBank: Question[], filters: QuestionFilters) => {
  return questionsBank.filter(question => {
    if (filters.institution && question.institution !== filters.institution) return false;
    if (filters.subject && question.subject !== filters.subject) return false;
    if (filters.topic && question.topic !== filters.topic) return false;
    if (filters.year && question.year !== filters.year) return false;
    return true;
  });
};

// Função para obter questões aleatórias
export const getRandomQuestions = (questionsBank: Question[], count: number, filters?: QuestionFilters) => {
  const filteredQuestions = filters ? filterQuestions(questionsBank, filters) : questionsBank;
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Função para obter estatísticas do banco de questões
export const getQuestionsStats = (questionsBank: Question[]) => {
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