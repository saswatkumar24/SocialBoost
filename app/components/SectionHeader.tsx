type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`${
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      } ${className}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-300">
          <span className="h-1 w-1 rounded-full bg-blue-400" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
