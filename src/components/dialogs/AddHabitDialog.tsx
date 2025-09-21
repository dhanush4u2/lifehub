import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '@/hooks/useHabits';
import { useHubs } from '@/hooks/useHubs';
import { Plus } from 'lucide-react';

interface AddHabitDialogProps {
  hubId?: string;
}

export function AddHabitDialog({ hubId }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [cadence, setCadence] = useState('daily');
  const [selectedHubId, setSelectedHubId] = useState(hubId || '');
  const [credits, setCredits] = useState('2');
  
  const { addHabit } = useHabits();
  const { hubs } = useHubs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addHabit({
      name,
      cadence,
      hub_id: selectedHubId || undefined,
      credits: parseInt(credits),
      streak: 0,
      completed_today: false
    });

    // Reset form
    setName('');
    setCadence('daily');
    setCredits('2');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter habit name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cadence">Frequency</Label>
              <Select value={cadence} onValueChange={setCadence}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                min="1"
                max="10"
              />
            </div>
          </div>

          {!hubId && hubs.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="hub">Hub</Label>
              <Select value={selectedHubId} onValueChange={setSelectedHubId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a hub (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {hubs.map((hub) => (
                    <SelectItem key={hub.id} value={hub.id}>
                      {hub.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}