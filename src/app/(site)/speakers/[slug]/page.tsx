import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Portrait } from "@/components/media-image";
import { Badge, DemoNote } from "@/components/ui";
import { getSpeakerBySlug } from "@/lib/queries";
import { isHttpUrl } from "@/lib/safe-url";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);
  if (!speaker) return { title: "Speaker" };
  return { title: speaker.name, description: speaker.biography.slice(0, 160), alternates: { canonical: `/speakers/${speaker.slug}` } };
}

export default async function SpeakerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);
  if (!speaker) notFound();
  const links = Array.isArray(speaker.socialLinks) ? speaker.socialLinks.flatMap((item) => {
    if (!item || typeof item !== "object" || !("label" in item) || !("url" in item)) return [];
    const url = String(item.url);
    if (!isHttpUrl(url)) return [];
    return [{ label: String(item.label), url }];
  }) : [];
  const events = speaker.events.map((link) => link.event).filter((event) => event.status === "PUBLISHED");
  const sessions = speaker.sessions.map((link) => link.session).filter((session) => session.status === "PUBLISHED");
  return (
    <article className="bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_1.2fr] lg:px-8 lg:py-24">
        <div>
          <Portrait name={speaker.name} src={speaker.portrait} className="aspect-[3/4] bg-navy text-7xl text-gold" />
          {speaker.isDemonstration ? <div className="mt-4"><DemoNote /></div> : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{speaker.professionalTitle}</p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] text-navy sm:text-6xl">{speaker.name}</h1>
          {speaker.organization ? <p className="mt-4 text-lg text-ink-soft">{speaker.organization}</p> : null}
          <div className="gold-rule mt-6" />
          <p className="mt-6 whitespace-pre-line text-lg leading-8 text-ink">{speaker.biography}</p>
          {speaker.expertise.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {speaker.expertise.map((item) => <li key={item}><Badge tone="blue">{item}</Badge></li>)}
            </ul>
          ) : null}
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            {links.map((link) => <li key={link.url}><a className="text-electric underline" href={link.url}>{link.label}</a></li>)}
          </ul>
          <h2 className="mt-12 font-display text-3xl text-navy">Sessions</h2>
          <ul className="mt-4 grid gap-3">
            {sessions.map((session) => (
              <li key={session.id} className="border-b border-line py-3">
                <p className="font-display text-xl text-navy">{session.title}</p>
                <Link className="text-sm text-electric" href={`/events/${session.event.slug}`}>{session.event.title}</Link>
              </li>
            ))}
            {sessions.length === 0 ? <li className="text-ink-soft">No published sessions yet.</li> : null}
          </ul>
          <h2 className="mt-10 font-display text-3xl text-navy">Events</h2>
          <ul className="mt-4 grid gap-2">
            {events.map((event) => <li key={event.id}><Link className="text-electric" href={`/events/${event.slug}`}>{event.title}</Link></li>)}
            {events.length === 0 ? <li className="text-ink-soft">No published events yet.</li> : null}
          </ul>
        </div>
      </div>
    </article>
  );
}
