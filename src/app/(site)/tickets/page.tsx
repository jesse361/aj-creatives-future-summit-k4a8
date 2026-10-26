import type { Metadata } from "next";
import { TicketCard } from "@/components/ticket-card";
import { DemoNote, EmptyState, PageHero } from "@/components/ui";
import { getTicketCatalogue } from "@/lib/queries";
import { formatMoney } from "@/lib/money";

export const metadata: Metadata = { title: "Tickets", description: "Ticket types and prices published by WHY US." };

export default async function TicketsPage() {
  const detailed = (await getTicketCatalogue()).map((event) => ({ event, tickets: event.ticketTypes }));
  return (
    <>
      <PageHero eyebrow="Access" title="Tickets" description="Prices come from the published ticket catalogue. Demonstration prices are labeled and are not a confirmed offer." />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:px-8">
        {detailed.map(({ event, tickets }) => (
          <section key={event.id}>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">{event.category}</p>
                <h2 className="mt-2 font-display text-4xl text-navy">{event.title}</h2>
              </div>
              {event.isDemonstration ? <DemoNote /> : null}
            </div>
            <ul className="mt-6 grid gap-5 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <TicketCard
                    name={ticket.name}
                    description={ticket.description}
                    priceLabel={ticket.priceMinor === 0 ? "Free" : formatMoney(ticket.priceMinor, ticket.currency)}
                    benefits={ticket.benefits}
                    meta={`${Math.max(ticket.capacity - ticket.sold - ticket.reserved, 0)} available`}
                    href={`/register?event=${event.slug}&ticket=${ticket.id}`}
                    demo={ticket.isDemonstration}
                  />
                </li>
              ))}
              {tickets.length === 0 ? <li className="text-sm text-ink-soft">No active tickets.</li> : null}
            </ul>
          </section>
        ))}
        {detailed.length === 0 ? <EmptyState title="No tickets yet" body="Tickets appear when an upcoming event is published." action={{ href: "/events", label: "Browse events" }} /> : null}
      </div>
    </>
  );
}
