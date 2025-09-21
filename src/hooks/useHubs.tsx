import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Hub {
  id: string;
  title: string;
  slug: string;
  color: string;
  icon: string;
  is_default: boolean;
  owner: string;
  created_at: string;
  updated_at: string;
}

export const useHubs = () => {
  const { user } = useAuth();
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHubs = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('hubs')
      .select('*')
      .eq('owner', user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching hubs:', error);
    } else {
      setHubs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHubs();
  }, [user]);

  const addHub = async (hubData: Partial<Hub> & { title: string; slug: string; color: string; icon: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('hubs')
      .insert([{ ...hubData, owner: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding hub:', error);
    } else {
      setHubs(prev => [...prev, data]);
    }
  };

  const updateHub = async (id: string, updates: Partial<Hub>) => {
    const { data, error } = await supabase
      .from('hubs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hub:', error);
    } else {
      setHubs(prev => prev.map(hub => hub.id === id ? data : hub));
    }
  };

  const deleteHub = async (id: string) => {
    const { error } = await supabase
      .from('hubs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting hub:', error);
    } else {
      setHubs(prev => prev.filter(hub => hub.id !== id));
    }
  };

  return {
    hubs,
    loading,
    addHub,
    updateHub,
    deleteHub,
    refetch: fetchHubs
  };
};