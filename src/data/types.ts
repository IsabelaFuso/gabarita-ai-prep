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

export interface QuestionFilters {
  institution?: string;
  subject?: string;
  topic?: string;
  year?: number;
}