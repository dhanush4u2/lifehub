import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface CalendarDay {
  id: string;
  user_id: string;
  date: string;
  went_to_college: boolean;
  absence_type?: 'personal' | 'sick' | 'permission';
  absence_note?: string;
  absence_attachment_url?: string;
  completed_planned_tasks: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlannedTask {
  id: string;
  calendar_day_id: string;
  card_id: string;
  completed: boolean;
  created_at: string;
}

export function useAttendance() {
  const { user } = useAuth();
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCalendarDays([]);
      setLoading(false);
      return;
    }

    fetchCalendarDays();
  }, [user]);

  const fetchCalendarDays = async () => {
    try {
      // Fetch last 60 days of attendance data
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 60);

      const { data, error } = await supabase
        .from('calendar_days')
        .select('*')
        .eq('user_id', user!.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setCalendarDays(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching attendance',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateCalendarDay = async (date: string): Promise<CalendarDay | null> => {
    try {
      // Check if day exists
      const { data: existing, error: fetchError } = await supabase
        .from('calendar_days')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', date)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) return existing;

      // Create new day
      const { data: newDay, error: createError } = await supabase
        .from('calendar_days')
        .insert([{
          user_id: user!.id,
          date,
          went_to_college: true,
          completed_planned_tasks: false,
        }])
        .select()
        .single();

      if (createError) throw createError;

      setCalendarDays((prev) => [newDay, ...prev]);
      return newDay;
    } catch (error: any) {
      toast({
        title: 'Error creating calendar day',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateAttendance = async (
    date: string,
    updates: {
      went_to_college?: boolean;
      absence_type?: 'personal' | 'sick' | 'permission' | null;
      absence_note?: string;
      absence_attachment_url?: string;
    }
  ) => {
    try {
      const day = await getOrCreateCalendarDay(date);
      if (!day) return;

      const { error } = await supabase
        .from('calendar_days')
        .update(updates)
        .eq('id', day.id);

      if (error) throw error;

      setCalendarDays((prev) =>
        prev.map((d) => (d.id === day.id ? { ...d, ...updates } : d))
      );

      toast({
        title: 'Attendance updated',
        description: 'Your attendance has been recorded',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating attendance',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const markTasksCompleted = async (date: string, completed: boolean) => {
    try {
      const day = await getOrCreateCalendarDay(date);
      if (!day) return;

      const { error } = await supabase
        .from('calendar_days')
        .update({ completed_planned_tasks: completed })
        .eq('id', day.id);

      if (error) throw error;

      setCalendarDays((prev) =>
        prev.map((d) =>
          d.id === day.id ? { ...d, completed_planned_tasks: completed } : d
        )
      );

      toast({
        title: completed ? 'Tasks completed!' : 'Tasks uncompleted',
        description: completed
          ? 'Great job completing your planned tasks!'
          : 'Tasks marked as incomplete',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating tasks',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getCalendarDay = (date: string): CalendarDay | undefined => {
    return calendarDays.find((d) => d.date === date);
  };

  const exportAttendanceCSV = () => {
    const headers = ['Date', 'Went to College', 'Absence Type', 'Note', 'Completed Tasks'];
    const rows = calendarDays.map((day) => [
      day.date,
      day.went_to_college ? 'Yes' : 'No',
      day.absence_type || '-',
      day.absence_note || '-',
      day.completed_planned_tasks ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Attendance exported',
      description: 'Your attendance data has been downloaded',
    });
  };

  return {
    calendarDays,
    loading,
    updateAttendance,
    markTasksCompleted,
    getCalendarDay,
    exportAttendanceCSV,
    refetch: fetchCalendarDays,
  };
}
