import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quizSubmissionSchema, quizQuestions } from "@shared/schema";
import { appendQuizResult } from "./googleSheets";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Get app settings (answer reveal status)
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error getting settings:", error);
      res.status(500).json({ error: "Failed to get settings" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Get all results (for admin)
  app.get("/api/results", async (_req, res) => {
    try {
      const results = await storage.getResults();
      res.json(results);
    } catch (error) {
      console.error("Error getting results:", error);
      res.status(500).json({ error: "Failed to get results" });
    }
  });

  // Submit quiz
  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { playerName, answers, score } = req.body;

      if (!playerName || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Invalid submission data" });
      }

      const completedAt = new Date().toISOString();
      const totalQuestions = quizQuestions.length;

      // Save to local storage
      const result = await storage.addResult({
        playerName,
        score,
        totalQuestions,
        answers,
        completedAt,
      });

      // Save to Google Sheets (async, don't wait)
      appendQuizResult(playerName, score, totalQuestions, completedAt, answers)
        .catch(err => console.error("Google Sheets save failed:", err));

      res.json({ success: true, result });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  // Admin: Toggle answer reveal
  app.post("/api/admin/reveal", async (req, res) => {
    try {
      const { revealed } = req.body;
      
      if (typeof revealed !== "boolean") {
        return res.status(400).json({ error: "Invalid reveal value" });
      }

      await storage.setAnswersRevealed(revealed);
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error toggling reveal:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Admin: Clear all results
  app.delete("/api/admin/results", async (_req, res) => {
    try {
      await storage.clearResults();
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing results:", error);
      res.status(500).json({ error: "Failed to clear results" });
    }
  });

  return httpServer;
}
