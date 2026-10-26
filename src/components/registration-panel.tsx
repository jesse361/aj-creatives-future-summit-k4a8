import { connection } from "next/server";
import { RegistrationForm, type EventOffer } from "@/components/registration-form";
import { paystackConfigured } from "@/lib/paystack";
import { prisma } from "@/lib/db";

export async function RegistrationPanel({ eventSlug = "", ticketId = "" }: { eventSlug?: string; ticketId?: string }) {
  await connection();
  const now = new Date();
  const events = await prisma.event.findMany({
    where: { status: "PUBLISHED", registrationOpen: true, endDate: { gte: now } },
    orderBy: { startDate: "asc" },
    include: { ticketTypes: { where: { status: "ACTIVE" }, orderBy: { priceMinor: "asc" } } },
  });
  const offers: EventOffer[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    isDemonstration: event.isDemonstration,
    tickets: event.ticketTypes.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      description: ticket.description,
      priceMinor: ticket.priceMinor,
      currency: ticket.currency,
      benefits: ticket.benefits,
      remaining: Math.max(ticket.capacity - ticket.sold - ticket.reserved, 0),
      minimumQuantity: ticket.minimumQuantity,
      maximumQuantity: ticket.maximumQuantity,
      isDemonstration: ticket.isDemonstration,
    })),
  }));
  const initialEvent = offers.find((event) => event.slug === eventSlug);
  return (
    <RegistrationForm
      events={offers}
      initialEventId={initialEvent?.id ?? offers[0]?.id ?? ""}
      initialTicketId={ticketId}
      paymentConfigured={paystackConfigured()}
    />
  );
}
