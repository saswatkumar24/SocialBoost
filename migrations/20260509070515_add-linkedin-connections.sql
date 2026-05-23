-- LinkedIn account connections (one row per SocialBoost user that has linked LinkedIn).
-- Tokens are stored at rest in Postgres and protected by row-level security so
-- only the owning user can read or modify their own connection. The InsForge
-- CLI automatically adds a `project_admin_policy` for new tables, so we only
-- declare the per-user owner policy here.

CREATE TABLE public.linkedin_connections (
  user_id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_sub     text NOT NULL,
  linkedin_name    text,
  linkedin_email   text,
  linkedin_picture text,
  access_token     text NOT NULL,
  refresh_token    text,
  expires_at       timestamptz,
  scope            text,
  connected_at     timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX linkedin_connections_linkedin_sub_idx
  ON public.linkedin_connections (linkedin_sub);

ALTER TABLE public.linkedin_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_connection
  ON public.linkedin_connections
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
