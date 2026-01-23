import { z } from "zod";

// Quiz question structure
export interface Question {
  id: number;
  question: string;
  correctAnswer: string;
  options?: string[];
}

// Function to shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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

// The 10 quiz questions with manually curated MCQ options
export const quizQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the name of the pastor who usually says, "God bless you real good"?',
    correctAnswer: "Rev Godwin Olutimi",
    options: ["Rev Godwin Olutunde", "Rev Godwin Olutimi", "Rev Godwin Oludemi", "Rev Godwin Olutope"],
  },
  {
    id: 2,
    question: "Just As It Was, our family program started in what year?",
    correctAnswer: "2022",
    options: ["2021", "2022", "2023", "2020"],
  },
  {
    id: 3,
    question: "In what year was GVIM started?",
    correctAnswer: "2018",
    options: ["2017", "2019", "2018", "2020"],
  },
  {
    id: 4,
    question: "In which city and country was GVIM founded?",
    correctAnswer: "Montreal, Quebec, Canada",
    options: ["Toronto, Ontario, Canada", "Montreal, Quebec, Canada", "Montreal, Ontario, Canada", "Ottawa, Quebec, Canada"],
  },
  {
    id: 5,
    question: "When did the GVIM physical church begin?",
    correctAnswer: "January 2025",
    options: ["December 2024", "February 2025", "January 2025", "November 2024"],
  },
  {
    id: 6,
    question: 'What is the name of the pastor who usually says, "Oh my God!, oh my God!, hear this, hear this"?',
    correctAnswer: "Prophet Shina Oladimeji",
    options: ["Prophet Sina Oladimeji", "Prophet Shina Oladele", "Prophet Shina Oladimeji", "Prophet Shina Oladeji"],
  },
  {
    id: 7,
    question: "Which family produced GVIM's first grand baby?",
    correctAnswer: "Sis Ajibike's family",
    options: ["Sis Ajoke's family", "Sis Abike's family", "Sis Ajibike's family", "Sis Ajibola's family"],
  },
  {
    id: 8,
    question: "Pillars Nigeria, our prayer platform, started in what year?",
    correctAnswer: "January 2023",
    options: ["December 2022", "February 2023", "January 2023", "March 2023"],
  },
  {
    id: 9,
    question: "In how many countries does GVIM have branches, and what are their names?",
    correctAnswer: "6, Nigeria, Pakistan, USA, UK, Portugal, Canada",
    options: ["6, Nigeria, Pakistan, USA, UK, Poland, Canada", "5, Nigeria, Pakistan, USA, UK, Canada", "6, Nigeria, Pakistan, USA, UK, Portugal, Canada", "7, Nigeria, Pakistan, USA, UK, Portugal, Canada, Ghana"],
  },
  {
    id: 10,
    question: "What is the full meaning of AKOREBAMI?",
    correctAnswer: "Akorede-Bamidele (Both are middle names)",
    options: ["Akorede-Bamidele (Both are first names)", "Akorede-Bamidele (Both are middle names)", "Akorede-Bamidele (Both are last names)", "Akorede-Bamiji (Both are middle names)"],
  },
];

// Shuffle options for each question on every load
quizQuestions.forEach(q => {
  q.options = shuffleArray(q.options!);
});
