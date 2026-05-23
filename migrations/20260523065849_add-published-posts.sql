-- Published posts: logs all successfully published posts (direct or scheduled)
-- with their body, LinkedIn post URN, and publication timestamp.
-- RLS scopes access to the owning user.

CREATE TABLE public.published_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body            text NOT NULL,
  post_urn        text NOT NULL,
  published_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.published_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_published_posts
  ON public.published_posts
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
