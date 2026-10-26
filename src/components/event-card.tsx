import Link from "next/link";
import { MediaFill } from "@/components/media-image";
import { DemoNote } from "@/components/ui";
import { FORMAT_LABELS } from "@/lib/constants";
import { eventPlace } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import { buttonClass } from "@/lib/styles";
import { formatDayLabel } from "@/lib/time";

type CardEvent = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  startDate: Date;
  timezone: string;
  eventFormat: string;
  venueName: string;
  city: string;
  coverImage: string;
  coverAlt: string;
  isDemonstration: boolean;
  registrationOpen: boolean;
  status: string;
  ticketTypes?: { priceMinor: number; currency: string; status: string }[];
};

export function EventCard({ event, featured = false }: { event: CardEvent; featured?: boolean }) {
  const ticket = event.ticketTypes?.[0];
  const price = !ticket ? "Pricing to be announced" : ticket.priceMinor === 0 ? "Free" : `From ${formatMoney(ticket.priceMinor, ticket.currency)}`;
  const canRegister = event.status === "PUBLISHED" && event.registrationOpen && ticket;
  return (
    <article className={`group flex h-full overflow-hidden border border-line bg-white ${featured ? "lg:flex-row" : "flex-col"}`}>
      <div className={`relative overflow-hidden bg-navy ${featured ? "min-h-64 lg:w-[46%]" : "aspect-[16/10]"}`}>
        <MediaFill
          src={event.coverImage}
          alt={event.coverAlt || "Illustrative event photograph. Not a confirmed WHY US photograph."}
          sizes={featured ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="media-zoom object-cover"
        />
        <p className="absolute top-0 left-0 bg-navy/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{event.category}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {event.isDemonstration ? <DemoNote /> : null}
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mist">{FORMAT_LABELS[event.eventFormat] ?? event.eventFormat}</p>
        </div>
        <h3 className={`font-display leading-[1.05] text-navy ${featured ? "text-4xl" : "text-2xl"}`}>{event.title}</h3>
        <p className="text-sm text-ink-soft">{formatDayLabel(event.startDate.toISOString(), event.timezone)}</p>
        <p className="text-sm text-ink-soft">{eventPlace(event)}</p>
        <p className="text-sm leading-6 text-ink">{event.shortDescription}</p>
        <p className="font-display text-xl text-navy">{price}</p>
        <div className="mt-auto flex flex-wrap gap-3 pt-3">
          <Link className={buttonClass("primary")} href={`/events/${event.slug}`}>
            Event details
          </Link>
          {canRegister ? (
            <Link className={buttonClass("ghost")} href={`/register?event=${event.slug}`}>
              Register
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
