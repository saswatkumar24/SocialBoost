export type CreatorProfile = {
  user_id: string;
  description: string;
  categories: string[];
  target_audience: string | null;
  tone: string | null;
  created_at: string;
  updated_at: string;
};

export type TopicSuggestion = {
  title: string;
  angle: string;
  hook: string;
  format: string;
  category?: string;
};

export const CONTENT_CATEGORIES = [
  "Software engineering",
  "AI & machine learning",
  "Product management",
  "Startups & entrepreneurship",
  "Marketing & growth",
  "Sales",
  "Design & UX",
  "Data & analytics",
  "Leadership & management",
  "Career advice",
  "Personal branding",
  "Finance & investing",
  "Productivity",
  "Remote work",
  "Hiring & recruiting",
] as const;

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "witty", label: "Witty" },
  { value: "bold", label: "Bold & opinionated" },
  { value: "thoughtful", label: "Thoughtful & analytical" },
  { value: "story-driven", label: "Story-driven" },
] as const;

export const MAX_CATEGORIES = 6;
export const MAX_DESCRIPTION = 1000;
export const MAX_AUDIENCE = 200;
