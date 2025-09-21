import { useState } from 'react';
import { CheckCircle2, Circle, Flame, Target, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  cadence: 'daily' | 'weekly';
  streak: number;
  completedToday: boolean;
  credits: number;
  targetDays?: number;
  completedDays?: number;
}

interface HabitTrackerProps {
  habit: Habit;
  onToggleComplete?: (habitId: string) => void;
  className?: string;
}

export function HabitTracker({ habit, onToggleComplete, className }: HabitTrackerProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Mock delay
    onToggleComplete?.(habit.id);
    setIsCompleting(false);
  };

  const weeklyProgress = habit.targetDays ? (habit.completedDays || 0) / habit.targetDays * 100 : 0;

  return (
    <Card className={cn(
      "group transition-smooth hover:shadow-medium",
      habit.completedToday && "bg-success/5 border-success/20",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{habit.name}</CardTitle>
          
          {/* Complete button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-bounce",
              isCompleting && "animate-pulse"
            )}
            onClick={handleToggleComplete}
            disabled={isCompleting}
          >
            {habit.completedToday ? (
              <CheckCircle2 className="h-6 w-6 text-success" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Streak and Credits */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5">
              <Flame className={cn(
                "h-4 w-4",
                habit.streak > 0 ? "text-orange-500" : "text-muted-foreground"
              )} />
              <span className="text-sm font-medium">
                {habit.streak} day{habit.streak !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Credits */}
            {habit.credits > 0 && (
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                <Coins className="h-3 w-3 mr-1" />
                {habit.credits}
              </Badge>
            )}
          </div>

          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              habit.cadence === 'daily' ? "text-primary" : "text-accent"
            )}
          >
            {habit.cadence}
          </Badge>
        </div>

        {/* Weekly progress for weekly habits */}
        {habit.cadence === 'weekly' && habit.targetDays && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Weekly Progress</span>
              <span className="font-medium">
                {habit.completedDays || 0}/{habit.targetDays}
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
          </div>
        )}

        {/* Status message */}
        <p className="text-xs text-muted-foreground">
          {habit.completedToday 
            ? "✨ Completed today! Keep it up!" 
            : "Ready to continue your streak?"}
        </p>
      </CardContent>
    </Card>
  );
}