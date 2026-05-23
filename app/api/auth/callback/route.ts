import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  PKCE_COOKIE,
  REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
  authCookieOptions,
  createInsForgeServerClient,
} from "@/lib/insforge";

const SAFE_NEXT_PATH_REGEX = /^\/(?!\/)/;

function safeNext(next: string | null): string {
  if (!next || !SAFE_NEXT_PATH_REGEX.test(next)) return "/app";
  return next;
}

function signInUrl(request: NextRequest, error: string) {
  const url = new URL("/sign-in", request.url);
  url.searchParams.set("error", error);
  return url;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("insforge_code");
  const oauthError = params.get("error");
  const next = safeNext(params.get("next"));

  if (oauthError) {
    return NextResponse.redirect(signInUrl(request, oauthError));
  }

  if (!code) {
    return NextResponse.redirect(signInUrl(request, "missing_authorization_code"));
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get(PKCE_COOKIE)?.value;

  if (!codeVerifier) {
    return NextResponse.redirect(signInUrl(request, "missing_pkce_verifier"));
  }

  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.auth.exchangeOAuthCode(code, codeVerifier);

  if (error || !data?.accessToken) {
    return NextResponse.redirect(
      signInUrl(request, error?.message ?? "oauth_exchange_failed")
    );
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  const options = authCookieOptions();

  response.cookies.set(ACCESS_COOKIE, data.accessToken, {
    ...options,
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  if (data.refreshToken) {
    response.cookies.set(REFRESH_COOKIE, data.refreshToken, {
      ...options,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
  }

  response.cookies.delete(PKCE_COOKIE);

  return response;
}
