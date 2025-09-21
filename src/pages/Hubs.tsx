import { useState } from 'react';
import { Plus, MoreVertical, Users, Calendar, Target, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock hub data with stats
const mockHubs = [
  {
    id: '1',
    title: 'Academics',
    description: 'University coursework, assignments, and study goals',
    color: 'hub-academics',
    stats: {
      tasks: 12,
      completed: 8,
      habits: 3,
      goals: 2,
    },
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    title: 'Tech',
    description: 'Programming projects, learning new technologies',
    color: 'hub-tech',
    stats: {
      tasks: 8,
      completed: 6,
      habits: 2,
      goals: 3,
    },
    lastActivity: '1 hour ago',
  },
  {
    id: '3',
    title: 'Fitness',
    description: 'Workout routines, health goals, and nutrition',
    color: 'hub-fitness',
    stats: {
      tasks: 5,
      completed: 4,
      habits: 4,
      goals: 1,
    },
    lastActivity: '30 minutes ago',
  },
  {
    id: '4',
    title: 'Relationships',
    description: 'Family time, friends, social activities',
    color: 'hub-relationships',
    stats: {
      tasks: 6,
      completed: 3,
      habits: 2,
      goals: 1,
    },
    lastActivity: '4 hours ago',
  },
  {
    id: '5',
    title: 'Personal',
    description: 'Self-care, hobbies, personal development',
    color: 'hub-personal',
    stats: {
      tasks: 4,
      completed: 2,
      habits: 3,
      goals: 2,
    },
    lastActivity: '1 day ago',
  },
];

export default function Hubs() {
  const [hubs] = useState(mockHubs);

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Hubs</h1>
          <p className="text-muted-foreground mt-1">
            Organize your life into focused areas
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth">
          <Plus className="h-4 w-4 mr-2" />
          Create Hub
        </Button>
      </div>

      {/* Hub Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hubs</p>
                <p className="text-2xl font-bold">{hubs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">
                  {hubs.reduce((acc, hub) => acc + hub.stats.tasks, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Habits</p>
                <p className="text-2xl font-bold">
                  {hubs.reduce((acc, hub) => acc + hub.stats.habits, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goals</p>
                <p className="text-2xl font-bold">
                  {hubs.reduce((acc, hub) => acc + hub.stats.goals, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hubs.map((hub) => {
          const completionRate = getCompletionRate(hub.stats.completed, hub.stats.tasks);
          
          return (
            <Card key={hub.id} className="group glass hover:shadow-medium transition-smooth cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl ${hub.color} flex items-center justify-center`}>
                      <div className="h-6 w-6 bg-white/90 rounded-lg" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{hub.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Active {hub.lastActivity}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Hub</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete Hub
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {hub.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tasks</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{hub.stats.completed}/{hub.stats.tasks}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          completionRate >= 80 ? 'bg-success/10 text-success' :
                          completionRate >= 60 ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}
                      >
                        {completionRate}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Habits</span>
                    <span className="font-medium">{hub.stats.habits}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Goals</span>
                    <span className="font-medium">{hub.stats.goals}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-medium text-primary">{completionRate}%</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.location.href = `/hub/${hub.id}`}
                >
                  Open Hub
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Create New Hub Card */}
        <Card className="group glass border-dashed border-2 hover:border-primary/50 transition-smooth cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Create New Hub</h3>
              <p className="text-sm text-muted-foreground">
                Add a new area to organize your life
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}