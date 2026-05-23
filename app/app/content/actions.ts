"use server";

import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth";
import { getCreatorProfile } from "@/lib/creator-profile";
import type { TopicSuggestion } from "@/lib/creator-profile-shared";
import { draftPost, generateTopics } from "@/lib/ai-content";
import {
  createTextPost,
  refreshAccessToken,
  type LinkedinTokenResponse,
} from "@/lib/linkedin";
import {
  getLinkedinConnection,
  updateLinkedinTokens,
} from "@/lib/linkedin-connection";
import { ACCESS_COOKIE, createInsForgeServerClient } from "@/lib/insforge";

export type LoadTopicsResult = {
  topics: TopicSuggestion[];
  error?: string;
};

export async function loadTopicsAction(): Promise<LoadTopicsResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { topics: [], error: "Your session has expired. Please sign in again." };
  }

  const profile = await getCreatorProfile(user.id);
  const result = await generateTopics(profile);
  return result;
}

export type DraftPostResult = {
  body: string;
  error?: string;
};

export async function draftPostAction(
  topic: TopicSuggestion
): Promise<DraftPostResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { body: "", error: "Your session has expired. Please sign in again." };
  }

  if (!topic || typeof topic !== "object" || !topic.title?.trim()) {
    return { body: "", error: "Missing topic." };
  }

  const profile = await getCreatorProfile(user.id);
  return draftPost(profile, topic);
}

export type PublishPostResult = {
  ok: boolean;
  error?: string;
  postUrn?: string;
  notConnected?: boolean;
  needsReconnect?: boolean;
};

export async function publishPostAction(input: {
  body: string;
}): Promise<PublishPostResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Your session has expired. Please sign in again." };
  }

  const body = (input?.body ?? "").trim();
  if (!body) {
    return { ok: false, error: "The post is empty." };
  }
  if (body.length > 3000) {
    return {
      ok: false,
      error: "LinkedIn posts must be 3,000 characters or fewer.",
    };
  }

  const connection = await getLinkedinConnection(user.id);
  if (!connection) {
    return {
      ok: false,
      notConnected: true,
      error: "Connect your LinkedIn account to publish.",
    };
  }

  let accessToken = connection.access_token;

  // Refresh proactively if the token is within 60 seconds of expiry.
  const expiresAt = connection.expires_at ? Date.parse(connection.expires_at) : NaN;
  const expiresSoon =
    !Number.isNaN(expiresAt) && expiresAt - Date.now() < 60_000;

  if (expiresSoon && connection.refresh_token) {
    const refreshed = await refreshAccessToken(connection.refresh_token);
    if (refreshed.ok) {
      accessToken = refreshed.tokens.access_token;
      await persistRefreshedTokens(user.id, refreshed.tokens, connection.refresh_token);
    }
    // If refresh fails we still attempt the post with the existing token; the
    // 401 path below handles re-auth signaling.
  }

  let result = await createTextPost({
    accessToken,
    sub: connection.linkedin_sub,
    body,
  });

  if (!result.ok && result.status === 401 && connection.refresh_token) {
    const refreshed = await refreshAccessToken(connection.refresh_token);
    if (refreshed.ok) {
      accessToken = refreshed.tokens.access_token;
      await persistRefreshedTokens(user.id, refreshed.tokens, connection.refresh_token);
      result = await createTextPost({
        accessToken,
        sub: connection.linkedin_sub,
        body,
      });
    }
  }

  if (!result.ok) {
    if (result.status === 401) {
      return {
        ok: false,
        needsReconnect: true,
        error: "Your LinkedIn session has expired. Please reconnect your account.",
      };
    }
    return { ok: false, error: result.error };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_COOKIE)?.value;
    if (token) {
      const insforge = createInsForgeServerClient(token);
      await insforge.database.from("published_posts").insert([
        {
          user_id: user.id,
          body,
          post_urn: result.postUrn,
        },
      ]);
    }
  } catch (err) {
    console.error("Failed to insert direct post into published_posts:", err);
  }

  return { ok: true, postUrn: result.postUrn };
}

async function persistRefreshedTokens(
  userId: string,
  tokens: LinkedinTokenResponse,
  fallbackRefreshToken: string
) {
  const expiresAt =
    typeof tokens.expires_in === "number" && tokens.expires_in > 0
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;
  await updateLinkedinTokens(userId, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? fallbackRefreshToken,
    expires_at: expiresAt,
    scope: tokens.scope ?? null,
  });
}
