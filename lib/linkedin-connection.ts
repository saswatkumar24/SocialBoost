import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { ACCESS_COOKIE, createInsForgeServerClient } from "./insforge";

export type LinkedinConnection = {
  user_id: string;
  linkedin_sub: string;
  linkedin_name: string | null;
  linkedin_email: string | null;
  linkedin_picture: string | null;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  scope: string | null;
  connected_at: string;
  updated_at: string;
};

async function getAuthedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  return createInsForgeServerClient(accessToken);
}

function rowToConnection(row: Record<string, unknown>): LinkedinConnection {
  return {
    user_id: row.user_id as string,
    linkedin_sub: row.linkedin_sub as string,
    linkedin_name: (row.linkedin_name as string | null) ?? null,
    linkedin_email: (row.linkedin_email as string | null) ?? null,
    linkedin_picture: (row.linkedin_picture as string | null) ?? null,
    access_token: row.access_token as string,
    refresh_token: (row.refresh_token as string | null) ?? null,
    expires_at: (row.expires_at as string | null) ?? null,
    scope: (row.scope as string | null) ?? null,
    connected_at: row.connected_at as string,
    updated_at: row.updated_at as string,
  };
}

export const getLinkedinConnection = cache(
  async (userId: string): Promise<LinkedinConnection | null> => {
    const insforge = await getAuthedClient();
    if (!insforge) return null;
    const { data, error } = await insforge.database
      .from("linkedin_connections")
      .select()
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.error("Failed to load linkedin_connection", error);
      return null;
    }
    if (!data) return null;
    return rowToConnection(data as Record<string, unknown>);
  }
);

export type UpsertLinkedinConnectionInput = {
  linkedin_sub: string;
  linkedin_name: string | null;
  linkedin_email: string | null;
  linkedin_picture: string | null;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  scope: string | null;
};

export async function upsertLinkedinConnection(
  userId: string,
  input: UpsertLinkedinConnectionInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const existing = await insforge.database
    .from("linkedin_connections")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing.error) {
    return { ok: false, error: existing.error.message };
  }

  if (existing.data) {
    const { error } = await insforge.database
      .from("linkedin_connections")
      .update({
        linkedin_sub: input.linkedin_sub,
        linkedin_name: input.linkedin_name,
        linkedin_email: input.linkedin_email,
        linkedin_picture: input.linkedin_picture,
        access_token: input.access_token,
        refresh_token: input.refresh_token,
        expires_at: input.expires_at,
        scope: input.scope,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  const { error } = await insforge.database.from("linkedin_connections").insert([
    {
      user_id: userId,
      linkedin_sub: input.linkedin_sub,
      linkedin_name: input.linkedin_name,
      linkedin_email: input.linkedin_email,
      linkedin_picture: input.linkedin_picture,
      access_token: input.access_token,
      refresh_token: input.refresh_token,
      expires_at: input.expires_at,
      scope: input.scope,
    },
  ]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteLinkedinConnection(
  userId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };
  const { error } = await insforge.database
    .from("linkedin_connections")
    .delete()
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateLinkedinTokens(
  userId: string,
  tokens: {
    access_token: string;
    refresh_token?: string | null;
    expires_at?: string | null;
    scope?: string | null;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const insforge = await getAuthedClient();
  if (!insforge) return { ok: false, error: "Not authenticated" };

  const update: Record<string, unknown> = {
    access_token: tokens.access_token,
    updated_at: new Date().toISOString(),
  };
  if (tokens.refresh_token !== undefined) update.refresh_token = tokens.refresh_token;
  if (tokens.expires_at !== undefined) update.expires_at = tokens.expires_at;
  if (tokens.scope !== undefined) update.scope = tokens.scope;

  const { error } = await insforge.database
    .from("linkedin_connections")
    .update(update)
    .eq("user_id", userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
