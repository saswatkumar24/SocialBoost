import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "insforge_access_token";
const REFRESH_COOKIE = "insforge_refresh_token";
const PKCE_COOKIE = "insforge_code_verifier";

const ACCESS_COOKIE_MAX_AGE = 60 * 15;
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AUTH_PAGES = new Set(["/sign-in", "/sign-up"]);

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

type RefreshedTokens = {
  accessToken: string;
  refreshToken: string;
};

async function refreshSession(refreshToken: string): Promise<RefreshedTokens | null> {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.INSFORGE_ANON_KEY;
  if (!baseUrl || !anonKey) return null;

  try {
    const res = await fetch(`${baseUrl}/api/auth/refresh?client_type=mobile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      // Proxy/middleware should not be cached
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    if (!data?.accessToken) return null;

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? refreshToken,
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  // If the access token has expired but we still have a refresh token,
  // try to refresh transparently before the request reaches the page.
  let refreshed: RefreshedTokens | null = null;
  let refreshFailed = false;
  if (!accessToken && refreshToken) {
    refreshed = await refreshSession(refreshToken);
    if (refreshed) {
      accessToken = refreshed.accessToken;
      // Make the refreshed access token visible to downstream Server Components
      // (they read cookies via `next/headers` -> the request cookie jar).
      request.cookies.set(ACCESS_COOKIE, refreshed.accessToken);
    } else {
      refreshFailed = true;
    }
  }

  const hasSession = !!accessToken;

  // Protect the /app route tree.
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("next", pathname);
      const res = NextResponse.redirect(url);
      // If the refresh token was bad, clear it so the user re-auths cleanly.
      if (refreshFailed) {
        res.cookies.delete(REFRESH_COOKIE);
        res.cookies.delete(PKCE_COOKIE);
      }
      return res;
    }
  }

  // Bounce already-signed-in users away from auth pages.
  if (hasSession && AUTH_PAGES.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Build the response. Forward any header mutations to the page so that
  // refreshed cookies flow through as expected.
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Persist the new tokens to the browser if we just refreshed.
  if (refreshed) {
    response.cookies.set(ACCESS_COOKIE, refreshed.accessToken, {
      ...COOKIE_OPTS,
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });
    response.cookies.set(REFRESH_COOKIE, refreshed.refreshToken, {
      ...COOKIE_OPTS,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
  } else if (refreshFailed) {
    response.cookies.delete(REFRESH_COOKIE);
    response.cookies.delete(PKCE_COOKIE);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.webp$).*)",
  ],
};
