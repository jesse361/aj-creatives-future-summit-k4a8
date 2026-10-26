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
}: {
  name: string;
  description?: string;
  priceLabel: string;
  benefits?: string[];
  meta?: string;
  href?: string;
  demo?: boolean;
}) {
  return (
    <article className="ticket-rail flex h-full flex-col border border-line">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">Admission</p>
          {demo ? <DemoNote /> : null}
        </div>
        <h3 className="mt-3 font-display text-2xl text-navy">{name}</h3>
        {description ? <p className="mt-2 text-sm leading-6 text-ink-soft">{description}</p> : null}
        <p className="mt-6 font-display text-4xl tracking-tight text-navy">{priceLabel}</p>
        <div className="my-5 border-t border-dashed border-gold/80" />
        {benefits.length ? (
          <ul className="grid gap-2 text-sm leading-6 text-ink">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {meta ? <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">{meta}</p> : null}
        {href ? (
          <Link href={href} className={`${buttonClass("primary")} mt-6 w-full`}>
            Register
          </Link>
        ) : null}
      </div>
    </article>
  );
}
