-- ============================================================
-- Lean In Connect — Supabase Schema
-- Run this in the Supabase SQL Editor to reproduce the backend
-- ============================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Design Engineer',
  company TEXT DEFAULT 'Lean In Connect',
  bio TEXT,
  initials TEXT,
  color TEXT DEFAULT '#7B2335',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- POSTS TABLE (add user_id if not already present)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users;

-- LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  from_user_name TEXT,
  from_user_initials TEXT DEFAULT 'LI',
  from_user_color TEXT DEFAULT '#7B2335',
  post_id UUID REFERENCES posts,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CIRCLE MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.circle_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id INTEGER NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_initials TEXT NOT NULL,
  author_color TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POSTS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- LIKES
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike own likes"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can create notifications"
  ON public.notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- CIRCLE MESSAGES
ALTER TABLE public.circle_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Circle messages viewable by everyone"
  ON public.circle_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send circle messages"
  ON public.circle_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STORAGE
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.role() = 'authenticated'
  );
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- DATABASE FUNCTIONS AND TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_initials TEXT;
  user_full_name TEXT;
BEGIN
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );
  user_initials := UPPER(
    LEFT(split_part(user_full_name, ' ', 1), 1) ||
    COALESCE(
      LEFT(split_part(user_full_name, ' ', 2), 1),
      LEFT(split_part(NEW.email, '@', 1), 1)
    )
  );
  INSERT INTO public.profiles (id, email, full_name, initials)
  VALUES (NEW.id, NEW.email, user_full_name, user_initials);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_change ON public.likes;
CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Auto-create notification on like
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  liker_name TEXT;
  liker_initials TEXT;
  liker_color TEXT;
BEGIN
  SELECT user_id INTO post_author_id
  FROM posts WHERE id = NEW.post_id;

  SELECT full_name, initials, color
  INTO liker_name, liker_initials, liker_color
  FROM profiles WHERE id = NEW.user_id;

  IF post_author_id IS NOT NULL AND post_author_id != NEW.user_id THEN
    INSERT INTO notifications (
      user_id, type, content,
      from_user_name, from_user_initials, from_user_color, post_id
    ) VALUES (
      post_author_id,
      'like',
      COALESCE(liker_name, 'Someone') || ' liked your post',
      liker_name, liker_initials, liker_color,
      NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_post_liked ON public.likes;
CREATE TRIGGER on_post_liked
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION create_like_notification();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE circle_messages;
