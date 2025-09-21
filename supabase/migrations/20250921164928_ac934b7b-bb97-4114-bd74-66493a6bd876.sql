-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  meta JSONB DEFAULT '{}'
);

-- Create hubs table
CREATE TABLE public.hubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hub_id uuid REFERENCES hubs(id) ON DELETE CASCADE,
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority INTEGER DEFAULT 2,
  due_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  repeat JSONB DEFAULT NULL,
  credits INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create habits table
CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  hub_id uuid REFERENCES hubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cadence TEXT DEFAULT 'daily',
  schedule JSONB DEFAULT '{}',
  streak INTEGER DEFAULT 0,
  last_completed TIMESTAMP WITH TIME ZONE,
  credits INTEGER DEFAULT 0,
  target_days INTEGER,
  completed_days INTEGER DEFAULT 0,
  completed_today BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  hub_id uuid REFERENCES hubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  target_date TIMESTAMP WITH TIME ZONE,
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  hub_id uuid REFERENCES hubs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  location TEXT,
  attendees JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create credits_transactions table
CREATE TABLE public.credits_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reason TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create themes table
CREATE TABLE public.themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- Create user_purchases table
CREATE TABLE public.user_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid REFERENCES auth.users ON DELETE CASCADE,
  theme_id uuid REFERENCES themes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for hubs
CREATE POLICY "Users can manage their own hubs" ON public.hubs
  FOR ALL USING (auth.uid() = owner);

-- Create RLS policies for tasks
CREATE POLICY "Users can manage their own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = owner);

-- Create RLS policies for habits
CREATE POLICY "Users can manage their own habits" ON public.habits
  FOR ALL USING (auth.uid() = owner);

-- Create RLS policies for goals
CREATE POLICY "Users can manage their own goals" ON public.goals
  FOR ALL USING (auth.uid() = owner);

-- Create RLS policies for events
CREATE POLICY "Users can manage their own events" ON public.events
  FOR ALL USING (auth.uid() = owner);

-- Create RLS policies for credits_transactions
CREATE POLICY "Users can view their own transactions" ON public.credits_transactions
  FOR SELECT USING (auth.uid() = owner);
CREATE POLICY "Users can insert their own transactions" ON public.credits_transactions
  FOR INSERT WITH CHECK (auth.uid() = owner);

-- Create RLS policies for user_purchases
CREATE POLICY "Users can manage their own purchases" ON public.user_purchases
  FOR ALL USING (auth.uid() = owner);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hubs_updated_at BEFORE UPDATE ON public.hubs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default themes
INSERT INTO public.themes (slug, name, price, metadata) VALUES
  ('default', 'Default', 0, '{"description": "Classic clean theme"}'),
  ('aurora', 'Aurora', 100, '{"description": "Beautiful aurora colors"}'),
  ('midnight', 'Midnight', 80, '{"description": "Dark midnight theme"}'),
  ('ocean', 'Ocean', 120, '{"description": "Deep ocean blues"}'),
  ('forest', 'Forest', 90, '{"description": "Natural forest greens"}');

-- Create indexes for better performance
CREATE INDEX idx_tasks_owner ON public.tasks (owner);
CREATE INDEX idx_tasks_hub_id ON public.tasks (hub_id);
CREATE INDEX idx_tasks_status ON public.tasks (status);
CREATE INDEX idx_habits_owner ON public.habits (owner);
CREATE INDEX idx_habits_hub_id ON public.habits (hub_id);
CREATE INDEX idx_goals_owner ON public.goals (owner);
CREATE INDEX idx_events_owner ON public.events (owner);
CREATE INDEX idx_credits_transactions_owner ON public.credits_transactions (owner);