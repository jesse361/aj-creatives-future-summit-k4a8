import Link from "next/link";
import { appUrl } from "@/lib/app-url";
import { buttonClass } from "@/lib/styles";

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: {
  href: string;
  variant?: "primary" | "secondary" | "light" | "ghost" | "gold";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}

export function Badge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "blue" | "line" | "light" }) {
  const tones = {
    gold: "border border-gold/60 bg-gold text-midnight",
    blue: "border border-forest/30 text-forest",
    line: "border border-line bg-ivory text-ink-soft",
    light: "border border-white/30 text-ivory",
  };
  return <span className={`inline-flex px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${tones[tone]}`}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.18em] ${light ? "text-gold" : "text-forest"}`}>{eyebrow}</p>
      <div className="gold-rule mt-4" />
      <h2 className={`mt-5 font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl ${light ? "text-ivory" : "text-midnight"}`}>{title}</h2>
      {description ? <p className={`mt-4 text-base leading-7 ${light ? "text-ivory/75" : "text-ink-soft"}`}>{description}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  description: string;
  crumbs?: { name: string; path: string }[];
}) {
  const data = crumbs
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${appUrl()}${crumb.path}`,
        })),
      }
    : null;
  return (
    <section className="relative overflow-hidden bg-midnight text-ivory">
      <div className="motif-diagonal absolute inset-0 opacity-30" aria-hidden />
      <div className="shell relative py-16 sm:py-20 lg:py-24">
        {data ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} /> : null}
        {crumbs ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap gap-x-2 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ivory/70">
              {crumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden>/</span> : null}
                  {index === crumbs.length - 1 ? <span aria-current="page" className="text-gold">{crumb.name}</span> : <Link className="hover:text-ivory" href={crumb.path}>{crumb.name}</Link>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <div className="gold-rule mt-5" />
        <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/75">{description}</p>
      </div>
    </section>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: { href: string; label: string } }) {
  return (
    <div className="border border-dashed border-line bg-white px-6 py-14 text-center">
      <h2 className="font-display text-3xl text-midnight">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink-soft">{body}</p>
      {action ? (
        <div className="mt-6">
          <ButtonLink href={action.href}>{action.label}</ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

export function DemoNote({ children = "Demonstration" }: { children?: React.ReactNode }) {
  return <Badge tone="line">{children}</Badge>;
}

export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details key={item.id} className="group border border-line bg-white px-5 py-4">
          <summary className="cursor-pointer list-none font-medium text-midnight [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-4">
              {item.question}
              <span aria-hidden className="text-gold group-open:rotate-45">+</span>
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
