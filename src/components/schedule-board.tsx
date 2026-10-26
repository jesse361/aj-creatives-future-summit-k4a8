import Link from "next/link";
import type { PublicSession } from "@/lib/types";
import { formatTimeRange } from "@/lib/time";

export function ScheduleBoard({
  sessions,
  timeZone,
  activeDay,
  eventSlug,
  emptyLabel = "The published agenda will appear here.",
}: {
  sessions: PublicSession[];
  timeZone: string;
  activeDay?: string;
  eventSlug?: string;
  emptyLabel?: string;
}) {
  const grouped = new Map<string, PublicSession[]>();
  for (const session of [...sessions].sort((a, b) => a.startAt.localeCompare(b.startAt))) {
    const key = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(session.startAt));
    grouped.set(key, [...(grouped.get(key) ?? []), session]);
  }
  const keys = [...grouped.keys()];
  const selected = activeDay && grouped.has(activeDay) ? activeDay : keys[0];
  const visible = selected ? grouped.get(selected) ?? [] : [];
  if (sessions.length === 0) return <p className="text-sm text-ink-soft">{emptyLabel}</p>;
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Schedule days">
        {keys.map((key, index) => {
          const query = new URLSearchParams();
          if (eventSlug) query.set("event", eventSlug);
          query.set("day", key);
          const label = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone }).format(new Date(`${key}T12:00:00Z`));
          const selectedDay = key === selected;
          return (
            <Link
              key={key}
              href={`?${query.toString()}`}
              role="tab"
              aria-selected={selectedDay}
              className={`shrink-0 border px-4 py-3 text-left text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${selectedDay ? "border-midnight bg-midnight text-ivory" : "border-line bg-white text-midnight hover:border-gold"}`}
            >
              <span className={`block text-[0.62rem] ${selectedDay ? "text-gold" : "text-forest"}`}>Day {index + 1}</span>
              {label}
            </Link>
          );
        })}
      </div>
      <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">Times shown in {timeZone}</p>
      {visible.length === 0 ? <p className="mt-6 text-sm text-ink-soft">{emptyLabel}</p> : null}
      <ol className="mt-6 border-l border-gold/80">
        {visible.map((session) => {
          const quiet = session.isBreak || session.category === "Break" || session.category === "Networking" || session.category === "Arrival";
          const keynote = session.category === "Keynote";
          return (
            <li key={session.id} className={`relative py-5 pl-6 ${keynote ? "bg-ivory" : ""}`}>
              <span className={`absolute top-7 -left-[5px] h-2.5 w-2.5 ${keynote ? "bg-forest" : "bg-gold"}`} aria-hidden />
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-forest">
                {formatTimeRange(session.startAt, session.endAt, timeZone)}
                {session.room ? ` · ${session.room}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl text-midnight sm:text-3xl">{session.title}</h3>
                {keynote ? <span className="bg-gold px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-midnight">Keynote</span> : null}
                {quiet ? <span className="border border-line px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">{session.category}</span> : null}
              </div>
              {keynote || !quiet ? <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{session.category}</p> : null}
              {session.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">{session.description}</p> : null}
              {session.speakers.length ? (
                <p className="mt-2 text-sm">
                  {session.speakers.map((speaker, index) => (
                    <span key={`${speaker.slug}-${speaker.name}`}>
                      {index > 0 ? ", " : ""}
                      {speaker.slug ? <Link className="underline decoration-gold underline-offset-4" href={`/speakers/${speaker.slug}`}>{speaker.name}</Link> : speaker.name}
                      {speaker.role && speaker.role !== "SPEAKER" ? ` (${speaker.role.toLowerCase()})` : ""}
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
