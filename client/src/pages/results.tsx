import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Home, Eye, EyeOff, Crown, Medal, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { quizQuestions } from "@shared/schema";
import type { QuizResult, AppSettings } from "@shared/schema";

export default function Results() {
  const [, setLocation] = useLocation();
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    const storedScore = localStorage.getItem("quizScore");
    const storedAnswers = localStorage.getItem("quizAnswers");

    if (!storedName || !storedScore) {
      setLocation("/");
      return;
    }

    setPlayerName(storedName);
    setScore(parseInt(storedScore, 10));
    setAnswers(storedAnswers ? JSON.parse(storedAnswers) : []);
  }, [setLocation]);

  const { data: settings } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
    refetchInterval: 5000,
  });

  const { data: leaderboard } = useQuery<QuizResult[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 10000,
  });

  const answersRevealed = settings?.answersRevealed ?? false;

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage === 100) return "Perfect Score! You're a GVIM Expert!";
    if (percentage >= 80) return "Excellent! You know GVIM very well!";
    if (percentage >= 60) return "Good job! You're getting there!";
    if (percentage >= 40) return "Not bad! Keep learning about GVIM!";
    return "Keep attending services to learn more!";
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const handlePlayAgain = () => {
    localStorage.removeItem("quizScore");
    localStorage.removeItem("quizAnswers");
    setLocation("/");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  if (!playerName) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Quiz Complete!</h1>
          <p className="text-muted-foreground text-lg">{getScoreMessage()}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Your Score
              </CardTitle>
              <CardDescription>Well done, {playerName}!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className={`text-7xl font-bold ${getScoreColor()}`}>
                  {score}
                  <span className="text-3xl text-muted-foreground">/{quizQuestions.length}</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  {Math.round((score / quizQuestions.length) * 100)}% Correct
                </p>
              </div>

              <Button
                data-testid="button-play-again"
                onClick={handlePlayAgain}
                className="w-full"
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Play Again
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top performers</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((result, index) => (
                    <div
                      key={result.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        result.playerName === playerName
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50"
                      }`}
                    >
                      <div className="w-8 flex justify-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.playerName}</p>
                      </div>
                      <Badge variant="secondary">
                        {result.score}/{result.totalQuestions}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No scores yet. You're the first!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {answersRevealed ? (
                <>
                  <Eye className="w-5 h-5" />
                  Your Answers & Correct Answers
                </>
              ) : (
                <>
                  <EyeOff className="w-5 h-5" />
                  Your Answers
                </>
              )}
            </CardTitle>
            <CardDescription>
              {answersRevealed
                ? "Review your answers and see the correct ones"
                : "Answers will be revealed by the quiz master after everyone finishes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizQuestions.map((question, index) => {
                const userAnswer = answers[index] || "(No answer)";
                const isCorrectVisible = answersRevealed;
                const isCorrect =
                  answersRevealed &&
                  (question.correctAnswer.toLowerCase().includes(userAnswer.toLowerCase()) ||
                    userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase()) ||
                    userAnswer.toLowerCase() === question.correctAnswer.toLowerCase());

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      answersRevealed
                        ? isCorrect
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-destructive/30 bg-destructive/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="shrink-0">
                        Q{index + 1}
                      </Badge>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium">{question.question}</p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Your answer: </span>
                            <span className={answersRevealed && !isCorrect ? "text-destructive" : ""}>
                              {userAnswer}
                            </span>
                          </p>
                          {isCorrectVisible && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Correct answer: </span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {question.correctAnswer}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
