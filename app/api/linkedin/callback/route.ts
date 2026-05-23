import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { exchangeCode, getUserinfo } from "@/lib/linkedin";
import { upsertLinkedinConnection } from "@/lib/linkedin-connection";

const STATE_COOKIE = "linkedin_oauth_state";
const CONNECTIONS_PATH = "/app/settings/connections";

function connectionsUrl(request: NextRequest, params: Record<string, string>) {
  const url = new URL(CONNECTIONS_PATH, request.url);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const stateParam = params.get("state");
  const oauthError = params.get("error");
  const oauthErrorDescription = params.get("error_description");

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(STATE_COOKIE)?.value;

  // Always clear the state cookie on the way out.
  const clearStateCookie = (res: NextResponse) => {
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  if (oauthError) {
    return clearStateCookie(
      NextResponse.redirect(
        connectionsUrl(request, {
          status: "error",
          message: oauthErrorDescription || oauthError,
        })
      )
    );
  }

  if (!code) {
    return clearStateCookie(
      NextResponse.redirect(
        connectionsUrl(request, {
          status: "error",
          message: "Missing authorization code from LinkedIn.",
        })
      )
    );
  }

  if (!stateCookie || !stateParam || stateCookie !== stateParam) {
    return clearStateCookie(
      NextResponse.redirect(
        connectionsUrl(request, {
          status: "error",
          message: "OAuth state mismatch. Please try connecting again.",
        })
      )
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", CONNECTIONS_PATH);
    return clearStateCookie(NextResponse.redirect(signIn));
  }

  const tokenResult = await exchangeCode(code);
  if (!tokenResult.ok) {
    return clearStateCookie(
      NextResponse.redirect(
        connectionsUrl(request, { status: "error", message: tokenResult.error })
      )
    );
  }

  const userinfoResult = await getUserinfo(tokenResult.tokens.access_token);
  if (!userinfoResult.ok) {
    return clearStateCookie(
      NextResponse.redirect(
        connectionsUrl(request, { status: "error", message: userinfoResult.error })
      )
    );
  }

  const tokens = tokenResult.tokens;
  const expiresAt =
    typeof tokens.expires_in === "number" && tokens.expires_in > 0
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

  const upsert = await upsertLinkedinConnection(user.id, {
    linkedin_sub: userinfoResult.user.sub,
    linkedin_name: userinfoResult.user.name ?? null,
    linkedin_email: userinfoResult.user.email ?? null,
    linkedin_picture: userinfoResult.user.picture ?? null,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? null,
    expires_at: expiresAt,
    scope: tokens.scope ?? null,
  });

  if (!upsert.ok) {
    return clearStateCookie(
      NextResponse.redirect(
        connectionsUrl(request, { status: "error", message: upsert.error })
      )
    );
  }

  return clearStateCookie(
    NextResponse.redirect(connectionsUrl(request, { status: "connected" }))
  );
}
