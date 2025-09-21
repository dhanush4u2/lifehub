import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  due_at?: string;
  credits: number;
  hub_id?: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = (hubId?: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('owner', user.id)
      .order('created_at', { ascending: false });

    if (hubId) {
      query = query.eq('hub_id', hubId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [user, hubId]);

  const addTask = async (taskData: Partial<Task> & { title: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, owner: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setTasks(prev => [data, ...prev]);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setTasks(prev => prev.map(task => task.id === id ? data : task));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await updateTask(id, { status: newStatus });
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refetch: fetchTasks
  };
};