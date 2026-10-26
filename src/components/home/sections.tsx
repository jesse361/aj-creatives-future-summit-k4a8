import Image from "next/image";
import { Compass, Handshake, Landmark, Sparkles } from "lucide-react";
import { SpeakerCard } from "@/components/speaker-card";
import { TicketCard } from "@/components/ticket-card";
import { ButtonLink, DemoNote, SectionHeading } from "@/components/ui";
import { pillars } from "@/config/brand";
import { demoSponsors } from "@/config/demo";
import type { HomeEvent } from "@/components/home/hero";
import { venueDirections } from "@/components/home/hero";
import { formatTimeRange, formatSummitRange } from "@/lib/time";

const icons = [Landmark, Handshake, Compass, Sparkles];

export function AboutExperience({ body }: { body?: string | null }) {
  const copy = body?.trim() || "Ahene Fia brings leaders, innovators, entrepreneurs, creatives, and professionals into the same room to exchange ideas, start working relationships, and look at what they might build next.";
  return (
    <section className="shell grid items-center gap-10 py-20 lg:grid-cols-12 lg:py-28">
      <div className="relative min-h-80 lg:col-span-5 lg:min-h-[34rem]">
        <Image src="/images/conversation.jpg" alt="Illustrative photograph of a professional conversation. Not a confirmed Ahene Fia event." fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <SectionHeading eyebrow="The experience" title="More Than an Event. A Meeting of Possibilities." />
        <div className="mt-6 grid gap-4 text-base leading-7 text-ink-soft">
          {copy.split(/\n\n+/).map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p>The programme can hold conferences, corporate events, technology summits, business forums, leadership workshops, cultural gatherings, and private institutional meetings. Nothing on this page claims a past attendance figure or a company history.</p>
        </div>
        <dl className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Host city preview</dt>
            <dd className="mt-2 text-sm leading-6">Accra, for the labeled 2027 demonstration summit.</dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Clock</dt>
            <dd className="mt-2 text-sm leading-6">Africa/Accra, the event timezone in configuration.</dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Prices</dt>
            <dd className="mt-2 text-sm leading-6">Taken from the published catalogue, not from the browser.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function ExperiencePillars() {
  return (
    <section className="bg-midnight text-ivory">
      <div className="shell py-20 lg:py-28">
        <SectionHeading light eyebrow="What the room is for" title="Four ways the gathering is held." description="A balanced set of intentions, not a list of claims about past events." />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {pillars.map((pillar, index) => {
            const Icon = icons[index] ?? Landmark;
            const span = index === 0 ? "lg:col-span-7 lg:min-h-80" : index === 1 ? "lg:col-span-5" : "lg:col-span-6";
            return (
              <article key={pillar.title} className={`group border border-white/15 p-6 transition hover:border-gold sm:p-8 ${span}`}>
                <div className="flex items-center justify-between">
                  <Icon aria-hidden className="text-gold" size={22} />
                  <span className="font-display text-2xl text-gold">0{index + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-3xl">{pillar.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-ivory/75">{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SpeakerPreview({
  speakers,
}: {
  speakers: { slug: string; name: string; professionalTitle: string; organization: string; portrait: string; isDemonstration: boolean; topic?: string }[];
}) {
  return (
    <section className="shell py-20 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Voices" title="Featured speakers" description="Published profiles only. Demonstration profiles are fictional samples, not confirmed guests." />
        <ButtonLink href="/speakers" variant="ghost">All speakers</ButtonLink>
      </div>
      {speakers.length ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <SpeakerCard
              key={speaker.slug}
              href={`/speakers/${speaker.slug}`}
              name={speaker.name}
              title={speaker.professionalTitle}
              organization={speaker.organization}
              topic={speaker.topic}
              portrait={speaker.portrait}
              demonstration={speaker.isDemonstration}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 border border-dashed border-line px-6 py-12 text-ink-soft">Speaker profiles will appear when they are published.</p>
      )}
    </section>
  );
}

export function SchedulePreview({ event }: { event: HomeEvent }) {
  return (
    <section className="border-y border-line bg-white">
      <div className="shell py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Agenda" title="A first look at the days." description={event.slug ? `Sessions from ${event.title}, in ${event.timezone}.` : "A published agenda will appear with the next event."} />
          <ButtonLink href={event.slug ? `/schedule?event=${event.slug}` : "/schedule"} variant="ghost">Full schedule</ButtonLink>
        </div>
        {event.isDemonstration ? <div className="mt-4"><DemoNote>Demonstration agenda</DemoNote></div> : null}
        <ol className="mt-8 divide-y divide-line">
          {event.sessions.map((session) => (
            <li key={session.id} className="grid gap-2 py-5 md:grid-cols-[11rem_1fr_auto] md:items-baseline">
              <p className="text-sm font-semibold text-forest">{formatTimeRange(session.startAt, session.endAt, event.timezone)}</p>
              <div>
                <h3 className="font-display text-2xl text-midnight">{session.title}</h3>
                <p className="text-sm text-ink-soft">{session.speakers || session.category}</p>
              </div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">{session.category}{session.room ? ` · ${session.room}` : ""}</p>
            </li>
          ))}
        </ol>
        {event.sessions.length === 0 ? <p className="mt-8 text-ink-soft">No published sessions yet.</p> : null}
      </div>
    </section>
  );
}

export function TicketHighlights({ event }: { event: HomeEvent }) {
  return (
    <section className="shell py-20 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Tickets" title="Choose how you enter the room." description="Demonstration prices are provisional values in Ghanaian cedis. They are not a confirmed offer." />
        <ButtonLink href="/tickets" variant="ghost">All tickets</ButtonLink>
      </div>
      <ul className="mt-10 grid gap-5 lg:grid-cols-3">
        {event.tickets.map((ticket) => (
          <li key={ticket.id || ticket.name}>
            <TicketCard
              name={ticket.name}
              description={ticket.description}
              priceLabel={ticket.priceLabel}
              benefits={ticket.benefits}
              eligibility={ticket.eligibility}
              meta={ticket.remaining == null ? "Inventory appears with the live catalogue" : `${ticket.remaining} places remaining`}
              href={ticket.remaining === 0 ? undefined : event.slug && event.registrationOpen ? `/register?event=${event.slug}&ticket=${ticket.id}` : "/tickets"}
              demo={ticket.demo}
              recommended={ticket.recommended}
              actionLabel={event.slug && event.registrationOpen && ticket.remaining !== 0 ? "Register" : "View tickets"}
            />
          </li>
        ))}
      </ul>
      {event.tickets.length === 0 ? <p className="mt-8 text-ink-soft">Tickets appear when an upcoming event is published.</p> : null}
    </section>
  );
}

export function VenueSection({ event }: { event: HomeEvent }) {
  const maps = venueDirections(event);
  const dates = formatSummitRange(event.startIso, event.endIso, event.timezone);
  return (
    <section className="bg-white">
      <div className="shell grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
        <div className="relative min-h-72 lg:col-span-5 lg:min-h-[32rem]">
          <Image src="/images/stage.jpg" alt="Illustrative photograph of a conference stage. Not a confirmed photograph of the venue." fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading eyebrow="Venue and travel" title={event.venueName} description="Travel notes stay limited to what has been confirmed. Unknown details are marked rather than invented." />
          <dl className="mt-8 grid gap-5 text-sm leading-6">
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Address</dt>
              <dd className="mt-1">{event.venueAddress}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">City</dt>
              <dd className="mt-1">{[event.city, event.country].filter(Boolean).join(", ") || "To be confirmed"}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Dates</dt>
              <dd className="mt-1">{dates} · {event.timezone}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Transportation</dt>
              <dd className="mt-1 text-ink-soft">{event.travelInfo}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Accommodation</dt>
              <dd className="mt-1 text-ink-soft">Ahene Fia has not confirmed hotel partnerships or room blocks. Arrange your own stay. This is not a booking agreement.</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">Accessibility</dt>
              <dd className="mt-1 text-ink-soft">{event.accessibilityInfo}</dd>
            </div>
          </dl>
          {maps ? (
            <div className="mt-8">
              <a className="text-sm font-semibold text-forest underline decoration-gold underline-offset-4" href={maps}>Directions</a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function SponsorSection({ sponsors }: { sponsors: { id: string; name: string; logo: string; logoAlt: string; website: string; tier: string }[] }) {
  const usingPlaceholders = sponsors.length === 0;
  const items = usingPlaceholders
    ? demoSponsors.map((sponsor) => ({ id: sponsor.name, name: sponsor.name, logo: sponsor.logo, logoAlt: sponsor.logoAlt, website: "", tier: sponsor.tier }))
    : sponsors;
  const allDemo = items.every((item) => /demonstration|demo/i.test(item.name) || /demonstration|demo/i.test(item.tier));
  return (
    <section className="shell py-20 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Supporters" title="Sponsors and partners" description={allDemo ? "These marks are placeholders. They are not confirmed sponsors or partners." : "Approved partners published by the organizer."} />
        <ButtonLink href="/contact?category=SPONSORSHIP" variant="ghost">Become a Partner</ButtonLink>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((sponsor) => (
          <li key={sponsor.id} className="flex min-h-40 flex-col justify-between border border-line bg-white p-5">
            <div className="flex h-20 items-center">
              {sponsor.logo ? (
                // Local SVG marks keep their own proportions. object-contain avoids stretching.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sponsor.logo} alt={sponsor.logoAlt || ""} className="max-h-16 w-auto max-w-full object-contain" />
              ) : (
                <p className="font-display text-2xl text-midnight">{sponsor.name}</p>
              )}
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-forest">{sponsor.tier}</p>
              <p className="mt-1 font-display text-2xl text-midnight">{sponsor.name}</p>
              {sponsor.website.startsWith("https://") || sponsor.website.startsWith("http://") ? <a className="mt-2 inline-block text-sm text-forest underline" href={sponsor.website}>Visit</a> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CommunitySection({ testimonials }: { testimonials: { id: string; quote: string; name: string; role: string }[] }) {
  if (testimonials.length) {
    return (
      <section className="bg-white">
        <div className="shell py-20 lg:py-24">
          <SectionHeading eyebrow="From the room" title="Words people asked us to share." description="Only testimonials an administrator has approved are shown." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.id} className="border border-line bg-ivory p-6">
                <p className="font-display text-2xl leading-snug text-midnight">“{item.quote}”</p>
                <footer className="mt-4 text-sm text-ink-soft">{item.name}{item.role ? `, ${item.role}` : ""}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-ivory">
      <div className="shell grid gap-8 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="The room" title="A standard, not a stack of invented praise." />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="font-display text-3xl leading-snug text-midnight sm:text-4xl">Ahene Fia is for people who want the conversation to continue after the last session.</p>
          <p className="mt-6 text-base leading-7 text-ink-soft">Until attendees choose to share their own words, this space stays a brand statement. It is not a wall of reviews, ratings, or quotations we wrote ourselves.</p>
        </div>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-midnight text-ivory">
      <Image src="/images/networking.jpg" alt="Illustrative photograph of people talking at an event. Not a confirmed Ahene Fia gathering." fill className="object-cover opacity-30" sizes="100vw" />
      <div className="absolute inset-0 bg-midnight/75" />
      <div className="motif pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="shell relative py-20 lg:py-28">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">Ahene Fia</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] sm:text-6xl">Your Next Opportunity Starts with a Conversation.</h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/80">Be part of a gathering built around ideas, ambition, and the people who make progress possible.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/tickets" variant="gold">Explore Tickets</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Contact Our Team</ButtonLink>
        </div>
      </div>
    </section>
  );
}
