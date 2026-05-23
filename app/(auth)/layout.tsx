import Link from "next/link";

import Logo from "@/app/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(50% 35% at 80% 100%, rgba(99,102,241,0.18), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <header className="relative z-10 px-6 pt-6 sm:px-10">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center text-xs text-slate-500 sm:px-10">
        <p>
          By continuing you agree to our{" "}
          <Link href="/" className="text-slate-300 hover:text-white">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/" className="text-slate-300 hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}
