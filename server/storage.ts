import { type QuizResult, type AppSettings, quizQuestions } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSettings(): Promise<AppSettings>;
  setAnswersRevealed(revealed: boolean): Promise<void>;
  addResult(result: Omit<QuizResult, "id">): Promise<QuizResult>;
  getResults(): Promise<QuizResult[]>;
  getLeaderboard(): Promise<QuizResult[]>;
  clearResults(): Promise<void>;
}

export class MemStorage implements IStorage {
  private settings: AppSettings;
  private results: Map<string, QuizResult>;

  constructor() {
    this.settings = { answersRevealed: false };
    this.results = new Map();
  }

  async getSettings(): Promise<AppSettings> {
    return this.settings;
  }

  async setAnswersRevealed(revealed: boolean): Promise<void> {
    this.settings.answersRevealed = revealed;
  }

  async addResult(result: Omit<QuizResult, "id">): Promise<QuizResult> {
    const id = randomUUID();
    const quizResult: QuizResult = { ...result, id };
    this.results.set(id, quizResult);
    return quizResult;
  }

  async getResults(): Promise<QuizResult[]> {
    return Array.from(this.results.values()).sort((a, b) => b.score - a.score);
  }

  async getLeaderboard(): Promise<QuizResult[]> {
    return Array.from(this.results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  async clearResults(): Promise<void> {
    this.results.clear();
  }
}

export const storage = new MemStorage();
