"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACCESS_COOKIE,
  PKCE_COOKIE,
  PKCE_COOKIE_MAX_AGE,
  REFRESH_COOKIE,
  authCookieOptions,
  createInsForgeServerClient,
} from "@/lib/insforge";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth";

export type AuthFormState = {
  error?: string;
  email?: string;
};

const SAFE_NEXT_PATH_REGEX = /^\/(?!\/)/;

function safeNext(next: string | null | undefined): string {
  if (!next) return "/app";
  if (!SAFE_NEXT_PATH_REGEX.test(next)) return "/app";
  return next;
}

function readForm(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const next = safeNext(String(formData.get("next") ?? "/app"));
  return { email, password, name, next };
}

export async function signInAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const { email, password, next } = readForm(formData);

  if (!email || !password) {
    return { error: "Email and password are required.", email };
  }

  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.accessToken) {
    return {
      error: error?.message ?? "Invalid email or password.",
      email,
    };
  }

  await setAuthCookies(data.accessToken, data.refreshToken);
  redirect(next);
}

export async function signUpAction(
  _prev: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const { email, password, name, next } = readForm(formData);

  if (!email || !password) {
    return { error: "Email and password are required.", email };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters.", email };
  }

  const insforge = createInsForgeServerClient();
  const { data, error } = await insforge.auth.signUp({
    email,
    password,
    name: name || undefined,
  });

  if (error) {
    return { error: error.message ?? "Could not create account.", email };
  }

  if (data?.accessToken) {
    await setAuthCookies(data.accessToken, data.refreshToken);
    redirect(next);
  }

  return {
    error:
      "We could not sign you in automatically. Please try signing in with the credentials you just created.",
    email,
  };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (accessToken || refreshToken) {
    try {
      const insforge = createInsForgeServerClient(accessToken);
      await insforge.auth.signOut();
    } catch {
      // we still clear local cookies regardless of remote signout success
    }
  }

  await clearAuthCookies();
  redirect("/");
}

export async function initiateOAuth(provider: "google" | "github", next?: string) {
  const insforge = createInsForgeServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const callbackUrl = new URL("/api/auth/callback", appUrl);
  if (next) callbackUrl.searchParams.set("next", safeNext(next));

  const { data, error } = await insforge.auth.signInWithOAuth({
    provider,
    redirectTo: callbackUrl.toString(),
    skipBrowserRedirect: true,
  });

  if (error || !data?.url || !data?.codeVerifier) {
    redirect(
      `/sign-in?error=${encodeURIComponent(error?.message ?? "Failed to start OAuth flow.")}`
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(PKCE_COOKIE, data.codeVerifier!, {
    ...authCookieOptions(),
    maxAge: PKCE_COOKIE_MAX_AGE,
  });

  redirect(data.url!);
}
