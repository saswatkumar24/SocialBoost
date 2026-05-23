"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { deleteLinkedinConnection } from "@/lib/linkedin-connection";

export type DisconnectLinkedinState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

export async function disconnectLinkedinAction(
  _prev: DisconnectLinkedinState | undefined,
  formData: FormData
): Promise<DisconnectLinkedinState> {
  // The form is intentionally empty; the action just needs the prev/formData
  // signature for `useActionState`.
  void _prev;
  void formData;

  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const result = await deleteLinkedinConnection(user.id);
  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  revalidatePath("/app");
  revalidatePath("/app/content");
  revalidatePath("/app/settings/connections");
  return { status: "ok", message: "LinkedIn disconnected." };
}
