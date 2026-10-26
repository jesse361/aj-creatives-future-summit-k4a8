import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/ui";
import { INQUIRY_CATEGORIES } from "@/lib/constants";
import { demoEvent } from "@/config/demo";
import { mapsSearchUrl } from "@/lib/format";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ahene Fia about attendance, speaking, sponsorship, media, groups, or event planning.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact · Ahene Fia", description: "Whether you are attending, speaking, sponsoring, or collaborating, we would love to hear from you.", images: ["/images/conversation.jpg"] },
};

export default function ContactPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s Create Something Worth Gathering For."
        description="Whether you are attending, speaking, sponsoring, or collaborating, we would love to hear from you."
        crumbs={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]}
      />
      <Suspense fallback={<p className="shell py-14 text-ink-soft">Loading the desk…</p>}>
        <ContactBody searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ContactBody({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const settings = await getSettings();
  const category = INQUIRY_CATEGORIES.some((item) => item.value === params.category) ? params.category : "GENERAL";
  const maps = mapsSearchUrl([demoEvent.venueName, demoEvent.city, demoEvent.country]);
  return (
      <div className="shell grid gap-10 py-14 lg:grid-cols-[1.1fr_0.8fr] lg:py-20">
        <ContactForm defaultCategory={category} />
        <aside className="grid h-fit gap-5 bg-midnight p-6 text-sm leading-6 text-ivory">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold">Published details</p>
          <h2 className="font-display text-3xl">The desk</h2>
          <p>{settings.contactEmail || "Email is not published yet. Messages from the form are saved for the organizer."}</p>
          <p>{settings.contactPhone || "Phone is not published yet."}</p>
          <p className="whitespace-pre-line text-ivory/75">{settings.address || "A business address is not published yet."}</p>
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold">Demonstration venue</p>
            <p className="mt-2">{demoEvent.venueName}</p>
            <p>{demoEvent.venueAddress}</p>
            <p>{demoEvent.city}, {demoEvent.country}</p>
            {maps ? <a className="mt-2 inline-block text-gold underline" href={maps}>Directions</a> : null}
          </div>
          <ul className="grid gap-2">
            {settings.socialLinks.length ? settings.socialLinks.map((link) => <li key={link.url}><a className="text-gold" href={link.url}>{link.label}</a></li>) : <li>Social profiles are not published yet.</li>}
          </ul>
          <Link className="text-gold" href="/faq">Read the questions</Link>
        </aside>
      </div>
  );
}
