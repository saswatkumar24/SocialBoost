import "server-only";

import { cookies } from "next/headers";

import { ACCESS_COOKIE, createInsForgeServerClient } from "./insforge";
import type { CreatorProfile, TopicSuggestion } from "./creator-profile-shared";

const CONTENT_MODEL = "openai/gpt-5.4";

const ALLOWED_FORMATS = new Set([
  "story",
  "tactical-list",
  "contrarian-take",
  "case-study",
  "framework",
  "data-drop",
]);

async function getAuthedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  return createInsForgeServerClient(accessToken);
}

function profileBrief(profile: CreatorProfile | null) {
  if (!profile) {
    return [
      "Creator description: (not provided)",
      "Categories: (none)",
      "Target audience: (not provided)",
      "Preferred tone: (not provided)",
    ].join("\n");
  }
  const description = profile.description?.trim();
  return [
    `Creator description: ${description || "(not provided)"}`,
    `Categories: ${profile.categories.length ? profile.categories.join(", ") : "(none)"}`,
    `Target audience: ${profile.target_audience || "(not provided)"}`,
    `Preferred tone: ${profile.tone || "(not provided)"}`,
  ].join("\n");
}

function stripJsonFences(value: string): string {
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function tryParseJson<T = unknown>(raw: string): T | null {
  const cleaned = stripJsonFences(raw).trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}

export type GenerateTopicsResult = {
  topics: TopicSuggestion[];
  error?: string;
};

export async function generateTopics(
  profile: CreatorProfile | null
): Promise<GenerateTopicsResult> {
  const insforge = await getAuthedClient();
  if (!insforge) return { topics: [], error: "Not authenticated" };

  const description = profile?.description?.trim();
  const hasContext =
    !!description || (profile?.categories?.length ?? 0) > 0 || !!profile?.target_audience;

  const system = [
    "You are an expert LinkedIn ghostwriter who helps creators come up with high-engagement post topics.",
    "You always respond with strict JSON. No markdown, no preamble, no commentary.",
    'Output schema: {"topics":[{"title":string,"angle":string,"hook":string,"format":string,"category":string}]}.',
    "- title: a concrete LinkedIn post topic (max 90 chars).",
    "- angle: a one-sentence point of view (max 180 chars).",
    "- hook: a punchy opening line that earns the next read (max 200 chars).",
    '- format: one of "story", "tactical-list", "contrarian-take", "case-study", "framework", "data-drop".',
    "- category: a 1-3 word topic tag, e.g. \"Leadership\", \"AI\", \"Hiring\".",
    "Return exactly 6 topics, varied in format. No two should feel similar.",
  ].join("\n");

  const userPrompt = [
    profileBrief(profile),
    "",
    hasContext
      ? "Generate 6 LinkedIn post topics tuned to this creator. Respond with JSON only."
      : "Generate 6 broadly useful LinkedIn post topics for a thoughtful business creator. Respond with JSON only.",
  ].join("\n");

  let completion;
  try {
    completion = await insforge.ai.chat.completions.create({
      model: CONTENT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      maxTokens: 1500,
    });
  } catch (err) {
    return {
      topics: [],
      error: err instanceof Error ? err.message : "AI request failed",
    };
  }

  const raw = completion?.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== "string") {
    return { topics: [], error: "AI returned an empty response." };
  }

  const parsed = tryParseJson<{ topics?: unknown }>(raw);
  if (!parsed || !Array.isArray(parsed.topics)) {
    return { topics: [], error: "Could not parse AI response." };
  }

  const topics: TopicSuggestion[] = parsed.topics
    .filter((t): t is Record<string, unknown> => typeof t === "object" && t !== null)
    .map((t) => {
      const formatRaw = String(t.format ?? "").trim();
      const format = ALLOWED_FORMATS.has(formatRaw) ? formatRaw : "story";
      return {
        title: String(t.title ?? "").trim(),
        angle: String(t.angle ?? "").trim(),
        hook: String(t.hook ?? "").trim(),
        format,
        category: String(t.category ?? "").trim() || undefined,
      } as TopicSuggestion & { category?: string };
    })
    .filter((t) => t.title.length > 0);

  if (topics.length === 0) {
    return { topics: [], error: "AI returned no valid topics." };
  }

  return { topics };
}

export type DraftPostResult = {
  body: string;
  error?: string;
};

export async function draftPost(
  profile: CreatorProfile | null,
  topic: TopicSuggestion & { category?: string | null }
): Promise<DraftPostResult> {
  const insforge = await getAuthedClient();
  if (!insforge) return { body: "", error: "Not authenticated" };

  if (!topic?.title?.trim()) {
    return { body: "", error: "Missing topic title." };
  }

  const tone = profile?.tone || "thoughtful and clear";

  const system = [
    "You are an expert LinkedIn ghostwriter.",
    "Write a single LinkedIn post body. Plain text only — no markdown, no headings, no surrounding quotes.",
    "Length: roughly 150–300 words.",
    "Open with a punchy 1–2 line hook on its own paragraph.",
    "Follow with 3–6 short paragraphs that develop the angle. Use line breaks between paragraphs.",
    "Avoid emojis unless the requested tone explicitly calls for them.",
    "End with a single short question or call-to-reflect to invite comments.",
    topic.category === "Custom"
      ? "Always include 3-5 relevant LinkedIn hashtags at the very bottom of the post (e.g. #marketing #strategy)."
      : "Do NOT include hashtags unless the angle is explicitly about a tag-driven topic.",
    "Never invent statistics or claim specific numbers. Speak from experience and principle.",
    "Output the post body as raw text. No JSON, no preamble, no labels.",
  ].join("\n");

  const userPrompt = [
    profileBrief(profile),
    `Preferred tone: ${tone}`,
    "",
    `Topic title: ${topic.title}`,
    topic.angle ? `Angle: ${topic.angle}` : "",
    topic.hook ? `Suggested hook: ${topic.hook}` : "",
    topic.format ? `Format: ${topic.format}` : "",
    topic.category ? `Category: ${topic.category}` : "",
    "",
    "Write the LinkedIn post now.",
  ]
    .filter(Boolean)
    .join("\n");

  let completion;
  try {
    completion = await insforge.ai.chat.completions.create({
      model: CONTENT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      maxTokens: 900,
    });
  } catch (err) {
    return {
      body: "",
      error: err instanceof Error ? err.message : "AI request failed",
    };
  }

  const raw = completion?.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== "string") {
    return { body: "", error: "AI returned an empty response." };
  }

  // The model occasionally wraps the post in code fences or quotes — strip them.
  let body = raw.trim();
  body = body.replace(/^```[a-zA-Z]*\s*/m, "").replace(/```\s*$/m, "").trim();
  if (
    (body.startsWith('"') && body.endsWith('"')) ||
    (body.startsWith("“") && body.endsWith("”"))
  ) {
    body = body.slice(1, -1).trim();
  }

  if (!body) {
    return { body: "", error: "AI returned an empty post." };
  }

  return { body };
}

export type RefinePostResult = {
  body: string;
  error?: string;
};

export async function refinePostText(
  profile: CreatorProfile | null,
  textToRefine: string
): Promise<RefinePostResult> {
  const insforge = await getAuthedClient();
  if (!insforge) return { body: "", error: "Not authenticated" };

  const tone = profile?.tone || "thoughtful and clear";

  const system = [
    "You are an expert LinkedIn ghostwriter and editor.",
    "Your task is to refine the user's provided draft for LinkedIn.",
    "Fix any spelling, grammar, or punctuation errors.",
    "Improve readability and engagement for LinkedIn:",
    "- Use short, punchy paragraphs with line breaks.",
    "- Ensure a strong, engaging opening hook.",
    "- Optimize formatting (bullet points, clear structure).",
    "- Maintain the core meaning and tone of the original post.",
    "- Include 3-5 relevant LinkedIn hashtags at the very bottom (e.g., #productivity #strategy).",
    "Return only the refined post body as raw text. Do not include markdown headings, surrounding quotes, or preamble.",
  ].join("\n");

  const userPrompt = [
    profileBrief(profile),
    `Original Tone: ${tone}`,
    "",
    "Original draft to refine:",
    textToRefine,
    "",
    "Write the refined LinkedIn post now.",
  ].join("\n");

  let completion;
  try {
    completion = await insforge.ai.chat.completions.create({
      model: CONTENT_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 1200,
    });
  } catch (err) {
    return {
      body: "",
      error: err instanceof Error ? err.message : "AI request failed",
    };
  }

  const raw = completion?.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== "string") {
    return { body: "", error: "AI returned an empty response." };
  }

  let body = raw.trim();
  body = body.replace(/^```[a-zA-Z]*\s*/m, "").replace(/```\s*$/m, "").trim();
  if (
    (body.startsWith('"') && body.endsWith('"')) ||
    (body.startsWith("“") && body.endsWith("”"))
  ) {
    body = body.slice(1, -1).trim();
  }

  if (!body) {
    return { body: "", error: "AI returned an empty refined post." };
  }

  return { body };
}

