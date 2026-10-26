import type { Metadata } from "next";
import { Suspense } from "react";
import { SpeakerCard } from "@/components/speaker-card";
import { EmptyState, PageHero } from "@/components/ui";
import { speakerFilters } from "@/config/brand";
import { getPublishedSpeakers } from "@/lib/queries";
import { inputClass } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Speakers",
  description: "Meet the demonstration and published voices on the Ahene Fia programme. Sample profiles are labeled and are not confirmed guests.",
  alternates: { canonical: "/speakers" },
  openGraph: { title: "Speakers · Ahene Fia", description: "Discover the thinkers, builders, leaders, and creative minds bringing fresh perspectives to the table.", images: ["/images/conversation.jpg"] },
};

export default function SpeakersPage({ searchParams }: { searchParams: Promise<{ q?: string; expertise?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="People"
        title="Meet the Voices Shaping What Comes Next."
        description="Discover the thinkers, builders, leaders, and creative minds bringing fresh perspectives to the table."
        crumbs={[{ name: "Home", path: "/" }, { name: "Speakers", path: "/speakers" }]}
      />
      <Suspense fallback={<p className="shell py-12 text-ink-soft">Loading speakers…</p>}>
        <SpeakerResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

function filterHref(expertise: string, q: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (expertise) params.set("expertise", expertise);
  const query = params.toString();
  return query ? `/speakers?${query}` : "/speakers";
}

async function SpeakerResults({ searchParams }: { searchParams: Promise<{ q?: string; expertise?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const expertise = params.expertise ?? "";
  const speakers = await getPublishedSpeakers();
  const extra = [...new Set(speakers.flatMap((speaker) => speaker.expertise))].filter((tag) => !speakerFilters.includes(tag as (typeof speakerFilters)[number])).sort();
  const filters = ["", ...speakerFilters, ...extra];
  const filtered = speakers.filter((speaker) => {
    const topics = speaker.sessions.map((link) => link.session.title).join(" ");
    const haystack = `${speaker.name} ${speaker.professionalTitle} ${speaker.organization} ${speaker.biography} ${speaker.expertise.join(" ")} ${topics}`.toLowerCase();
    if (q && !haystack.includes(q)) return false;
    if (expertise && !speaker.expertise.some((item) => item.toLowerCase() === expertise.toLowerCase()) && !haystack.includes(expertise.toLowerCase())) return false;
    return true;
  });
  const anyDemo = speakers.some((speaker) => speaker.isDemonstration);
  return (
    <div id="directory" className="shell py-12 lg:py-16">
      {anyDemo ? <p className="mb-6 max-w-3xl text-sm leading-6 text-ink-soft">Profiles marked Demonstration are fictional samples for this preview. They are not confirmed guests.</p> : null}
      <form className="grid gap-3 border border-line bg-white p-4 sm:grid-cols-[1fr_auto]" action="/speakers">
        {expertise ? <input type="hidden" name="expertise" value={expertise} /> : null}
        <label className="text-sm font-semibold text-ink">
          Search by name, organization, or topic
          <input className={inputClass} name="q" defaultValue={params.q ?? ""} />
        </label>
        <button className="mt-0 min-h-11 bg-midnight px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ivory sm:mt-7">Search</button>
      </form>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Speaker categories">
        {filters.map((filter) => {
          const active = filter === expertise || (!filter && !expertise);
          const label = filter || "All Speakers";
          return (
            <a key={label} href={filterHref(filter, q)} aria-current={active ? "true" : undefined} className={`shrink-0 border px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${active ? "border-midnight bg-midnight text-ivory" : "border-line bg-white text-midnight hover:border-gold"}`}>
              {label}
            </a>
          );
        })}
      </div>
      {filtered.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((speaker) => {
            const topic = speaker.sessions.map((link) => link.session).find((session) => session.status === "PUBLISHED")?.title || speaker.expertise.join(" · ");
            return (
              <SpeakerCard
                key={speaker.id}
                href={`/speakers/${speaker.slug}`}
                name={speaker.name}
                title={speaker.professionalTitle}
                organization={speaker.organization}
                topic={topic}
                portrait={speaker.portrait}
                demonstration={speaker.isDemonstration}
              />
            );
          })}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState title="No speakers match" body="Try another name, organization, or topic. Clear the filters to see every published profile." action={{ href: "/speakers", label: "Clear filters" }} />
        </div>
      )}
    </div>
  );
}
