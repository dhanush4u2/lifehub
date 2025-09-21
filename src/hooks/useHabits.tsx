import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Habit {
  id: string;
  name: string;
  cadence: string;
  streak: number;
  completed_today: boolean;
  credits: number;
  target_days?: number;
  completed_days?: number;
  hub_id?: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export const useHabits = (hubId?: string) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;
    
    setLoading(true);
    let query = supabase
      .from('habits')
      .select('*')
      .eq('owner', user.id)
      .order('created_at', { ascending: false });

    if (hubId) {
      query = query.eq('hub_id', hubId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching habits:', error);
    } else {
      setHabits(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, [user, hubId]);

  const addHabit = async (habitData: Partial<Habit> & { name: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habitData, owner: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding habit:', error);
    } else {
      setHabits(prev => [data, ...prev]);
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating habit:', error);
    } else {
      setHabits(prev => prev.map(habit => habit.id === id ? data : habit));
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting habit:', error);
    } else {
      setHabits(prev => prev.filter(habit => habit.id !== id));
    }
  };

  const toggleHabitComplete = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newCompletedToday = !habit.completed_today;
    const newStreak = newCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    await updateHabit(id, { 
      completed_today: newCompletedToday, 
      streak: newStreak 
    });
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitComplete,
    refetch: fetchHabits
  };
};