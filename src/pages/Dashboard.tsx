import { useState, useEffect } from 'react';
import { Calendar, Plus, Zap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LifeScoreCard } from '@/components/dashboard/LifeScoreCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { HabitTracker } from '@/components/habits/HabitTracker';
import { AddTaskDialog } from '@/components/dialogs/AddTaskDialog';
import { AddHabitDialog } from '@/components/dialogs/AddHabitDialog';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useHubs } from '@/hooks/useHubs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Life score calculation
const calculateLifeScore = (tasks: any[], habits: any[]) => {
  if (tasks.length === 0 && habits.length === 0) return { 
    score: 0, 
    trend: 'up' as const,
    breakdown: { tasks: 0, habits: 0, events: 0, mood: 75 } 
  };
  
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const taskScore = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const completedHabits = habits.filter(h => h.completed_today).length;
  const habitScore = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;
  
  const overallScore = Math.round((taskScore * 0.4) + (habitScore * 0.3) + (80 * 0.15) + (75 * 0.15));
  
  return {
    score: overallScore,
    trend: 'up' as const,
    breakdown: {
      tasks: Math.round(taskScore),
      habits: Math.round(habitScore),
      events: 80,
      mood: 75,
    }
  };
};

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, toggleTaskComplete } = useTasks();
  const { habits, loading: habitsLoading, toggleHabitComplete } = useHabits();
  const { hubs, loading: hubsLoading } = useHubs();
  const [totalCredits, setTotalCredits] = useState(0);

  // Calculate total credits
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('credits_transactions')
        .select('amount')
        .eq('owner', user.id);
      
      const total = data?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
      setTotalCredits(total);
    };

    fetchCredits();
  }, [user]);

  // Initialize user with default hubs if they have none
  useEffect(() => {
    const initializeUser = async () => {
      if (!user || hubsLoading || hubs.length > 0) return;

      const defaultHubs = [
        { title: 'Academics', slug: 'academics', color: '#7C3AED', icon: 'book' },
        { title: 'Tech', slug: 'tech', color: '#06B6D4', icon: 'terminal' },
        { title: 'Fitness', slug: 'fitness', color: '#10B981', icon: 'dumbbell' },
        { title: 'Relationships', slug: 'relationships', color: '#F472B6', icon: 'heart' },
        { title: 'Personal', slug: 'personal', color: '#F59E0B', icon: 'user' }
      ];

      // Create default hubs for new users
      await Promise.all(
        defaultHubs.map(hub =>
          supabase.from('hubs').insert([{ ...hub, owner: user.id }])
        )
      );

      // Refresh hubs
      window.location.reload();
    };

    initializeUser();
  }, [user, hubs, hubsLoading]);

  const lifeScore = calculateLifeScore(tasks, habits);
  const todaysDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const currentStreak = Math.max(...habits.map(h => h.streak), 0);

  if (tasksLoading || habitsLoading || hubsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-1">{todaysDate}</p>
        </div>
        <AddTaskDialog />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold">{totalCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <LifeScoreCard {...lifeScore} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Focus</h2>
            <Badge variant="secondary" className="text-xs">
              {tasks.filter(t => t.status !== 'done').length} remaining
            </Badge>
          </div>
          
          {tasks.length === 0 ? (
            <Card className="glass p-6 text-center">
              <p className="text-muted-foreground mb-4">No tasks yet. Create your first task!</p>
              <AddTaskDialog />
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={{
                    ...task,
                    status: task.status as 'todo' | 'doing' | 'done',
                    priority: task.priority as 1 | 2 | 3,
                    dueAt: task.due_at
                  }} 
                  onToggleComplete={toggleTaskComplete}
                />
              ))}
            </div>
          )}

          {tasks.length > 5 && (
            <Button variant="outline" className="w-full">
              View all tasks
            </Button>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Habits */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Daily Habits</h2>
              <AddHabitDialog />
            </div>
            
            {habits.filter(h => h.cadence === 'daily').length === 0 ? (
              <Card className="glass p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">No habits yet</p>
                <AddHabitDialog />
              </Card>
            ) : (
              <div className="space-y-3">
                {habits.filter(h => h.cadence === 'daily').map((habit) => (
                  <HabitTracker 
                    key={habit.id} 
                    habit={{
                      ...habit,
                      cadence: habit.cadence as 'daily' | 'weekly',
                      completedToday: habit.completed_today
                    }} 
                    onToggleComplete={toggleHabitComplete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Today's Schedule */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">
                No events scheduled for today
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}