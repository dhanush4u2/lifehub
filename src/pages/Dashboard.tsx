import { useState } from 'react';
import { Calendar, Plus, Zap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LifeScoreCard } from '@/components/dashboard/LifeScoreCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { HabitTracker } from '@/components/habits/HabitTracker';

// Mock data
const mockLifeScore = {
  score: 78,
  trend: 'up' as const,
  breakdown: {
    tasks: 85,
    habits: 70,
    events: 80,
    mood: 75,
  }
};

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

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Finish DBMS Unit 1 notes',
    description: 'Complete notes for database management system fundamentals',
    status: 'todo',
    priority: 1,
    dueAt: '2025-01-15',
    credits: 10,
  },
  {
    id: '2',
    title: 'Learn React Router deep dive',
    description: 'Complete the advanced React Router tutorial',
    status: 'todo',
    priority: 2,
    credits: 8,
  },
  {
    id: '3',
    title: 'Call mom',
    status: 'todo',
    priority: 1,
    credits: 5,
  },
];

const mockHabits = [
  {
    id: '1',
    name: 'Morning workout',
    cadence: 'daily' as const,
    streak: 7,
    completedToday: true,
    credits: 3,
  },
  {
    id: '2',
    name: 'Read for 30 minutes',
    cadence: 'daily' as const,
    streak: 3,
    completedToday: false,
    credits: 2,
  },
  {
    id: '3',
    name: 'Team meetings',
    cadence: 'weekly' as const,
    streak: 2,
    completedToday: false,
    credits: 5,
    targetDays: 3,
    completedDays: 2,
  },
];

const mockUpcomingEvents = [
  { id: '1', title: 'Team standup', time: '10:00 AM', color: 'hub-tech' },
  { id: '2', title: 'Gym session', time: '6:00 PM', color: 'hub-fitness' },
  { id: '3', title: 'Study group', time: '8:00 PM', color: 'hub-academics' },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(mockTasks);
  const [habits, setHabits] = useState(mockHabits);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'done' ? 'todo' as const : 'done' as const }
        : task
    ));
  };

  const handleHabitComplete = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, completedToday: !habit.completedToday, streak: habit.completedToday ? habit.streak - 1 : habit.streak + 1 }
        : habit
    ));
  };

  const todaysDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-1">{todaysDate}</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth">
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
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
                <p className="text-2xl font-bold">247</p>
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
                <p className="text-2xl font-bold">12/15</p>
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
                <p className="text-2xl font-bold">7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <LifeScoreCard {...mockLifeScore} />
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
          
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleComplete={handleTaskComplete}
              />
            ))}
          </div>

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
            <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>
            <div className="space-y-3">
              {habits.filter(h => h.cadence === 'daily').map((habit) => (
                <HabitTracker 
                  key={habit.id} 
                  habit={habit} 
                  onToggleComplete={handleHabitComplete}
                />
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockUpcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}