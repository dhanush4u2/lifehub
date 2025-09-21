import { useState } from 'react';
import { Coins, Crown, Palette, Sparkles, Star, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Mock data for rewards
const userCredits = 247;
const userLevel = 5;
const userXP = 1250;
const nextLevelXP = 1500;

const themes = [
  {
    id: '1',
    name: 'Aurora',
    description: 'Beautiful northern lights inspired theme',
    price: 100,
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    owned: true,
    active: false,
  },
  {
    id: '2',
    name: 'Sunset',
    description: 'Warm sunset colors for a cozy feeling',
    price: 80,
    preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    owned: false,
    active: false,
  },
  {
    id: '3',
    name: 'Ocean',
    description: 'Deep ocean blues and teals',
    price: 120,
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    owned: false,
    active: false,
  },
  {
    id: '4',
    name: 'Forest',
    description: 'Natural greens and earth tones',
    price: 90,
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    owned: true,
    active: true,
  },
];

const powerUps = [
  {
    id: '1',
    name: 'Double XP',
    description: 'Earn 2x XP for 24 hours',
    price: 50,
    icon: Star,
    duration: '24h',
  },
  {
    id: '2',
    name: 'Streak Shield',
    description: 'Protect your habit streak for 3 days',
    price: 75,
    icon: Crown,
    duration: '3 days',
  },
  {
    id: '3',
    name: 'Task Boost',
    description: 'Get 50% more credits from completed tasks',
    price: 60,
    icon: Sparkles,
    duration: '48h',
  },
];

const achievements = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first task',
    reward: 10,
    unlocked: true,
    progress: 100,
  },
  {
    id: '2',
    name: 'Streak Master',
    description: 'Maintain a 7-day habit streak',
    reward: 50,
    unlocked: true,
    progress: 100,
  },
  {
    id: '3',
    name: 'Power User',
    description: 'Complete 100 tasks',
    reward: 100,
    unlocked: false,
    progress: 67,
  },
  {
    id: '4',
    name: 'Life Balance',
    description: 'Maintain 80%+ life score for a week',
    reward: 75,
    unlocked: false,
    progress: 85,
  },
];

export default function Rewards() {
  const [activeTab, setActiveTab] = useState('themes');

  const handlePurchase = (itemId: string, price: number) => {
    if (userCredits >= price) {
      // Mock purchase logic
      console.log(`Purchasing item ${itemId} for ${price} credits`);
    }
  };

  const levelProgress = ((userXP - (userLevel - 1) * 250) / 250) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Rewards Store</h1>
          <p className="text-muted-foreground mt-1">
            Spend your credits on themes, power-ups, and more
          </p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-warning to-orange-500 flex items-center justify-center">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold">{userCredits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{userLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Progress to Level {userLevel + 1}</p>
              <p className="text-sm font-medium">{userXP}/{nextLevelXP} XP</p>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="powerups">Power-ups</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Card key={theme.id} className={cn(
                "glass transition-smooth hover:shadow-medium",
                theme.active && "ring-2 ring-primary shadow-glow"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{theme.name}</CardTitle>
                    {theme.active && (
                      <Badge className="bg-success/20 text-success">Active</Badge>
                    )}
                    {theme.owned && !theme.active && (
                      <Badge variant="outline">Owned</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Theme Preview */}
                  <div 
                    className="h-24 w-full rounded-lg"
                    style={{ background: theme.preview }}
                  />
                  
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-warning" />
                      <span className="font-medium">{theme.price}</span>
                    </div>
                    
                    {theme.owned ? (
                      <Button 
                        variant={theme.active ? "outline" : "default"}
                        size="sm"
                        disabled={theme.active}
                        onClick={() => console.log(`Activating theme ${theme.id}`)}
                      >
                        {theme.active ? "Active" : "Use Theme"}
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        disabled={userCredits < theme.price}
                        onClick={() => handlePurchase(theme.id, theme.price)}
                      >
                        {userCredits >= theme.price ? "Purchase" : "Not enough credits"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="powerups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {powerUps.map((powerUp) => (
              <Card key={powerUp.id} className="glass transition-smooth hover:shadow-medium">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <powerUp.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{powerUp.name}</h3>
                      <p className="text-xs text-muted-foreground">{powerUp.duration}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {powerUp.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-warning" />
                      <span className="font-medium">{powerUp.price}</span>
                    </div>
                    
                    <Button 
                      size="sm"
                      disabled={userCredits < powerUp.price}
                      onClick={() => handlePurchase(powerUp.id, powerUp.price)}
                    >
                      {userCredits >= powerUp.price ? "Activate" : "Not enough credits"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={cn(
                "glass transition-smooth",
                achievement.unlocked ? "bg-success/5 border-success/20" : ""
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-lg flex items-center justify-center",
                      achievement.unlocked 
                        ? "bg-gradient-to-r from-success to-green-600" 
                        : "bg-muted"
                    )}>
                      {achievement.unlocked ? (
                        <Crown className="h-6 w-6 text-white" />
                      ) : (
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        {achievement.unlocked && (
                          <Badge className="bg-success/20 text-success">Unlocked</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      
                      {!achievement.unlocked && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-1" />
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-warning" />
                        <span className="font-medium">{achievement.reward}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Credits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}