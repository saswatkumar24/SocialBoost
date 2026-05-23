import "server-only";

// LinkedIn OAuth 2.0 (Authorization Code flow) and Posts API helpers.
//
// Required env vars:
//   LINKEDIN_CLIENT_ID
//   LINKEDIN_CLIENT_SECRET
//   NEXT_PUBLIC_APP_URL  (also used for the OAuth redirect_uri)
//
// The configured LinkedIn app must have the following products enabled:
//   - "Sign In with LinkedIn using OpenID Connect"  (gives `openid profile email`)
//   - "Share on LinkedIn"                            (gives `w_member_social`)
// And the redirect URL `${NEXT_PUBLIC_APP_URL}/api/linkedin/callback` must be
// registered under the app's "Authorized redirect URLs for your app" list.

export const LINKEDIN_SCOPES = "openid profile email w_member_social";
const LINKEDIN_API_VERSION = "202604"; // li-lms-2026-04
const REDIRECT_PATH = "/api/linkedin/callback";

const AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const POSTS_URL = "https://api.linkedin.com/rest/posts";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in .env.local. See lib/linkedin.ts for the full list of required environment variables.`
    );
  }
  return value;
}

export function getRedirectUri(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}${REDIRECT_PATH}`;
}

export function buildAuthUrl(state: string): string {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    scope: LINKEDIN_SCOPES,
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export type LinkedinTokenResponse = {
  access_token: string;
  expires_in: number; // seconds
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
};

async function postForm(
  url: string,
  body: Record<string, string>
): Promise<{ ok: boolean; status: number; data: unknown; text: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* non-JSON body */
  }
  return { ok: res.ok, status: res.status, data, text };
}

export async function exchangeCode(
  code: string
): Promise<{ ok: true; tokens: LinkedinTokenResponse } | { ok: false; error: string }> {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const clientSecret = requireEnv("LINKEDIN_CLIENT_SECRET");

  const result = await postForm(TOKEN_URL, {
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
    client_id: clientId,
    client_secret: clientSecret,
  });

  if (!result.ok || !result.data) {
    const errMsg = describeError(result.data, result.text);
    return { ok: false, error: errMsg };
  }
  const tokens = result.data as LinkedinTokenResponse;
  if (!tokens.access_token) {
    return { ok: false, error: "LinkedIn token response missing access_token." };
  }
  return { ok: true, tokens };
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<{ ok: true; tokens: LinkedinTokenResponse } | { ok: false; error: string }> {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const clientSecret = requireEnv("LINKEDIN_CLIENT_SECRET");

  const result = await postForm(TOKEN_URL, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  if (!result.ok || !result.data) {
    return { ok: false, error: describeError(result.data, result.text) };
  }
  const tokens = result.data as LinkedinTokenResponse;
  if (!tokens.access_token) {
    return { ok: false, error: "LinkedIn refresh did not return an access_token." };
  }
  return { ok: true, tokens };
}

export type LinkedinUserinfo = {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  locale?: string | { country?: string; language?: string };
};

export async function getUserinfo(
  accessToken: string
): Promise<{ ok: true; user: LinkedinUserinfo } | { ok: false; status: number; error: string }> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* fall through */
  }
  if (!res.ok || !data) {
    return {
      ok: false,
      status: res.status,
      error: describeError(data, text) || `LinkedIn /userinfo returned ${res.status}`,
    };
  }
  const u = data as LinkedinUserinfo;
  if (!u.sub) {
    return { ok: false, status: res.status, error: "LinkedIn /userinfo missing sub." };
  }
  return { ok: true, user: u };
}

export type CreateTextPostInput = {
  accessToken: string;
  sub: string;
  body: string;
};

export type CreateTextPostResult =
  | { ok: true; postUrn: string }
  | { ok: false; status: number; error: string };

export async function createTextPost(
  input: CreateTextPostInput
): Promise<CreateTextPostResult> {
  const { accessToken, sub, body } = input;

  if (!body.trim()) {
    return { ok: false, status: 400, error: "Post body is empty." };
  }

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

  const res = await fetch(POSTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Linkedin-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (res.status === 201) {
    const postUrn =
      res.headers.get("x-restli-id") ?? res.headers.get("X-RestLi-Id") ?? "";
    return { ok: true, postUrn };
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text);
  } catch {
    /* non-JSON body */
  }
  return {
    ok: false,
    status: res.status,
    error: describeError(data, text) || `LinkedIn /rest/posts returned ${res.status}`,
  };
}

function describeError(data: unknown, text: string): string {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const msg =
      (obj.error_description as string | undefined) ||
      (obj.error as string | undefined) ||
      (obj.message as string | undefined);
    if (msg) return String(msg);
  }
  if (text && text.length < 500) return text;
  return "Unknown LinkedIn API error.";
}
