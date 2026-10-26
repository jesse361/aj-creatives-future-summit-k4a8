import Link from "next/link";
import { DemoNote } from "@/components/ui";
import { buttonClass } from "@/lib/styles";

export function TicketCard({
  name,
  description,
  priceLabel,
  benefits = [],
  meta,
  href,
  demo = false,
  recommended = false,
  eligibility,
  actionLabel = "Register",
}: {
  name: string;
  description?: string;
  priceLabel: string;
  benefits?: string[];
  meta?: string;
  href?: string;
  demo?: boolean;
  recommended?: boolean;
  eligibility?: string;
  actionLabel?: string;
}) {
  return (
    <article className={`flex h-full flex-col border ${recommended ? "border-gold bg-midnight text-ivory" : "ticket-rail border-line bg-white text-ink"}`}>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${recommended ? "text-midnight" : "text-forest"}`}>
            <span className={recommended ? "bg-gold px-2 py-1" : ""}>{recommended ? "Recommended" : "Admission"}</span>
          </p>
          {demo ? <DemoNote>Provisional price</DemoNote> : null}
        </div>
        <h3 className="mt-4 font-display text-3xl">{name}</h3>
        {description ? <p className={`mt-3 text-sm leading-6 ${recommended ? "text-ivory/80" : "text-ink-soft"}`}>{description}</p> : null}
        <p className="mt-6 font-display text-4xl tracking-tight">{priceLabel}</p>
        <div className={`my-5 border-t border-dashed ${recommended ? "border-gold/50" : "border-gold/80"}`} />
        {benefits.length ? (
          <ul className="grid gap-2 text-sm leading-6">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {eligibility ? <p className={`mt-4 text-sm leading-6 ${recommended ? "text-ivory/75" : "text-ink-soft"}`}>{eligibility}</p> : null}
        {meta ? <p className={`mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${recommended ? "text-ivory/80" : "text-ink-soft"}`}>{meta}</p> : null}
        {href ? (
          <Link href={href} className={`${buttonClass(recommended ? "gold" : "primary")} mt-6 w-full`}>
            {actionLabel}
          </Link>
        ) : (
          <p className={`mt-6 text-sm ${recommended ? "text-ivory/80" : "text-ink-soft"}`}>Registration is not open for this ticket.</p>
        )}
      </div>
    </article>
  );
}
