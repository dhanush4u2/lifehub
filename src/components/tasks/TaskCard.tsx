import { useState } from 'react';
import { CheckCircle2, Circle, Calendar, Flag, Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  priority: 1 | 2 | 3;
  dueAt?: string;
  credits: number;
  hubColor?: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  className?: string;
}

export function TaskCard({ task, onToggleComplete, className }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    if (task.status === 'done') return;
    
    setIsCompleting(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Mock delay
    onToggleComplete?.(task.id);
    setIsCompleting(false);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-destructive border-destructive/20 bg-destructive/5';
      case 2: return 'text-warning border-warning/20 bg-warning/5';
      case 3: return 'text-muted-foreground border-border bg-muted/50';
      default: return 'text-muted-foreground border-border bg-muted/50';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Low';
    }
  };

  const isCompleted = task.status === 'done';
  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && !isCompleted;

  return (
    <Card className={cn(
      "group transition-smooth hover:shadow-medium",
      isCompleted && "opacity-75",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 rounded-full transition-bounce",
              isCompleting && "animate-pulse"
            )}
            onClick={handleToggleComplete}
            disabled={isCompleting}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
            )}
          </Button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-medium leading-tight",
                isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.credits > 0 && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                  <Coins className="h-3 w-3 mr-1" />
                  {task.credits}
                </Badge>
              )}
            </div>

            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-2 mt-2">
              {/* Priority */}
              <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                <Flag className="h-2.5 w-2.5 mr-1" />
                {getPriorityText(task.priority)}
              </Badge>

              {/* Due date */}
              {task.dueAt && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    isOverdue 
                      ? "text-destructive border-destructive/20 bg-destructive/5" 
                      : "text-muted-foreground"
                  )}
                >
                  <Calendar className="h-2.5 w-2.5 mr-1" />
                  {new Date(task.dueAt).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}