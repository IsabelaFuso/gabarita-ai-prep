export interface Question {
  id: string;
  institution?: string;
  year?: number;
  subject: string;
  topic: string;
  statement: string;
  image?: string; // URL or path for the question image
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