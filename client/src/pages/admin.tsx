import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff, Users, Trophy, Trash2, RefreshCw, Lock, LockOpen } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { QuizResult, AppSettings } from "@shared/schema";
import { quizQuestions } from "@shared/schema";

const ADMIN_CODE = "890456";

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState("");

  const { data: settings, isLoading: settingsLoading } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  const { data: results, isLoading: resultsLoading } = useQuery<QuizResult[]>({
    queryKey: ["/api/results"],
    refetchInterval: 10000,
  });

  const toggleRevealMutation = useMutation({
    mutationFn: async (revealed: boolean) => {
      return apiRequest("POST", "/api/admin/reveal", { revealed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: settings?.answersRevealed ? "Answers Hidden" : "Answers Revealed",
        description: settings?.answersRevealed
          ? "Participants can no longer see the correct answers."
          : "All participants can now see the correct answers!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearResultsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/admin/results");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      toast({
        title: "Results Cleared",
        description: "All quiz results have been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear results. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleReveal = () => {
    toggleRevealMutation.mutate(!settings?.answersRevealed);
  };

  const handleClearResults = () => {
    if (window.confirm("Are you sure you want to clear all quiz results? This cannot be undone.")) {
      clearResultsMutation.mutate();
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setIsAuthenticated(true);
      setCode("");
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel!",
      });
    } else {
      setCode("");
      toast({
        title: "Invalid Code",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalParticipants = results?.length || 0;
  const averageScore = results && results.length > 0
    ? Math.round((results.reduce((sum, r) => sum + r.score, 0) / results.length) * 10) / 10
    : 0;
  const perfectScores = results?.filter(r => r.score === quizQuestions.length).length || 0;

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Enter the admin code to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-code">Admin Code</Label>
                <Input
                  id="admin-code"
                  type="password"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                  className="text-lg tracking-widest"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <LockOpen className="w-4 h-4 mr-2" />
                Unlock Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-muted-foreground">Manage the quiz and view results</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
            className="gap-2"
          >
            <Lock className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalParticipants}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageScore}/{quizQuestions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Perfect Scores</CardTitle>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{perfectScores}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settings?.answersRevealed ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
                Answer Visibility
              </CardTitle>
              <CardDescription>
                Control whether participants can see the correct answers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reveal-toggle" className="text-base">
                    Reveal Answers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {settings?.answersRevealed
                      ? "Answers are currently visible to all participants"
                      : "Answers are hidden until you reveal them"}
                  </p>
                </div>
                <Switch
                  id="reveal-toggle"
                  data-testid="switch-reveal-answers"
                  checked={settings?.answersRevealed ?? false}
                  onCheckedChange={handleToggleReveal}
                  disabled={settingsLoading || toggleRevealMutation.isPending}
                />
              </div>
              <div className="pt-4 border-t">
                <Badge 
                  variant={settings?.answersRevealed ? "default" : "secondary"}
                  className="text-sm"
                >
                  {settings?.answersRevealed ? "Answers Visible" : "Answers Hidden"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Clear results to start a new quiz session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will remove all quiz results from the system. Use this when starting a new quiz session.
              </p>
              <Button
                data-testid="button-clear-results"
                variant="destructive"
                onClick={handleClearResults}
                disabled={clearResultsMutation.isPending || totalParticipants === 0}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Results
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>All participant submissions</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/results"] });
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {resultsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading results...
              </div>
            ) : results && results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Score</th>
                      <th className="text-left py-3 px-4 font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results
                      .sort((a, b) => b.score - a.score)
                      .map((result, index) => (
                        <tr key={result.id} className="border-b last:border-0">
                          <td className="py-3 px-4">
                            <Badge variant={index < 3 ? "default" : "secondary"}>
                              #{index + 1}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{result.playerName}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold">{result.score}</span>
                            <span className="text-muted-foreground">/{result.totalQuestions}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-sm">
                            {new Date(result.completedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No quiz submissions yet</p>
                <p className="text-sm">Results will appear here as participants complete the quiz</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
