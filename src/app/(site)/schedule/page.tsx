import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarDownload } from "@/components/calendar-download";
import { ScheduleBoard } from "@/components/schedule-board";
import { DemoNote, EmptyState, PageHero } from "@/components/ui";
import { buildAgendaIcs } from "@/lib/ics";
import { getUpcomingPublished, toPublicSession } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { formatSummitRange } from "@/lib/time";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Day by day sessions for Ahene Fia gatherings, shown in the event timezone.",
  alternates: { canonical: "/schedule" },
  openGraph: { title: "Schedule · Ahene Fia", description: "Explore the sessions, conversations, and experiences that make the gathering meaningful.", images: ["/images/stage.jpg"] },
};

export default function SchedulePage({ searchParams }: { searchParams: Promise<{ event?: string; day?: string; category?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title="Every Moment, Intentionally Designed."
        description="Explore the sessions, conversations, and experiences that make the gathering meaningful."
        crumbs={[{ name: "Home", path: "/" }, { name: "Schedule", path: "/schedule" }]}
      />
      <Suspense fallback={<p className="shell py-12 text-ink-soft">Loading the agenda…</p>}>
        <Agenda searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Agenda({ searchParams }: { searchParams: Promise<{ event?: string; day?: string; category?: string }> }) {
  const params = await searchParams;
  const events = await getUpcomingPublished(20);
  const selected = events.find((event) => event.slug === params.event) ?? events[0];
  if (!selected) {
    return (
      <div className="shell py-12">
        <EmptyState title="No agenda yet" body="A schedule appears when an upcoming event is published." action={{ href: "/events", label: "Browse events" }} />
      </div>
    );
  }
  const rows = await prisma.session.findMany({
    where: { eventId: selected.id, status: "PUBLISHED" },
    orderBy: [{ startTime: "asc" }, { displayOrder: "asc" }],
    include: { speakers: { include: { speaker: true } } },
  });
  const sessions = rows.map((session) => ({ ...toPublicSession(session), isSample: selected.isDemonstration }));
  const categories = [...new Set(sessions.map((session) => session.category))];
  const visible = params.category ? sessions.filter((session) => session.category === params.category) : sessions;
  const dates = formatSummitRange(selected.startDate.toISOString(), selected.endDate.toISOString(), selected.timezone);
  const ics = buildAgendaIcs({
    title: selected.title,
    timeZone: selected.timezone,
    sessions: sessions.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      startAt: session.startAt,
      endAt: session.endAt,
      room: session.room,
      speakers: session.speakers,
    })),
  });
  return (
    <div className="shell py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {selected.isDemonstration ? <DemoNote>Demonstration agenda</DemoNote> : null}
            <h2 className="font-display text-3xl text-midnight sm:text-4xl">{selected.title}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-soft">{dates}. Times use {selected.timezone}. A session that crosses midnight stays on the clock of that timezone.</p>
        </div>
        <CalendarDownload filename={`${selected.slug}.ics`} ics={ics} />
      </div>
      {events.length > 1 ? (
        <form className="mt-6 flex w-full min-w-0 flex-wrap items-end gap-3" action="/schedule">
          <label className="grid w-full min-w-0 max-w-xl text-sm font-semibold">
            Event
            <select className="mt-2 min-h-11 w-full min-w-0 max-w-full border border-line bg-white px-3" name="event" defaultValue={selected.slug}>
              {events.map((event) => <option key={event.id} value={event.slug}>{event.title}{event.isDemonstration ? " (demonstration)" : ""}</option>)}
            </select>
          </label>
          <button className="mt-7 min-h-11 bg-midnight px-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory">Show</button>
        </form>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Session types">
        <FilterLink event={selected.slug} category="" current={params.category ?? ""} label="All sessions" />
        {categories.map((category) => (
          <FilterLink key={category} event={selected.slug} category={category} current={params.category ?? ""} label={category} />
        ))}
      </div>
      <div className="mt-8">
        <ScheduleBoard
          sessions={visible}
          timeZone={selected.timezone}
          activeDay={params.day}
          eventSlug={selected.slug}
          emptyLabel={params.category ? "No sessions match that filter." : "No published sessions yet."}
        />
      </div>
      <p className="mt-8 text-sm"><Link className="text-forest underline decoration-gold underline-offset-4" href={`/events/${selected.slug}`}>Event details</Link></p>
    </div>
  );
}

function FilterLink({ event, category, current, label }: { event: string; category: string; current: string; label: string }) {
  const params = new URLSearchParams();
  params.set("event", event);
  if (category) params.set("category", category);
  const active = category === current;
  return (
    <Link href={`/schedule?${params.toString()}`} aria-current={active ? "true" : undefined} className={`border px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${active ? "border-midnight bg-midnight text-ivory" : "border-line bg-white text-midnight hover:border-gold"}`}>
      {label}
    </Link>
  );
}
