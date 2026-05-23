"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { signOutAction } from "@/app/(auth)/actions";
import Logo from "@/app/components/Logo";

type AppShellProps = {
  user: {
    email: string;
    name: string | null;
    avatarUrl: string | null;
  };
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  matches?: (pathname: string) => boolean;
  soon?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/app",
        icon: <HomeIcon />,
        matches: (p) => p === "/app",
      },
    ],
  },
  {
    label: "Create",
    items: [
      {
        label: "Content suggestions",
        href: "/app/content",
        icon: <SparkleIcon />,
        matches: (p) => p === "/app/content" || p.startsWith("/app/content/"),
      },
      {
        label: "Schedule",
        href: "/app/schedule",
        icon: <CalendarIcon />,
        matches: (p) => p === "/app/schedule" || p.startsWith("/app/schedule/"),
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Preferences",
        href: "/app/settings/preferences",
        icon: <SlidersIcon />,
        matches: (p) =>
          p === "/app/settings" ||
          p === "/app/settings/preferences" ||
          p.startsWith("/app/settings/preferences/"),
      },
      {
        label: "Connections",
        href: "/app/settings/connections",
        icon: <PlugIcon />,
        matches: (p) =>
          p === "/app/settings/connections" ||
          p.startsWith("/app/settings/connections/"),
      },
      {
        label: "Billing",
        href: "#",
        icon: <CardIcon />,
        soon: true,
      },
      {
        label: "Contact Support",
        href: "/app/contact",
        icon: <HelpIcon />,
        matches: (p) => p === "/app/contact",
      },
    ],
  },
];

function initialsFor(name: string | null, email: string) {
  const source = name?.trim() || email;
  if (!source) return "?";
  const parts = source.split(/\s+|@/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || source[0]?.toUpperCase() || "?";
}

export default function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the drawer whenever the user navigates to a new route.
  // Adjusting state during render (with a comparison) is the React-recommended
  // pattern for this — see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  const sidebar = (
    <Sidebar
      pathname={pathname}
      user={user}
      onItemClick={() => setDrawerOpen(false)}
    />
  );

  return (
    <div className="relative flex min-h-screen bg-[#08080c] text-zinc-100">
      <BackgroundDecor />

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.06] bg-zinc-950/40 backdrop-blur-xl lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/[0.06] bg-[#0b0a12] shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebar}
        </aside>
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar
          onOpenDrawer={() => setDrawerOpen(true)}
          user={user}
        />
        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  pathname,
  user,
  onItemClick,
}: {
  pathname: string;
  user: AppShellProps["user"];
  onItemClick: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <Link href="/app" onClick={onItemClick}>
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-3 pb-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.matches?.(pathname) ?? false;
                  if (item.soon) {
                    return (
                      <li key={item.label}>
                        <span
                          className="group flex cursor-not-allowed items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500"
                          title="Coming soon"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-zinc-600">{item.icon}</span>
                            <span>{item.label}</span>
                          </span>
                          <span className="rounded-md border border-white/5 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            soon
                          </span>
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onItemClick}
                        className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-white/[0.06] text-white"
                            : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-400 via-fuchsia-400 to-cyan-400"
                          />
                        )}
                        <span
                          className={
                            active
                              ? "text-violet-300 transition-colors"
                              : "text-zinc-500 transition-colors group-hover:text-zinc-300"
                          }
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <UserCard user={user} />
    </div>
  );
}

function UserCard({ user }: { user: AppShellProps["user"] }) {
  const initials = initialsFor(user.name, user.email);
  const displayName = user.name?.trim() || user.email;

  return (
    <div className="border-t border-white/[0.06] p-3">
      <div className="rounded-xl border border-white/[0.06] bg-zinc-900/50 p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-cyan-500/25 text-[11px] font-semibold text-white ring-1 ring-white/10">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-emerald-400"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">{displayName}</div>
            <div className="truncate text-xs text-zinc-500">{user.email}</div>
          </div>
        </div>

        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <LogoutIcon />
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function MobileTopbar({
  onOpenDrawer,
  user,
}: {
  onOpenDrawer: () => void;
  user: AppShellProps["user"];
}) {
  const initials = initialsFor(user.name, user.email);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#08080c]/80 px-4 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-zinc-200 transition-colors hover:bg-white/[0.08]"
        >
          <MenuIcon />
        </button>
        <Logo />
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-cyan-500/25 text-[11px] font-semibold text-white ring-1 ring-white/10">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name ?? user.email}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          initials
        )}
      </div>
    </header>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(60% 35% at 85% 0%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(45% 30% at 0% 100%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(45% 25% at 100% 80%, rgba(232,121,249,0.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />
    </>
  );
}

/* ---------- icons ---------- */

function HomeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 11l8.5-7 8.5 7v9a1 1 0 01-1 1h-5v-6h-5v6h-5a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.5l1.5 3.5 3.5 1.5-3.5 1.5L8 11.5 6.5 8 3 6.5 6.5 5 8 1.5z" />
      <path
        d="M13 10.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6z"
        opacity="0.6"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3h9l4 4v14H6V3zM15 3v4h4M9 12h7M9 16h7M9 8h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 9.5h17M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h12M20 17h0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="18" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3v5M15 3v5M6 8h12v3a6 6 0 1 1-12 0V8zM12 17v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h7a2 2 0 002-2v-3M9 12h12m0 0l-3-3m3 3l-3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
