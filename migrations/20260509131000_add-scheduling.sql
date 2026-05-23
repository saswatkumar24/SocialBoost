-- Scheduling: per-user posting schedule (cadence/timezone) and a queue of
-- posts that the InsForge scheduler-tick edge function will publish to
-- LinkedIn at their scheduled_at time. RLS scopes both tables to the
-- owning user; the worker uses the admin API key, which bypasses RLS.

CREATE TABLE public.posting_schedules (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone             text NOT NULL DEFAULT 'UTC',
  days_of_week         int[] NOT NULL DEFAULT ARRAY[1,2,3,4,5],
  mode                 text NOT NULL DEFAULT 'times',
  times_of_day         text[] NOT NULL DEFAULT ARRAY['09:00','13:00','17:00'],
  interval_hours       int NOT NULL DEFAULT 4,
  interval_start_time  text NOT NULL DEFAULT '09:00',
  is_active            boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT posting_schedules_mode_chk CHECK (mode IN ('times','interval')),
  CONSTRAINT posting_schedules_interval_hours_chk CHECK (interval_hours BETWEEN 1 AND 168)
);

ALTER TABLE public.posting_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_posting_schedule
  ON public.posting_schedules
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


CREATE TABLE public.scheduled_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body            text NOT NULL,
  status          text NOT NULL DEFAULT 'queued',
  scheduled_at    timestamptz NOT NULL,
  published_at    timestamptz,
  post_urn        text,
  error_message   text,
  attempts        int NOT NULL DEFAULT 0,
  topic_title     text,
  topic_format    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_posts_status_chk
    CHECK (status IN ('queued','publishing','published','failed','cancelled'))
);

CREATE INDEX scheduled_posts_user_status_scheduled_at_idx
  ON public.scheduled_posts (user_id, status, scheduled_at);

CREATE INDEX scheduled_posts_due_idx
  ON public.scheduled_posts (scheduled_at)
  WHERE status = 'queued';

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_scheduled_posts
  ON public.scheduled_posts
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
