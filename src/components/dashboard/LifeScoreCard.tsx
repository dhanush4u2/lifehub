import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LifeScoreProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
  breakdown: {
    tasks: number;
    habits: number;
    events: number;
    mood: number;
  };
}

export function LifeScoreCard({ score, trend, breakdown }: LifeScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-success/20 to-success/5';
    if (score >= 60) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  return (
    <Card className={cn(
      "glass relative overflow-hidden",
      "bg-gradient-to-br", getScoreBg(score)
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Life Balance Score</CardTitle>
          <div className="flex items-center gap-1">
            {trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
            {trend === 'stable' && <Activity className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Score */}
        <div className="text-center">
          <div className={cn("text-4xl font-bold", getScoreColor(score))}>
            {score}%
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {score >= 80 ? 'Excellent balance!' : 
             score >= 60 ? 'Good progress' : 
             'Needs attention'}
          </p>
        </div>

        {/* Progress Bar */}
        <Progress value={score} className="h-2" />

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tasks</span>
            <span className={cn("font-medium", getScoreColor(breakdown.tasks))}>
              {breakdown.tasks}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Habits</span>
            <span className={cn("font-medium", getScoreColor(breakdown.habits))}>
              {breakdown.habits}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Events</span>
            <span className={cn("font-medium", getScoreColor(breakdown.events))}>
              {breakdown.events}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Mood</span>
            <span className={cn("font-medium", getScoreColor(breakdown.mood))}>
              {breakdown.mood}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}