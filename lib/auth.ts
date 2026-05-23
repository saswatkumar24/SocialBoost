import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
  authCookieOptions,
  createInsForgeServerClient,
} from "./insforge";

export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  } | null;
  metadata: Record<string, unknown> | null;
  providers?: string[];
};

// These cookie writers are safe to call from Server Actions and Route Handlers
// only — never from a Server Component render. Cookie refresh that happens
// transparently on every request is handled by `proxy.ts`.
export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessToken, {
    ...authCookieOptions(),
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE, refreshToken, {
      ...authCookieOptions(),
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

// Read-only: safe to call from Server Components, Layouts, Server Actions,
// and Route Handlers. The proxy refreshes expired access tokens before the
// request reaches here, so we just need to validate the token we see.
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  const insforge = createInsForgeServerClient(accessToken);
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) return null;

  return data.user as AuthUser;
});
