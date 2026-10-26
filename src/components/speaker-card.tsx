import Link from "next/link";
import { Portrait } from "@/components/media-image";
import { DemoNote } from "@/components/ui";

export function SpeakerCard({
  href,
  name,
  title,
  organization,
  topic,
  portrait,
  demonstration = false,
}: {
  href: string;
  name: string;
  title: string;
  organization?: string;
  topic?: string;
  portrait?: string | null;
  demonstration?: boolean;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col border border-line bg-white p-3 transition hover:-translate-y-0.5 hover:border-gold">
      <Portrait name={name} src={portrait} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="aspect-[3/4] bg-midnight text-5xl text-gold" />
      <div className="flex flex-1 flex-col px-2 pt-4 pb-3">
        {demonstration ? <DemoNote>Demonstration profile</DemoNote> : null}
        <h3 className={`font-display text-[1.7rem] leading-tight text-midnight group-hover:text-forest ${demonstration ? "mt-3" : ""}`}>{name}</h3>
        <p className="mt-2 text-sm text-ink">{title}</p>
        {organization ? <p className="text-sm text-ink-soft">{organization}</p> : null}
        {topic ? <p className="mt-3 text-sm leading-6 text-ink-soft">{topic}</p> : null}
      </div>
    </Link>
  );
}
