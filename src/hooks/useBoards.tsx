import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Board {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  board_id: string;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  estimate_hours?: number;
  due_date?: string;
  start_date?: string;
  labels: string[];
  attachments: string[];
  status: 'todo' | 'doing' | 'done';
  sprint_id?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  card_id: string;
  title: string;
  done: boolean;
  estimate_hours?: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export function useBoards() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBoards([]);
      setLoading(false);
      return;
    }

    fetchBoards();
  }, [user]);

  const fetchBoards = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBoards(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching boards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (name: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('boards')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Create default lists for the new board
      const defaultLists = [
        { board_id: data.id, name: 'Backlog', position: 0 },
        { board_id: data.id, name: 'To Do', position: 1 },
        { board_id: data.id, name: 'Doing', position: 2 },
        { board_id: data.id, name: 'Done', position: 3 },
      ];

      await supabase.from('lists').insert(defaultLists);

      setBoards((prev) => [...prev, data]);
      toast({
        title: 'Board created',
        description: `${name} board created successfully`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating board',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateBoard = async (id: string, updates: Partial<Board>) => {
    try {
      const { error } = await supabase
        .from('boards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setBoards((prev) =>
        prev.map((board) => (board.id === id ? { ...board, ...updates } : board))
      );

      toast({
        title: 'Board updated',
        description: 'Board updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating board',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      const { error } = await supabase.from('boards').delete().eq('id', id);

      if (error) throw error;

      setBoards((prev) => prev.filter((board) => board.id !== id));
      toast({
        title: 'Board deleted',
        description: 'Board deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting board',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    boards,
    loading,
    createBoard,
    updateBoard,
    deleteBoard,
    refetch: fetchBoards,
  };
}

export function useLists(boardId?: string) {
  const { user } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !boardId) {
      setLists([]);
      setLoading(false);
      return;
    }

    fetchLists();
  }, [user, boardId]);

  const fetchLists = async () => {
    if (!boardId) return;

    try {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });

      if (error) throw error;
      setLists(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching lists',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    lists,
    loading,
    refetch: fetchLists,
  };
}

export function useCards(listId?: string) {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !listId) {
      setCards([]);
      setLoading(false);
      return;
    }

    fetchCards();
  }, [user, listId]);

  const fetchCards = async () => {
    if (!listId) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('list_id', listId)
        .order('position', { ascending: true });

      if (error) throw error;
      setCards((data as Card[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching cards',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (card: Omit<Partial<Card>, 'id' | 'list_id' | 'created_at' | 'updated_at'> & { title: string }) => {
    if (!user || !listId) return;

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{ ...card, list_id: listId }])
        .select()
        .single();

      if (error) throw error;

      setCards((prev) => [...prev, data as Card]);
      toast({
        title: 'Task created',
        description: 'Task created successfully',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateCard = async (id: string, updates: Partial<Card>) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
      );

      toast({
        title: 'Task updated',
        description: 'Task updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase.from('cards').delete().eq('id', id);

      if (error) throw error;

      setCards((prev) => prev.filter((card) => card.id !== id));
      toast({
        title: 'Task deleted',
        description: 'Task deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleCardComplete = async (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    const newStatus = card.status === 'done' ? 'todo' : 'done';
    await updateCard(id, { status: newStatus });
  };

  return {
    cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    toggleCardComplete,
    refetch: fetchCards,
  };
}
