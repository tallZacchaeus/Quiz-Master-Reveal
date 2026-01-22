import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { quizQuestions, shuffleArray } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const TIMER_DURATION = 10;

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizQuestions.length).fill(""));
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const playerName = localStorage.getItem("playerName");

  useEffect(() => {
    if (!playerName) {
      setLocation("/");
    }
  }, [playerName, setLocation]);

  const submitMutation = useMutation({
    mutationFn: async (data: { playerName: string; answers: string[]; score: number }) => {
      return apiRequest("POST", "/api/quiz/submit", data);
    },
    onSuccess: () => {
      setLocation("/results");
    },
    onError: () => {
      toast({
        title: "Submission Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const calculateScore = useCallback(() => {
    let score = 0;
    answers.forEach((answer, index) => {
      const correctAnswer = quizQuestions[index].correctAnswer;
      if (answer === correctAnswer) {
        score++;
      }
    });
    return score;
  }, [answers]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const score = calculateScore();
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    localStorage.setItem("quizScore", String(score));

    submitMutation.mutate({
      playerName: playerName || "Anonymous",
      answers,
      score,
    });
  }, [isSubmitting, calculateScore, answers, playerName, submitMutation]);

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(TIMER_DURATION);
    } else {
      handleSubmit();
    }
  }, [currentQuestion, handleSubmit]);

  useEffect(() => {
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          moveToNextQuestion();
          return TIMER_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isSubmitting, moveToNextQuestion]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    moveToNextQuestion();
  };

  if (!playerName) {
    return null;
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;
  const isTimerWarning = timeLeft <= 5;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Playing as</p>
            <p className="font-semibold">{playerName}</p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-1">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Badge>
        </div>

        <Progress value={progress} className="h-2 mb-6" />

        <Card className="relative overflow-visible">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
                isTimerWarning 
                  ? "bg-destructive text-destructive-foreground timer-warning" 
                  : "bg-card border"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-bold text-xl tabular-nums">{timeLeft}s</span>
            </div>
          </div>

          <CardHeader className="pt-10">
            <CardTitle className="text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {question.options?.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerChange(option)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                    answers[currentQuestion] === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                data-testid="button-next-question"
                onClick={handleNext}
                className="flex-1 h-12 text-lg"
                disabled={isSubmitting || !answers[currentQuestion]}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : isLastQuestion ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Finish Quiz
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-center gap-2 pt-4 border-t flex-wrap">
              {quizQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? "bg-primary text-primary-foreground"
                      : index < currentQuestion
                      ? answers[index]
                        ? "bg-green-500/20 text-green-700 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Answer before the timer runs out!
        </p>
      </div>
    </div>
  );
}
