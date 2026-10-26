import Link from "next/link";

export function Emblem({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="6" y="6" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 48 L32 14 L48 48" fill="none" stroke="#D6AD60" strokeWidth="1.5" />
      <path d="M22.5 34.5 H41.5" stroke="#D6AD60" strokeWidth="1.5" />
    </svg>
  );
}

export function BrandLogo({ name, compact = false, onNavigate }: { name: string; compact?: boolean; onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex min-w-0 items-center gap-3 text-ivory">
      <span className="grid h-11 w-11 shrink-0 place-items-center text-ivory">
        <Emblem className="h-10 w-10" />
      </span>
      <span className="min-w-0 leading-none">
        <span className="block truncate font-display text-[1.65rem] font-medium tracking-tight">{name}</span>
        {compact ? null : <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold">Events & Conference Hub</span>}
      </span>
    </Link>
  );
}
