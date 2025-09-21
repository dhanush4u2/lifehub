import { useState } from 'react';
import { TrendingUp, Calendar, Target, Activity, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const lifeScoreData = [
  { date: 'Mon', score: 72 },
  { date: 'Tue', score: 78 },
  { date: 'Wed', score: 85 },
  { date: 'Thu', score: 82 },
  { date: 'Fri', score: 88 },
  { date: 'Sat', score: 75 },
  { date: 'Sun', score: 79 },
];

const taskCompletionData = [
  { date: 'Week 1', completed: 28, total: 35 },
  { date: 'Week 2', completed: 32, total: 38 },
  { date: 'Week 3', completed: 29, total: 33 },
  { date: 'Week 4', completed: 35, total: 40 },
];

const hubBreakdownData = [
  { name: 'Academics', value: 30, color: '#8B5CF6' },
  { name: 'Tech', value: 25, color: '#06B6D4' },
  { name: 'Fitness', value: 20, color: '#10B981' },
  { name: 'Relationships', value: 15, color: '#F472B6' },
  { name: 'Personal', value: 10, color: '#F59E0B' },
];

const habitStreakData = [
  { habit: 'Morning Workout', streak: 15, target: 30 },
  { habit: 'Reading', streak: 8, target: 30 },
  { habit: 'Meditation', streak: 12, target: 30 },
  { habit: 'Journaling', streak: 5, target: 30 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and discover patterns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Life Score</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-success">+5% vs last week</p>
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
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">86%</p>
                <p className="text-xs text-success">+2% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Streaks</p>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-warning">Longest: 15 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productivity Days</p>
                <p className="text-2xl font-bold">5/7</p>
                <p className="text-xs text-accent">This week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Life Score Trend */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Life Balance Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lifeScoreData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hub Distribution */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Time Distribution by Hub</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hubBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {hubBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {hubBreakdownData.map((hub) => (
                    <Badge key={hub.name} variant="outline" className="text-xs">
                      <div 
                        className="w-2 h-2 rounded-full mr-1" 
                        style={{ backgroundColor: hub.color }}
                      />
                      {hub.name} ({hub.value}%)
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Task Completion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Habit Streak Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {habitStreakData.map((habit) => (
                <div key={habit.habit} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{habit.habit}</span>
                    <span className="text-sm text-muted-foreground">
                      {habit.streak}/{habit.target} days
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full transition-all"
                      style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Strong Correlations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <span className="text-sm">Morning Workouts → Better Sleep</span>
                  <Badge className="bg-success/20 text-success">+0.84</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm">Task Completion → Life Score</span>
                  <Badge className="bg-primary/20 text-primary">+0.78</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <span className="text-sm">Social Events → Mood</span>
                  <Badge className="bg-warning/20 text-warning">+0.65</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-2">💡 Pattern Detected</p>
                  <p className="text-sm text-muted-foreground">
                    You're most productive on Tuesday and Wednesday. Consider scheduling important tasks on these days.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-success/10 to-accent/10 rounded-lg">
                  <p className="text-sm font-medium mb-2">🎯 Recommendation</p>
                  <p className="text-sm text-muted-foreground">
                    Your habit streaks improve your life score by 23%. Focus on maintaining daily routines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}