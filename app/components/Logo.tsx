type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export default function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-9 w-9 shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-pink-500 to-cyan-500 shadow-lg shadow-violet-500/35 animate-pulse-soft" />
        <div className="absolute inset-[1.5px] rounded-[10px] bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="boost-grad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="55%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5"
              stroke="url(#boost-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-white">
          Social
          <span className="bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">Boost</span>
          <span className="text-cyan-400">.</span>
        </span>
      )}
    </div>
  );
}
