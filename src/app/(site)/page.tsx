import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutExperience, ClosingCta, CommunitySection, ExperiencePillars, SchedulePreview, SpeakerPreview, SponsorSection, TicketHighlights, VenueSection } from "@/components/home/sections";
import { CountdownBand, Hero, type HomeEvent, type HomeSession, type HomeTicket } from "@/components/home/hero";
import { brand } from "@/config/brand";
import { demoEvent, demoSessions, demoSpeakers, demoTickets } from "@/config/demo";
import { appUrl } from "@/lib/app-url";
import { formatMajor } from "@/lib/money";
import { getApprovedSponsors, getApprovedTestimonials, getPublishedSpeakers, getSpotlightEvent, toPublicSession } from "@/lib/queries";
import { getPage, getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { absolute: settings.seoTitle || brand.seoTitle },
    description: settings.seoDescription || brand.seoDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.seoTitle || brand.seoTitle,
      description: settings.seoDescription || brand.seoDescription,
      images: ["/images/hero.jpg"],
    },
  };
}

function fallbackEvent(): HomeEvent {
  return {
    title: demoEvent.title,
    theme: demoEvent.theme,
    slug: null,
    startIso: demoEvent.startDate,
    endIso: demoEvent.endDate,
    timezone: demoEvent.timezone,
    venueName: demoEvent.venueName,
    venueAddress: demoEvent.venueAddress,
    city: demoEvent.city,
    country: demoEvent.country,
    travelInfo: demoEvent.travelInfo,
    accessibilityInfo: demoEvent.accessibilityInfo,
    isDemonstration: true,
    registrationOpen: false,
    tickets: demoTickets.map((ticket) => ({
      id: ticket.name,
      name: ticket.name,
      description: ticket.description,
      priceLabel: formatMajor(ticket.priceMinor, ticket.currency),
      benefits: [...ticket.benefits],
      eligibility: ticket.eligibility,
      remaining: null,
      demo: true,
      recommended: /vip/i.test(ticket.name),
    })),
    sessions: demoSessions.slice(0, 4).map((session) => ({
      id: session.start,
      title: session.title,
      startAt: session.start,
      endAt: session.end,
      room: session.room,
      category: session.category,
      speakers: session.speakers.map((slug) => demoSpeakers.find((speaker) => speaker.slug === slug)?.name ?? "").filter(Boolean).join(", "),
    })),
  };
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HomeIntroFallback />}>
        <HomeIntro />
      </Suspense>
      <ExperiencePillars />
      <Suspense fallback={<p className="shell py-16 text-ink-soft">Loading the programme…</p>}>
        <HomeProgramme />
      </Suspense>
      <ClosingCta />
    </>
  );
}

function HomeIntroFallback() {
  return (
    <section className="relative -mt-[4.75rem] overflow-hidden bg-midnight text-ivory" aria-busy="true">
      <div className="shell relative grid min-h-[100svh] items-end pt-32 pb-14 sm:pt-36 lg:pb-20">
        <div className="max-w-xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">Experience. Connection. Excellence.</p>
          <h1 className="mt-5 font-display text-[2.65rem] font-medium leading-[0.96] sm:text-6xl lg:text-7xl">Where Vision Meets Experience.</h1>
          <p className="mt-6 text-base leading-7 text-ivory/85 sm:text-lg sm:leading-8">{brand.secondaryTagline}</p>
          <p className="mt-6 text-sm text-ivory/70">Loading the gathering…</p>
        </div>
      </div>
    </section>
  );
}

async function loadHome() {
  const [settings, about, spotlight, speakers, sponsors, testimonials] = await Promise.all([
    getSettings(),
    getPage("home-about"),
    getSpotlightEvent(),
    getPublishedSpeakers(),
    getApprovedSponsors(),
    getApprovedTestimonials(),
  ]);

  const event: HomeEvent = spotlight
    ? {
        title: spotlight.title,
        theme: spotlight.shortDescription,
        slug: spotlight.slug,
        startIso: spotlight.startDate.toISOString(),
        endIso: spotlight.endDate.toISOString(),
        timezone: spotlight.timezone,
        venueName: spotlight.venueName || "Venue to be confirmed",
        venueAddress: spotlight.venueAddress || "Street address to be confirmed",
        city: spotlight.city,
        country: spotlight.country,
        travelInfo: spotlight.travelInfo || "Transportation information has not been confirmed.",
        accessibilityInfo: spotlight.accessibilityInfo || "Accessibility information has not been confirmed.",
        isDemonstration: spotlight.isDemonstration,
        registrationOpen: spotlight.registrationOpen && spotlight.status === "PUBLISHED",
        tickets: spotlight.ticketTypes.map((ticket): HomeTicket => ({
          id: ticket.id,
          name: ticket.name,
          description: ticket.description,
          priceLabel: formatMajor(ticket.priceMinor, ticket.currency),
          benefits: ticket.benefits,
          eligibility: /student/i.test(ticket.name) ? "Student eligibility applies. Verification is collected during registration." : "See the ticket description for eligibility.",
          remaining: Math.max(ticket.capacity - ticket.sold - ticket.reserved, 0),
          demo: ticket.isDemonstration || spotlight.isDemonstration,
          recommended: /vip/i.test(ticket.name),
        })),
        sessions: spotlight.sessions.map((session): HomeSession => {
          const publicSession = toPublicSession(session);
          return {
            id: publicSession.id,
            title: publicSession.title,
            startAt: publicSession.startAt,
            endAt: publicSession.endAt,
            room: publicSession.room,
            category: publicSession.category,
            speakers: publicSession.speakers.map((speaker) => speaker.name).join(", "),
          };
        }),
      }
    : fallbackEvent();

  const featuredSpeakers = speakers.slice(0, 4).map((speaker) => {
    const topic = speaker.sessions.map((link) => link.session).find((session) => session.status === "PUBLISHED")?.title;
    return {
      slug: speaker.slug,
      name: speaker.name,
      professionalTitle: speaker.professionalTitle,
      organization: speaker.organization,
      portrait: speaker.portrait,
      isDemonstration: speaker.isDemonstration,
      topic: topic || speaker.expertise[0],
    };
  });

  const jsonLd = spotlight && !spotlight.isDemonstration
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: spotlight.title,
        description: spotlight.shortDescription,
        startDate: spotlight.startDate.toISOString(),
        endDate: spotlight.endDate.toISOString(),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: `${appUrl()}/images/hero.jpg`,
        location: {
          "@type": "Place",
          name: spotlight.venueName,
          address: {
            "@type": "PostalAddress",
            addressLocality: spotlight.city,
            addressCountry: spotlight.country,
          },
        },
        organizer: { "@type": "Organization", name: settings.legalName || brand.legalName, url: appUrl() },
      }
    : null;

  return { about, event, featuredSpeakers, sponsors, testimonials, jsonLd };
}

async function HomeIntro() {
  const { about, event, jsonLd } = await loadHome();
  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      <Hero event={event} />
      <CountdownBand event={event} />
      <AboutExperience body={about?.body} />
    </>
  );
}

async function HomeProgramme() {
  const { event, featuredSpeakers, sponsors, testimonials } = await loadHome();
  return (
    <>
      <SpeakerPreview speakers={featuredSpeakers} />
      <SchedulePreview event={event} />
      <TicketHighlights event={event} />
      <VenueSection event={event} />
      <SponsorSection
        sponsors={sponsors.map((sponsor) => ({
          id: sponsor.id,
          name: sponsor.name,
          logo: sponsor.logo,
          logoAlt: sponsor.logoAlt,
          website: sponsor.website,
          tier: sponsor.tier,
        }))}
      />
      <CommunitySection testimonials={testimonials.map((item) => ({ id: item.id, quote: item.quote, name: item.name, role: item.role }))} />
    </>
  );
}
