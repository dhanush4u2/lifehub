import { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBoards, useLists, useCards } from '@/hooks/useBoards';
import { useAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function Dashboard() {
  const { user } = useAuth();
  const { boards, createBoard, loading: boardsLoading } = useBoards();
  const [selectedBoard, setSelectedBoard] = useState<string | undefined>();
  const { lists, loading: listsLoading } = useLists(selectedBoard);
  const { calendarDays, markTasksCompleted, updateAttendance } = useAttendance();

  // Select first board by default
  useEffect(() => {
    if (boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0].id);
    }
  }, [boards, selectedBoard]);

  // Create a default board if none exist
  useEffect(() => {
    const initBoard = async () => {
      if (!boardsLoading && boards.length === 0 && user) {
        await createBoard('Personal Board');
      }
    };
    initBoard();
  }, [boards, boardsLoading, user]);

  const todaysDate = new Date().toISOString().split('T')[0];
  const todayAttendance = calendarDays.find((d) => d.date === todaysDate);

  if (boardsLoading || listsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <CreateBoardDialog onCreateBoard={createBoard} />
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="completed-tasks"
                checked={todayAttendance?.completed_planned_tasks || false}
                onCheckedChange={(checked) => {
                  markTasksCompleted(todaysDate, checked as boolean);
                }}
              />
              <Label htmlFor="completed-tasks" className="cursor-pointer">
                Completed my planned tasks
              </Label>
            </div>
            {todayAttendance?.completed_planned_tasks && (
              <Badge variant="default">✨ Great job!</Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="went-to-college"
                checked={todayAttendance?.went_to_college !== false}
                onCheckedChange={(checked) => {
                  const wentToCollege = checked as boolean;
                  updateAttendance(todaysDate, {
                    went_to_college: wentToCollege,
                    absence_type: wentToCollege ? null : undefined,
                  });
                }}
              />
              <Label htmlFor="went-to-college" className="cursor-pointer">
                Went to college
              </Label>
            </div>
            {todayAttendance?.went_to_college === false && (
              <Badge variant="outline">Absent</Badge>
            )}
          </div>

          {todayAttendance?.went_to_college === false && (
            <div className="pl-8 space-y-2 border-l-2 border-muted">
              <Select
                value={todayAttendance.absence_type || undefined}
                onValueChange={(value) => {
                  updateAttendance(todaysDate, {
                    absence_type: value as 'personal' | 'sick' | 'permission',
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select absence type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Optional note..."
                value={todayAttendance.absence_note || ''}
                onChange={(e) => {
                  updateAttendance(todaysDate, {
                    absence_note: e.target.value,
                  });
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Board View */}
      {boards.length > 0 && (
        <div className="flex-1 overflow-auto">
          <div className="flex gap-2 mb-4">
            {boards.map((board) => (
              <Button
                key={board.id}
                variant={selectedBoard === board.id ? 'default' : 'outline'}
                onClick={() => setSelectedBoard(board.id)}
              >
                {board.name}
              </Button>
            ))}
          </div>

          {/* Kanban Lists */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {lists.map((list) => (
              <ListColumn key={list.id} list={list} />
            ))}
          </div>
        </div>
      )}

      {boards.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No boards yet</p>
            <CreateBoardDialog onCreateBoard={createBoard} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CreateBoardDialog({ onCreateBoard }: { onCreateBoard: (name: string) => Promise<any> }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (name.trim()) {
      await onCreateBoard(name.trim());
      setName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work Projects"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ListColumn({ list }: { list: any }) {
  const { cards, createCard, toggleCardComplete } = useCards(list.id);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = async () => {
    if (newCardTitle.trim()) {
      await createCard({
        title: newCardTitle.trim(),
        status: 'todo',
        priority: 'P2',
        labels: [],
        attachments: [],
        position: cards.length,
      });
      setNewCardTitle('');
      setShowAddCard(false);
    }
  };

  return (
    <div className="min-w-[280px] max-w-[280px]">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{list.name}</CardTitle>
            <Badge variant="secondary">{cards.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {cards.map((card) => (
            <Card key={card.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={card.status === 'done'}
                    onCheckedChange={() => toggleCardComplete(card.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${card.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                      {card.title}
                    </p>
                    {card.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {card.priority}
                      </Badge>
                      {card.due_date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(card.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {showAddCard ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Task title..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard();
                  }
                  if (e.key === 'Escape') {
                    setShowAddCard(false);
                    setNewCardTitle('');
                  }
                }}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCard}>
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowAddCard(false);
                    setNewCardTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowAddCard(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
