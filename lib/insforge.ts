import "server-only";

import { createClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.INSFORGE_ANON_KEY;

if (!baseUrl || !anonKey) {
  throw new Error(
    "Missing InsForge environment variables. Ensure NEXT_PUBLIC_INSFORGE_URL and INSFORGE_ANON_KEY are set in .env.local."
  );
}

export const ACCESS_COOKIE = "insforge_access_token";
export const REFRESH_COOKIE = "insforge_refresh_token";
export const PKCE_COOKIE = "insforge_code_verifier";

export const ACCESS_COOKIE_MAX_AGE = 60 * 15;
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const PKCE_COOKIE_MAX_AGE = 60 * 10;

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function createInsForgeServerClient(accessToken?: string) {
  return createClient({
    baseUrl: baseUrl!,
    anonKey: anonKey!,
    isServerMode: true,
    edgeFunctionToken: accessToken,
  });
}
