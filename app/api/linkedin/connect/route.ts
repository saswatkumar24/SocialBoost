import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { authCookieOptions } from "@/lib/insforge";
import { buildAuthUrl } from "@/lib/linkedin";

const STATE_COOKIE = "linkedin_oauth_state";
const STATE_COOKIE_MAX_AGE = 60 * 10; // 10 minutes

function randomState(): string {
  // 32 bytes -> 43 char base64url, plenty for OAuth state.
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("next", "/app/settings/connections");
    return NextResponse.redirect(url);
  }

  const state = randomState();
  const authUrl = await buildAuthUrl(state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set(STATE_COOKIE, state, {
    ...authCookieOptions(),
    maxAge: STATE_COOKIE_MAX_AGE,
  });
  return response;
}
