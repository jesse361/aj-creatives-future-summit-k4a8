import { hashPassword } from "../src/lib/password";
import { prisma } from "../src/lib/db";
import { brandSettings, demoEvent, demoFaqs, demoPages, demoSessions, demoSpeakers, demoSponsors, demoTickets } from "../src/config/demo";

const blocked = new Set(["change-this-password", "summit-admin-demo", "password", "admin", "whyus", "whyus-admin", "ahenefia"]);

async function main() {
  const current = await prisma.siteSettings.findUnique({ where: { id: "site" } });
  if (!current) {
    await prisma.siteSettings.create({ data: brandSettings });
  } else if (current.brandName === "WHY US") {
    await prisma.siteSettings.update({ where: { id: "site" }, data: brandSettings });
  }

  for (const page of demoPages) {
    const existing = await prisma.pageContent.findUnique({ where: { key: page.key } });
    if (!existing) {
      await prisma.pageContent.create({ data: page });
    } else if (existing.body.includes("WHY US") || existing.title.includes("WHY US")) {
      await prisma.pageContent.update({ where: { key: page.key }, data: { title: page.title, body: page.body } });
    }
  }

  for (const [question, answer, category, displayOrder] of demoFaqs) {
    const existing = await prisma.faq.findFirst({ where: { question } });
    if (!existing) {
      await prisma.faq.create({ data: { question, answer, category, displayOrder, published: true } });
    } else if (existing.answer.includes("WHY US")) {
      await prisma.faq.update({ where: { id: existing.id }, data: { answer } });
    }
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const existingAdmin = await prisma.adminUser.count();
  if (existingAdmin === 0 && email && password.length >= 12 && !blocked.has(password)) {
    await prisma.adminUser.create({
      data: { name: process.env.ADMIN_NAME?.trim() || "Owner", email, passwordHash: await hashPassword(password), role: "OWNER", status: "ACTIVE" },
    });
    console.log(`Created owner ${email}`);
  } else if (existingAdmin === 0) {
    console.log("No administrator was created. Set ADMIN_EMAIL and a unique ADMIN_PASSWORD of at least 12 characters, then run npm run db:seed again.");
  }

  const speakerIds = new Map<string, string>();
  for (const speaker of demoSpeakers) {
    const row = await prisma.speaker.upsert({
      where: { slug: speaker.slug },
      update: {},
      create: {
        name: speaker.name,
        slug: speaker.slug,
        professionalTitle: speaker.professionalTitle,
        organization: speaker.organization,
        biography: speaker.biography,
        portrait: speaker.portrait,
        portraitAlt: speaker.portraitAlt,
        expertise: [...speaker.expertise],
        status: "PUBLISHED",
        isDemonstration: true,
        featured: true,
        socialLinks: [],
      },
    });
    speakerIds.set(speaker.slug, row.id);
  }

  const existingSummit = await prisma.event.findUnique({ where: { slug: demoEvent.slug } });
  if (!existingSummit) {
    const summit = await prisma.event.create({
      data: {
        title: demoEvent.title,
        slug: demoEvent.slug,
        shortDescription: demoEvent.shortDescription,
        fullDescription: demoEvent.fullDescription,
        category: demoEvent.category,
        coverImage: demoEvent.coverImage,
        coverAlt: demoEvent.coverAlt,
        startDate: new Date(demoEvent.startDate),
        endDate: new Date(demoEvent.endDate),
        timezone: demoEvent.timezone,
        venueName: demoEvent.venueName,
        venueAddress: demoEvent.venueAddress,
        city: demoEvent.city,
        country: demoEvent.country,
        eventFormat: demoEvent.eventFormat,
        travelInfo: demoEvent.travelInfo,
        accessibilityInfo: demoEvent.accessibilityInfo,
        status: "PUBLISHED",
        isDemonstration: true,
        registrationOpen: true,
        publishedAt: new Date(),
        faqs: demoEvent.faqs,
        speakers: { create: demoSpeakers.map((speaker) => ({ speakerId: speakerIds.get(speaker.slug)! })) },
        ticketTypes: {
          create: demoTickets.map((ticket) => ({
            name: ticket.name,
            description: ticket.description,
            priceMinor: ticket.priceMinor,
            currency: ticket.currency,
            capacity: ticket.capacity,
            benefits: [...ticket.benefits],
            minimumQuantity: ticket.minimumQuantity,
            maximumQuantity: ticket.maximumQuantity,
            status: "ACTIVE" as const,
            isDemonstration: true,
          })),
        },
        sessions: {
          create: demoSessions.map((session, index) => ({
            title: session.title,
            description: session.description,
            startTime: new Date(session.start),
            endTime: new Date(session.end),
            room: session.room,
            category: session.category,
            displayOrder: index + 1,
            status: "PUBLISHED" as const,
            ...(session.speakers.length
              ? { speakers: { create: session.speakers.map((slug) => ({ speakerId: speakerIds.get(slug) ?? "" })) } }
              : {}),
          })),
        },
      },
    });
    console.log(`Seeded demonstration summit ${summit.slug}. It is labeled and is not a confirmed programme.`);
  }

  for (const sponsor of demoSponsors) {
    const existing = await prisma.sponsor.findFirst({ where: { name: sponsor.name } });
    if (existing) continue;
    await prisma.sponsor.create({
      data: {
        name: sponsor.name,
        logo: sponsor.logo,
        logoAlt: sponsor.logoAlt,
        tier: sponsor.tier,
        displayOrder: sponsor.displayOrder,
        status: "APPROVED",
        website: "",
      },
    });
  }

  await prisma.speaker.updateMany({
    where: { isDemonstration: true, slug: { notIn: demoSpeakers.map((speaker) => speaker.slug) } },
    data: { status: "DRAFT", featured: false },
  });

  const oldDemos = await prisma.event.findMany({
    where: { isDemonstration: true, slug: { not: demoEvent.slug }, status: "PUBLISHED" },
    include: { _count: { select: { registrations: true } } },
  });
  for (const event of oldDemos) {
    if (event._count.registrations === 0 && (event.slug.startsWith("demonstration-") || event.title.startsWith("Demonstration"))) {
      await prisma.event.update({ where: { id: event.id }, data: { status: "ARCHIVED" } });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
