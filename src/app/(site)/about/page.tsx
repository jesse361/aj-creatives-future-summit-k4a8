import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { getPage } from "@/lib/settings";

export const metadata: Metadata = { title: "About", description: "The mission, audience, and vision of WHY US." };

export default async function AboutPage() {
  const page = await getPage("about");
  return (
    <>
      <PageHero eyebrow="WHY US" title={page?.title || "Where ideas meet"} description="A platform for conferences, summits, workshops, and the people who make them worth attending." />
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
        <div className="relative min-h-80 lg:col-span-5 lg:min-h-[36rem]">
          <Image src="/images/stage.jpg" alt="Illustrative photograph of a conference stage. Not a confirmed WHY US event." fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
        <article className="whitespace-pre-line text-lg leading-8 text-ink-soft lg:col-span-7">
          {page?.body || "The organizer has not published the about page yet."}
        </article>
      </div>
    </>
  );
}
