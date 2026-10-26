import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationPanel } from "@/components/registration-panel";
import { TicketCard } from "@/components/ticket-card";
import { DemoNote, EmptyState, FaqList, PageHero } from "@/components/ui";
import { demoEvent } from "@/config/demo";
import { formatMajor } from "@/lib/money";
import { getPublishedFaqs, getTicketCatalogue } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Tickets",
  description: "General Admission, VIP Experience, and Student Pass options for Ahene Fia. Demonstration prices are provisional and shown in Ghanaian cedis.",
  alternates: { canonical: "/tickets" },
  openGraph: { title: "Tickets · Ahene Fia", description: "Choose the experience that matches your ambitions.", images: ["/images/hero.jpg"] },
};

const policy = [
  {
    id: "refunds",
    question: "Is there a refund or cancellation policy?",
    answer: "No refund policy has been confirmed. Do not assume a ticket is refundable or transferable. Paid checkout is refused until a payment provider is configured. An administrator can cancel a saved registration from the dashboard. Replace this note before taking live payment.",
  },
  {
    id: "payment",
    question: "When is a registration confirmed?",
    answer: "A free ticket is confirmed only after the server saves it and inventory is available. A paid ticket is confirmed only after the payment provider verifies the charge. Submitting this form is not a purchase, and a browser return is not proof of payment. Card numbers are never stored on this site.",
  },
  {
    id: "prices",
    question: "Are the displayed prices final?",
    answer: "Prices marked as provisional are demonstration values in Ghanaian cedis. The server uses the price stored for that ticket. A price typed in the browser is ignored.",
  },
];

export default function TicketsPage({ searchParams }: { searchParams: Promise<{ event?: string; ticket?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="Access"
        title="Find Your Place in the Room."
        description="Choose the experience that matches your ambitions. Prices come from the published catalogue."
        crumbs={[{ name: "Home", path: "/" }, { name: "Tickets", path: "/tickets" }]}
      />
      <Suspense fallback={<p className="shell py-14 text-ink-soft">Loading tickets…</p>}>
        <TicketCatalogue searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function TicketCatalogue({ searchParams }: { searchParams: Promise<{ event?: string; ticket?: string }> }) {
  const params = await searchParams;
  const [catalogue, faqs] = await Promise.all([getTicketCatalogue(), getPublishedFaqs()]);
  const publishedFaqs = faqs.filter((faq) => faq.category === "Tickets").map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }));
  const spotlight = catalogue.find((event) => event.slug === params.event)
    ?? catalogue.find((event) => event.slug === demoEvent.slug)
    ?? catalogue.find((event) => !event.isDemonstration)
    ?? catalogue[0];
  const comparison = spotlight?.ticketTypes ?? [];
  return (
      <div className="shell grid min-w-0 gap-16 py-14 *:min-w-0 *:max-w-full lg:py-20">
        {catalogue.map((event) => (
          <section key={event.id}>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-forest">{event.category}</p>
                <h2 className="mt-2 font-display text-4xl text-midnight">{event.title}</h2>
              </div>
              {event.isDemonstration ? <DemoNote>Demonstration prices</DemoNote> : null}
            </div>
            <ul className="mt-6 grid gap-5 lg:grid-cols-3">
              {event.ticketTypes.map((ticket) => {
                const remaining = Math.max(ticket.capacity - ticket.sold - ticket.reserved, 0);
                return (
                  <li key={ticket.id}>
                    <TicketCard
                      name={ticket.name}
                      description={ticket.description}
                      priceLabel={formatMajor(ticket.priceMinor, ticket.currency)}
                      benefits={ticket.benefits}
                      eligibility={/student/i.test(ticket.name) ? "Eligible students. A school or student identifier is required on the form." : "See the description for who this ticket is for."}
                      meta={`${remaining} places remaining · ${ticket.currency}`}
                      href={remaining >= ticket.minimumQuantity && event.registrationOpen ? `/tickets?event=${event.slug}&ticket=${ticket.id}#register` : undefined}
                      demo={ticket.isDemonstration || event.isDemonstration}
                      recommended={/vip/i.test(ticket.name)}
                      actionLabel="Select"
                    />
                  </li>
                );
              })}
            </ul>
            {event.ticketTypes.length === 0 ? <p className="mt-4 text-sm text-ink-soft">No active tickets.</p> : null}
          </section>
        ))}
        {catalogue.length === 0 ? <EmptyState title="No tickets yet" body="Tickets appear when an upcoming event is published." action={{ href: "/events", label: "Browse events" }} /> : null}

        {comparison.length ? (
          <section>
            <h2 className="font-display text-4xl text-midnight">Compare {spotlight?.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">The same details as the cards, set side by side. Availability is the current published inventory, not a scarcity claim.</p>
            <div className="mt-6 w-full min-w-0 max-w-full overflow-x-auto">
              <table className="w-full min-w-[40rem] border border-line bg-white text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="p-4 font-semibold"> </th>
                    {comparison.map((ticket) => (
                      <th key={ticket.id} className="p-4 font-display text-2xl font-medium text-midnight">{ticket.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line align-top">
                    <th className="p-4 font-semibold">Price</th>
                    {comparison.map((ticket) => <td key={ticket.id} className="p-4">{formatMajor(ticket.priceMinor, ticket.currency)} {ticket.currency}</td>)}
                  </tr>
                  <tr className="border-b border-line align-top">
                    <th className="p-4 font-semibold">Benefits</th>
                    {comparison.map((ticket) => (
                      <td key={ticket.id} className="p-4">
                        <ul className="grid gap-1">{ticket.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-line align-top">
                    <th className="p-4 font-semibold">Eligibility</th>
                    {comparison.map((ticket) => <td key={ticket.id} className="p-4">{ticket.description}</td>)}
                  </tr>
                  <tr className="align-top">
                    <th className="p-4 font-semibold">Available</th>
                    {comparison.map((ticket) => <td key={ticket.id} className="p-4">{Math.max(ticket.capacity - ticket.sold - ticket.reserved, 0)}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="font-display text-4xl text-midnight">Questions before you register</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <FaqList items={policy} />
            <div>
              {publishedFaqs.length ? <FaqList items={publishedFaqs} /> : <p className="text-sm leading-6 text-ink-soft">Published ticket questions will appear here after an administrator adds them. The notes beside this column are not a legal policy.</p>}
              <p className="mt-4 text-sm"><Link className="text-forest underline" href="/faq">All questions</Link></p>
            </div>
          </div>
        </section>

        <section id="register">
          <h2 className="font-display text-4xl text-midnight">Register</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            Free registrations are saved in the application database when PostgreSQL is available. Paid registrations are saved as pending and confirmed only after Paystack verifies payment. If Paystack is not configured, a paid submission is refused and nothing is stored. This form does not take card details.
          </p>
          <div className="mt-8 max-w-3xl">
            <Suspense fallback={<p className="text-ink-soft">Loading the registration form…</p>}>
              <RegistrationPanel eventSlug={params.event ?? spotlight?.slug ?? ""} ticketId={params.ticket ?? ""} />
            </Suspense>
          </div>
        </section>
      </div>
  );
}
