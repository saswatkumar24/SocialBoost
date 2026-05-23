import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import AppShell from "./_components/AppShell";

export const metadata = {
  title: "SocialBoost — Dashboard",
};

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?next=/app");
  }

  return (
    <AppShell
      user={{
        email: user.email,
        name: user.profile?.name ?? null,
        avatarUrl: user.profile?.avatar_url ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
