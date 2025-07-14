export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  createdAt: string;
  createdById: string;
  createdBy?: ApplicationUser;
  questions?: Question[];
  studentExams?: StudentExams[];
}

export interface ExamCreateDto {
  title: string;
  description: string;
  duration: number;
  createdById: string;
}

export interface Question {
  id: number;
  text: string;
  type: string;
  examId: number;
  exam?: Exam;
  answers?: Answer[];
  studentAnswers?: StudentAnswer[];
}

export interface QuestionCreateDto {
  text: string;
  type: string;
}

export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;
  question?: Question;
  studentAnswers?: StudentAnswer[];
}

export interface AnswerCreateDto {
  text: string;
  isCorrect: boolean;
}

export interface AnswerDto {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface ApplicationUser {
  id: string;
  userName: string;
  email: string;
  studentExams?: StudentExams[];
}

export interface StudentExams {
  id: number;
  studentId: string;
  student?: ApplicationUser;
  examId: number;
  exam?: Exam;
  score: number;
  takenAt: string;
  studentAnswers?: StudentAnswer[];
}

export interface StudentAnswer {
  id: number;
  studentExamId: number;
  studentExams?: StudentExams;
  questionId: number;
  question?: Question;
  answerId: number;
  answer?: Answer;
  isCorrect: boolean;
}

export interface SubmitAnswerDto {
  questionId: number;
  answerId: number;
}

export interface SubmitExamDto {
  examId: number;
  studentId: string;
  answers: SubmitAnswerDto[];
}