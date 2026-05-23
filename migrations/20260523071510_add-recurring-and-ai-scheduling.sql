-- Add recurrence columns to public.scheduled_posts
ALTER TABLE public.scheduled_posts
  ADD COLUMN is_recurring BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN recurrence_interval_days INT DEFAULT NULL;

-- Create AI topic schedules table
CREATE TABLE public.ai_topic_schedules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_name      text NOT NULL,
  prompt_brief    text NOT NULL,
  slots           jsonb NOT NULL DEFAULT '[]', -- array of: {"day": number, "time": string}
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_topic_schedules_user_topic_unique UNIQUE (user_id, topic_name)
);

-- Enable RLS and setup policy
ALTER TABLE public.ai_topic_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_own_ai_topic_schedules
  ON public.ai_topic_schedules
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
