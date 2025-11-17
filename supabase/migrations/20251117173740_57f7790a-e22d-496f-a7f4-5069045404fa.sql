-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  workday_start TIME DEFAULT '08:00:00',
  workday_end TIME DEFAULT '18:00:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create boards table
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own boards"
  ON public.boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boards"
  ON public.boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards"
  ON public.boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards"
  ON public.boards FOR DELETE
  USING (auth.uid() = user_id);

-- Create lists table (kanban columns)
CREATE TABLE public.lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lists of own boards"
  ON public.lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create lists in own boards"
  ON public.lists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lists in own boards"
  ON public.lists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete lists in own boards"
  ON public.lists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Create priority enum
CREATE TYPE public.priority_level AS ENUM ('P0', 'P1', 'P2', 'P3');

-- Create cards table (tasks)
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority priority_level DEFAULT 'P2',
  estimate_hours DECIMAL(5,2),
  due_date DATE,
  start_date DATE,
  labels TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  sprint_id UUID,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cards in own boards"
  ON public.cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create cards in own boards"
  ON public.cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = list_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards in own boards"
  ON public.cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards in own boards"
  ON public.cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id
      AND boards.user_id = auth.uid()
    )
  );

-- Create subtasks table
CREATE TABLE public.subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  estimate_hours DECIMAL(5,2),
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view subtasks of own cards"
  ON public.subtasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cards
      JOIN public.lists ON lists.id = cards.list_id
      JOIN public.boards ON boards.id = lists.board_id
      WHERE cards.id = subtasks.card_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create subtasks in own cards"
  ON public.subtasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cards
      JOIN public.lists ON lists.id = cards.list_id
      JOIN public.boards ON boards.id = lists.board_id
      WHERE cards.id = card_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update subtasks in own cards"
  ON public.subtasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cards
      JOIN public.lists ON lists.id = cards.list_id
      JOIN public.boards ON boards.id = lists.board_id
      WHERE cards.id = subtasks.card_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete subtasks in own cards"
  ON public.subtasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cards
      JOIN public.lists ON lists.id = cards.list_id
      JOIN public.boards ON boards.id = lists.board_id
      WHERE cards.id = subtasks.card_id
      AND boards.user_id = auth.uid()
    )
  );

-- Create sprints table
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sprints"
  ON public.sprints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sprints"
  ON public.sprints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sprints"
  ON public.sprints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sprints"
  ON public.sprints FOR DELETE
  USING (auth.uid() = user_id);

-- Add foreign key for sprint_id in cards
ALTER TABLE public.cards ADD CONSTRAINT cards_sprint_id_fkey 
  FOREIGN KEY (sprint_id) REFERENCES public.sprints(id) ON DELETE SET NULL;

-- Create absence type enum
CREATE TYPE public.absence_type AS ENUM ('personal', 'sick', 'permission');

-- Create calendar_days table for attendance and task completion tracking
CREATE TABLE public.calendar_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  went_to_college BOOLEAN DEFAULT TRUE,
  absence_type absence_type,
  absence_note TEXT,
  absence_attachment_url TEXT,
  completed_planned_tasks BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.calendar_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar days"
  ON public.calendar_days FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calendar days"
  ON public.calendar_days FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar days"
  ON public.calendar_days FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar days"
  ON public.calendar_days FOR DELETE
  USING (auth.uid() = user_id);

-- Create planned_tasks junction table
CREATE TABLE public.planned_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendar_day_id UUID NOT NULL REFERENCES public.calendar_days(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(calendar_day_id, card_id)
);

ALTER TABLE public.planned_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own planned tasks"
  ON public.planned_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_days
      WHERE calendar_days.id = planned_tasks.calendar_day_id
      AND calendar_days.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own planned tasks"
  ON public.planned_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calendar_days
      WHERE calendar_days.id = calendar_day_id
      AND calendar_days.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own planned tasks"
  ON public.planned_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_days
      WHERE calendar_days.id = planned_tasks.calendar_day_id
      AND calendar_days.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own planned tasks"
  ON public.planned_tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_days
      WHERE calendar_days.id = planned_tasks.calendar_day_id
      AND calendar_days.user_id = auth.uid()
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lists_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subtasks_updated_at
  BEFORE UPDATE ON public.subtasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sprints_updated_at
  BEFORE UPDATE ON public.sprints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_days_updated_at
  BEFORE UPDATE ON public.calendar_days
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();