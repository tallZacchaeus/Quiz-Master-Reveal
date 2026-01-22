import { z } from "zod";

// Quiz question structure
export interface Question {
  id: number;
  question: string;
  correctAnswer: string;
}

// Quiz submission from user
export const quizSubmissionSchema = z.object({
  playerName: z.string().min(1, "Name is required"),
  answers: z.array(z.string()),
  score: z.number(),
  totalQuestions: z.number(),
  completedAt: z.string(),
});

export type QuizSubmission = z.infer<typeof quizSubmissionSchema>;

// Quiz result stored in memory
export interface QuizResult {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  answers: string[];
  completedAt: string;
}

// App settings for admin control
export interface AppSettings {
  answersRevealed: boolean;
}

// The 10 quiz questions
export const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the name of the pastor who usually says, "God bless you real good"?',
    correctAnswer: "Rev Godwin Olutimi",
  },
  {
    id: 2,
    question: "Just As It Was, our family program started in what year?",
    correctAnswer: "2022",
  },
  {
    id: 3,
    question: "In what year was GVIM started?",
    correctAnswer: "2018",
  },
  {
    id: 4,
    question: "In which city and country was GVIM founded?",
    correctAnswer: "Montreal, Quebec, Canada",
  },
  {
    id: 5,
    question: "When did the GVIM physical church begin?",
    correctAnswer: "January 2025",
  },
  {
    id: 6,
    question: 'What is the name of the pastor who usually says, "Oh my God, oh my God, hear this, hear this"?',
    correctAnswer: "Prophet Shina Oladimeji",
  },
  {
    id: 7,
    question: "Which family produced GVIM's first ground baby?",
    correctAnswer: "Sis Ajibike's family",
  },
  {
    id: 8,
    question: "Pillars Nigeria, our prayer platform, started in what year?",
    correctAnswer: "January 2023",
  },
  {
    id: 9,
    question: "In how many countries does GVIM have branches, and what are their names?",
    correctAnswer: "6, Nigeria, Pakistan, US, UK, Portugal, Canada",
  },
  {
    id: 10,
    question: "What is the full meaning of AKOREBAMI?",
    correctAnswer: "Akorede-Bamidele (Both are middle names)",
  },
];
