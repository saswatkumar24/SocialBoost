import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { ACCESS_COOKIE, createInsForgeServerClient } from "./insforge";
import type { CreatorProfile } from "./creator-profile-shared";

export type { CreatorProfile, TopicSuggestion } from "./creator-profile-shared";
export {
  CONTENT_CATEGORIES,
  TONE_OPTIONS,
  MAX_AUDIENCE,
  MAX_CATEGORIES,
  MAX_DESCRIPTION,
} from "./creator-profile-shared";

async function getAuthedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  return createInsForgeServerClient(accessToken);
}

export const getCreatorProfile = cache(
  async (userId: string): Promise<CreatorProfile | null> => {
    const insforge = await getAuthedClient();
    if (!insforge) return null;

    const { data, error } = await insforge.database
      .from("creator_profiles")
      .select()
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to load creator profile", error);
      return null;
    }

    if (!data) return null;

    const row = data as Record<string, unknown>;
    return {
      user_id: row.user_id as string,
      description: (row.description as string) ?? "",
      categories: Array.isArray(row.categories) ? (row.categories as string[]) : [],
      target_audience: (row.target_audience as string | null) ?? null,
      tone: (row.tone as string | null) ?? null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  }
);

export type SaveCreatorProfileInput = {
  description: string;
  categories: string[];
  target_audience: string | null;
  tone: string | null;
};

export async function upsertCreatorProfile(
  userId: string,
  input: SaveCreatorProfileInput
): Promise<{ ok: boolean; error?: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const existing = await insforge.database
    .from("creator_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing.error) {
    return { ok: false, error: existing.error.message };
  }

  if (existing.data) {
    const { error } = await insforge.database
      .from("creator_profiles")
      .update({
        description: input.description,
        categories: input.categories,
        target_audience: input.target_audience,
        tone: input.tone,
      })
      .eq("user_id", userId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  const { error } = await insforge.database.from("creator_profiles").insert([
    {
      user_id: userId,
      description: input.description,
      categories: input.categories,
      target_audience: input.target_audience,
      tone: input.tone,
    },
  ]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

