"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { upsertCreatorProfile } from "@/lib/creator-profile";
import {
  CONTENT_CATEGORIES,
  MAX_AUDIENCE,
  MAX_CATEGORIES,
  MAX_DESCRIPTION,
  TONE_OPTIONS,
} from "@/lib/creator-profile-shared";

const ALLOWED_CATEGORIES = new Set<string>(CONTENT_CATEGORIES);
const ALLOWED_TONES = new Set<string>(TONE_OPTIONS.map((t) => t.value));

export type PreferencesFormState = {
  status: "idle" | "saved" | "error";
  message?: string;
};

export async function savePreferencesAction(
  _prev: PreferencesFormState | undefined,
  formData: FormData
): Promise<PreferencesFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const description = String(formData.get("description") ?? "").trim().slice(0, MAX_DESCRIPTION);
  const audienceRaw = String(formData.get("target_audience") ?? "").trim();
  const target_audience = audienceRaw ? audienceRaw.slice(0, MAX_AUDIENCE) : null;

  const toneRaw = String(formData.get("tone") ?? "").trim();
  const tone = toneRaw && ALLOWED_TONES.has(toneRaw) ? toneRaw : null;

  const rawCategories = formData.getAll("categories").map((v) => String(v).trim());
  const categories = Array.from(
    new Set(rawCategories.filter((c) => ALLOWED_CATEGORIES.has(c)))
  ).slice(0, MAX_CATEGORIES);

  if (!description && categories.length === 0) {
    return {
      status: "error",
      message: "Add a short description or pick at least one category.",
    };
  }

  const result = await upsertCreatorProfile(user.id, {
    description,
    categories,
    target_audience,
    tone,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error ?? "Could not save your preferences. Please try again.",
    };
  }

  revalidatePath("/app");
  revalidatePath("/app/settings/preferences");
  revalidatePath("/app/content");

  return { status: "saved", message: "Saved." };
}
