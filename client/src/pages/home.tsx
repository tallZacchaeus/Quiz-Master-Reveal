import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Church, Trophy, Clock, Users } from "lucide-react";

export default function Home() {
  const [name, setName] = useState("");
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      setError("Please enter your name to continue");
      return;
    }
    localStorage.setItem("playerName", name.trim());
    setLocation("/quiz");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Church className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">GVIM Quiz Challenge</h1>
          <p className="text-muted-foreground text-lg">Test your knowledge about our beloved church family</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>Enter your name to begin the quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                data-testid="input-player-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="text-lg h-12"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <Button 
              data-testid="button-start-quiz"
              onClick={handleStart} 
              className="w-full h-12 text-lg"
              size="lg"
            >
              Start Quiz
            </Button>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary/20 mb-2">
                  <Trophy className="w-5 h-5 text-secondary-foreground" />
                </div>
                <p className="text-sm font-medium">10 Questions</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 mb-2">
                  <Clock className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-sm font-medium">20s Timer</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium">Leaderboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          God bless you real good!
        </p>
      </div>
    </div>
  );
}
