import Image from "next/image";
import { Countdown } from "@/components/countdown";
import { ButtonLink, DemoNote } from "@/components/ui";
import { brand } from "@/config/brand";
import { mapsSearchUrl } from "@/lib/format";
import { formatSummitRange } from "@/lib/time";

export type HomeTicket = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  benefits: string[];
  eligibility: string;
  remaining: number | null;
  demo: boolean;
  recommended: boolean;
};

export type HomeSession = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  room: string;
  category: string;
  speakers: string;
};

export type HomeEvent = {
  title: string;
  theme: string;
  slug: string | null;
  startIso: string;
  endIso: string;
  timezone: string;
  venueName: string;
  venueAddress: string;
  city: string;
  country: string;
  travelInfo: string;
  accessibilityInfo: string;
  isDemonstration: boolean;
  registrationOpen: boolean;
  tickets: HomeTicket[];
  sessions: HomeSession[];
};

export function Hero({ event }: { event: HomeEvent }) {
  const dates = formatSummitRange(event.startIso, event.endIso, event.timezone);
  const place = [event.city, event.country].filter(Boolean).join(", ");
  const explore = event.slug ? `/events/${event.slug}` : "/schedule";
  const tickets = event.slug ? `/register?event=${event.slug}` : "/tickets";
  return (
    <section className="relative -mt-[4.75rem] overflow-hidden bg-midnight text-ivory">
      <Image
        src="/images/hero.jpg"
        alt="Illustrative photograph of a conference audience. Not a confirmed Ahene Fia event."
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="hero-shade pointer-events-none absolute inset-0" />
      <div className="motif pointer-events-none absolute inset-0 opacity-25" aria-hidden />
      <div className="shell relative grid min-h-[100svh] items-end gap-10 pt-32 pb-14 sm:pt-36 lg:grid-cols-12 lg:pb-20">
        <div className="rise lg:col-span-7">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">Experience. Connection. Excellence.</p>
          <h1 className="mt-5 max-w-xl font-display text-[2.65rem] font-medium leading-[0.96] sm:text-6xl lg:text-7xl">Where Vision Meets Experience.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ivory/85 sm:text-lg sm:leading-8">{brand.secondaryTagline}</p>
          <p className="mt-6 max-w-md text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.16em] text-gold">{brand.signature}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={explore} variant="secondary">Explore the Event</ButtonLink>
            <ButtonLink href={tickets} variant="gold">Secure Your Ticket</ButtonLink>
          </div>
          <a href="#gathering" className="mt-10 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory/75">
            <span className="h-8 w-px bg-gold" aria-hidden />
            Scroll
          </a>
        </div>
        <aside className="rise border border-white/15 bg-midnight/80 p-6 backdrop-blur-md lg:col-span-5" style={{ animationDelay: "120ms" }}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold">Featured gathering</p>
            {event.isDemonstration ? <DemoNote>Demonstration event</DemoNote> : null}
          </div>
          <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">{event.title}</h2>
          <p className="mt-3 text-sm leading-6 text-ivory/80">{event.theme}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone">Dates</dt>
              <dd className="mt-1">{dates}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone">Venue</dt>
              <dd className="mt-1">{event.venueName}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone">City</dt>
              <dd className="mt-1">{place || "City to be confirmed"}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone">Timezone</dt>
              <dd className="mt-1">{event.timezone}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

export function CountdownBand({ event }: { event: HomeEvent }) {
  return (
    <section id="gathering" className="bg-forest text-ivory">
      <div className="shell grid items-center gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">Countdown</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Until the doors open.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-ivory/75">
            The clock follows the published start in {event.timezone}. It does not announce every second.
          </p>
        </div>
        <Countdown startAt={event.startIso} endAt={event.endIso} timeZone={event.timezone} />
      </div>
    </section>
  );
}

export function venueDirections(event: HomeEvent) {
  return mapsSearchUrl([event.venueName, event.venueAddress, event.city, event.country]);
}
