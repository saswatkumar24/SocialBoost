-- Creator profiles: stores preferences for LinkedIn creators, such as target audience, tone, description, etc.
-- This data is used by AI to suggest topics and draft posts.

CREATE TABLE public.creator_profiles (
  user_id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  description      text NOT NULL DEFAULT '',
  categories       text[] NOT NULL DEFAULT ARRAY[]::text[],
  target_audience  text,
  tone             text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_profile
  ON public.creator_profiles
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
