// Pulse — scheduler-tick edge function.
//
// Triggered every minute by an InsForge schedule. It:
//   1. Verifies a shared SCHEDULER_SECRET so only the cron can call it.
//   2. Reads scheduled_posts that are due (status='queued' AND
//      scheduled_at <= now()) and claims them by transitioning them to
//      'publishing' (optimistic single-row update; rows that don't update
//      were claimed by another tick).
//   3. Looks up the user's linkedin_connection (admin Bearer bypasses RLS),
//      refreshes the access token if expired, and POSTs to LinkedIn's
//      /rest/posts endpoint.
//   4. Marks the row 'published' on success, 'failed' if non-recoverable, or
//      pushes scheduled_at +5 min and reverts to 'queued' for retries
//      (capped at 3 attempts).
//
// Deployed via:
//   npx @insforge/cli functions deploy scheduler-tick
//
// Secrets that must be set in InsForge (so they're injected into Deno.env):
//   SCHEDULER_SECRET        — random string also embedded in the schedule's
//                             Authorization header (Bearer <secret>).
//   INSFORGE_ADMIN_KEY      — project admin key (same value as `api_key` in
//                             .insforge/project.json). Used as Bearer for
//                             /api/database/* calls so RLS doesn't block us.
//   LINKEDIN_CLIENT_ID      — LinkedIn OAuth app client id.
//   LINKEDIN_CLIENT_SECRET  — LinkedIn OAuth app client secret.

const BASE_URL = Deno.env.get("INSFORGE_BASE_URL") || "";
const ADMIN_KEY = Deno.env.get("INSFORGE_ADMIN_KEY") || "";
const SCHEDULER_SECRET = Deno.env.get("SCHEDULER_SECRET") || "";
const LI_CLIENT_ID = Deno.env.get("LINKEDIN_CLIENT_ID") || "";
const LI_CLIENT_SECRET = Deno.env.get("LINKEDIN_CLIENT_SECRET") || "";

const LINKEDIN_API_VERSION = "202604";
const POSTS_URL = "https://api.linkedin.com/rest/posts";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

const MAX_BATCH = 25;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5 * 60 * 1000;

type ScheduledPost = {
  id: string;
  user_id: string;
  body: string;
  status: string;
  scheduled_at: string;
  attempts: number;
  is_recurring?: boolean;
  recurrence_interval_days?: number | null;
  topic_title?: string | null;
  topic_format?: string | null;
};

type LinkedinConnection = {
  user_id: string;
  linkedin_sub: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
};

type LinkedinTokenResponse = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
};

// ---------------- DB helpers (admin Bearer over PostgREST) ----------------

function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    Authorization: `Bearer ${ADMIN_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function dbSelect<T>(
  table: string,
  query: string
): Promise<{ ok: true; rows: T[] } | { ok: false; error: string }> {
  const url = `${BASE_URL}/api/database/records/${table}${query}`;
  try {
    const res = await fetch(url, { method: "GET", headers: adminHeaders() });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `${res.status} ${text}` };
    try {
      const rows = JSON.parse(text) as T[];
      return { ok: true, rows };
    } catch {
      return { ok: false, error: `Invalid JSON from ${table}: ${text.slice(0, 200)}` };
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

async function dbUpdate<T>(
  table: string,
  query: string,
  patch: Record<string, unknown>
): Promise<{ ok: true; rows: T[] } | { ok: false; error: string }> {
  const url = `${BASE_URL}/api/database/records/${table}${query}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: adminHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(patch),
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `${res.status} ${text}` };
    try {
      const rows = JSON.parse(text) as T[];
      return { ok: true, rows };
    } catch {
      return { ok: true, rows: [] };
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

async function dbInsert(
  table: string,
  record: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  const url = `${BASE_URL}/api/database/records/${table}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(record),
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `${res.status} ${text}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

// ---------------- LinkedIn helpers ----------------------------------------

async function refreshLinkedinToken(
  refreshToken: string
): Promise<
  { ok: true; tokens: LinkedinTokenResponse } | { ok: false; error: string }
> {
  if (!LI_CLIENT_ID || !LI_CLIENT_SECRET) {
    return { ok: false, error: "LinkedIn client credentials are not configured." };
  }
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: LI_CLIENT_ID,
      client_secret: LI_CLIENT_SECRET,
    });
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = JSON.parse(text);
    } catch { /* non-JSON */ }
    if (!res.ok || !data || typeof data !== "object") {
      return { ok: false, error: text || `LinkedIn token refresh ${res.status}` };
    }
    const tokens = data as LinkedinTokenResponse;
    if (!tokens.access_token) {
      return { ok: false, error: "LinkedIn refresh response missing access_token" };
    }
    return { ok: true, tokens };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

type LinkedinPostResult =
  | { ok: true; postUrn: string }
  | { ok: false; status: number; error: string };

async function postToLinkedin(
  accessToken: string,
  sub: string,
  body: string
): Promise<LinkedinPostResult> {
  const payload = {
    author: `urn:li:person:${sub}`,
    commentary: body,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  try {
    const res = await fetch(POSTS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Linkedin-Version": LINKEDIN_API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const postUrn =
        res.headers.get("x-restli-id") ??
        res.headers.get("X-RestLi-Id") ??
        "";
      return { ok: true, postUrn };
    }

    const text = await res.text();
    return { ok: false, status: res.status, error: text || `${res.status}` };
  } catch (err) {
    return { ok: false, status: 0, error: (err as Error).message };
  }
}

// ---------------- Connection & post processing ----------------------------

async function getConnection(userId: string): Promise<LinkedinConnection | null> {
  const result = await dbSelect<LinkedinConnection>(
    "linkedin_connections",
    `?user_id=eq.${encodeURIComponent(userId)}&limit=1`
  );
  if (!result.ok || result.rows.length === 0) return null;
  return result.rows[0];
}

async function persistTokens(
  userId: string,
  tokens: LinkedinTokenResponse,
  fallbackRefreshToken: string
): Promise<void> {
  const expiresAt =
    typeof tokens.expires_in === "number" && tokens.expires_in > 0
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

  await dbUpdate(
    "linkedin_connections",
    `?user_id=eq.${encodeURIComponent(userId)}`,
    {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? fallbackRefreshToken,
      expires_at: expiresAt,
      scope: tokens.scope ?? null,
      updated_at: new Date().toISOString(),
    }
  );
}

async function markPublished(
  postId: string,
  postUrn: string
): Promise<void> {
  await dbUpdate(
    "scheduled_posts",
    `?id=eq.${encodeURIComponent(postId)}`,
    {
      status: "published",
      post_urn: postUrn,
      published_at: new Date().toISOString(),
      error_message: null,
      updated_at: new Date().toISOString(),
    }
  );
}

async function markFailed(
  postId: string,
  error: string
): Promise<void> {
  await dbUpdate(
    "scheduled_posts",
    `?id=eq.${encodeURIComponent(postId)}`,
    {
      status: "failed",
      error_message: error.slice(0, 500),
      updated_at: new Date().toISOString(),
    }
  );
}

async function pushBackForRetry(
  postId: string,
  error: string
): Promise<void> {
  const retryAt = new Date(Date.now() + RETRY_DELAY_MS).toISOString();
  await dbUpdate(
    "scheduled_posts",
    `?id=eq.${encodeURIComponent(postId)}`,
    {
      status: "queued",
      scheduled_at: retryAt,
      error_message: error.slice(0, 500),
      updated_at: new Date().toISOString(),
    }
  );
}

// Atomically transition a queued row to 'publishing'. Returns the row if we
// won the claim, or null if someone else (or a state change) got there first.
async function claim(post: ScheduledPost): Promise<ScheduledPost | null> {
  const result = await dbUpdate<ScheduledPost>(
    "scheduled_posts",
    `?id=eq.${encodeURIComponent(post.id)}&status=eq.queued`,
    {
      status: "publishing",
      attempts: post.attempts + 1,
      updated_at: new Date().toISOString(),
    }
  );
  if (!result.ok || result.rows.length === 0) return null;
  return result.rows[0];
}

async function processPost(post: ScheduledPost): Promise<{
  outcome: "published" | "failed" | "retried";
  error?: string;
}> {
  const claimed = await claim(post);
  if (!claimed) return { outcome: "retried", error: "Already claimed." };

  const connection = await getConnection(claimed.user_id);
  if (!connection) {
    await markFailed(claimed.id, "LinkedIn account is not connected.");
    return { outcome: "failed", error: "no-connection" };
  }

  let accessToken = connection.access_token;

  // Refresh proactively if within 60s of expiry.
  const expiresAt = connection.expires_at ? Date.parse(connection.expires_at) : NaN;
  const expiresSoon =
    !Number.isNaN(expiresAt) && expiresAt - Date.now() < 60_000;

  if (expiresSoon && connection.refresh_token) {
    const refreshed = await refreshLinkedinToken(connection.refresh_token);
    if (refreshed.ok) {
      accessToken = refreshed.tokens.access_token;
      await persistTokens(claimed.user_id, refreshed.tokens, connection.refresh_token);
    }
  }

  let result = await postToLinkedin(accessToken, connection.linkedin_sub, claimed.body);

  if (!result.ok && result.status === 401 && connection.refresh_token) {
    const refreshed = await refreshLinkedinToken(connection.refresh_token);
    if (refreshed.ok) {
      accessToken = refreshed.tokens.access_token;
      await persistTokens(claimed.user_id, refreshed.tokens, connection.refresh_token);
      result = await postToLinkedin(accessToken, connection.linkedin_sub, claimed.body);
    }
  }

  if (result.ok) {
    await markPublished(claimed.id, result.postUrn);
    try {
      await dbInsert("published_posts", {
        user_id: claimed.user_id,
        body: claimed.body,
        post_urn: result.postUrn,
        published_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to insert into published_posts", err);
    }

    // Check if it's recurring and spawn next run
    if (claimed.is_recurring && claimed.recurrence_interval_days) {
      try {
        const currentScheduledAt = new Date(claimed.scheduled_at);
        const nextScheduledAt = new Date(
          currentScheduledAt.getTime() + claimed.recurrence_interval_days * 24 * 60 * 60 * 1000
        );
        
        await dbInsert("scheduled_posts", {
          user_id: claimed.user_id,
          body: claimed.body,
          status: "queued",
          scheduled_at: nextScheduledAt.toISOString(),
          is_recurring: true,
          recurrence_interval_days: claimed.recurrence_interval_days,
          topic_title: claimed.topic_title || null,
          topic_format: claimed.topic_format || null,
        });
      } catch (err) {
        console.error("Failed to queue next occurrence of recurring post:", err);
      }
    }

    return { outcome: "published" };
  }

  if (result.status === 401) {
    await markFailed(
      claimed.id,
      "LinkedIn session expired — reconnect your account."
    );
    return { outcome: "failed", error: "linkedin-401" };
  }

  if (claimed.attempts >= MAX_ATTEMPTS) {
    await markFailed(claimed.id, result.error || `LinkedIn returned ${result.status}`);
    return { outcome: "failed", error: result.error };
  }

  await pushBackForRetry(claimed.id, result.error || `LinkedIn returned ${result.status}`);
  return { outcome: "retried", error: result.error };
}

// ---------------- Handler -------------------------------------------------

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function schedulerTick(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // Auth: require Bearer == SCHEDULER_SECRET.
  const auth = req.headers.get("Authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  const presented = match?.[1]?.trim() ?? "";
  if (!SCHEDULER_SECRET || presented !== SCHEDULER_SECRET) {
    return unauthorized();
  }

  if (!BASE_URL || !ADMIN_KEY) {
    return new Response(
      JSON.stringify({
        error: "Function not configured: missing INSFORGE_BASE_URL or INSFORGE_ADMIN_KEY",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const nowIso = new Date().toISOString();
  const due = await dbSelect<ScheduledPost>(
    "scheduled_posts",
    `?status=eq.queued&scheduled_at=lte.${encodeURIComponent(nowIso)}` +
      `&order=scheduled_at.asc&limit=${MAX_BATCH}`
  );
  if (!due.ok) {
    return new Response(
      JSON.stringify({ error: `Could not load due posts: ${due.error}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const summary = { claimed: 0, published: 0, failed: 0, retried: 0 };
  const errors: string[] = [];

  for (const post of due.rows) {
    summary.claimed += 1;
    try {
      const r = await processPost(post);
      summary[r.outcome] += 1;
      if (r.error && r.outcome !== "published") {
        errors.push(`${post.id}: ${r.error}`);
      }
    } catch (err) {
      summary.failed += 1;
      const msg = (err as Error).message;
      errors.push(`${post.id}: ${msg}`);
      try {
        await markFailed(post.id, msg);
      } catch { /* best effort */ }
    }
  }

  return new Response(
    JSON.stringify({ ...summary, errors }, null, 0),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
