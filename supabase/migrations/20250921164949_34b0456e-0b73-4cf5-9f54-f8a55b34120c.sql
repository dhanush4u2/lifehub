-- Fix security definer function search path
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on themes table (it was missing)
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for themes (public read access)
CREATE POLICY "Themes are publicly readable" ON public.themes
  FOR SELECT USING (true);