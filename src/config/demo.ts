import { brand, pillars } from "@/config/brand";

/**
 * Demonstration content for Ahene Fia.
 * These records are samples for the public site and the database seed.
 * They are not confirmed speakers, sponsors, prices, or venue arrangements.
 * Africa/Accra is UTC+0 throughout the year, so the ISO timestamps below are Accra wall time.
 */

export const demoEvent = {
  title: "Ahene Fia Leadership & Innovation Summit 2027",
  slug: "ahene-fia-leadership-innovation-summit-2027",
  theme: "Leadership, Innovation & The Future of African Enterprise",
  shortDescription: "Leadership, Innovation & The Future of African Enterprise",
  fullDescription: `This is demonstration content for the Ahene Fia Leadership & Innovation Summit 2027. The date, venue, speakers, rooms, and prices are placeholders for the organizer to replace. It is not a confirmed gathering.

The theme preview is Leadership, Innovation & The Future of African Enterprise. Session rooms are sample labels so the agenda can be read. They are not confirmed facilities at the Accra International Conference Centre.

Ticket prices are provisional demonstration values in Ghanaian cedis. They are not an offer until the organizer publishes a confirmed catalogue.`,
  category: "Leadership seminar",
  coverImage: "/images/hero.jpg",
  coverAlt: "Illustrative photograph of a conference audience. Not a confirmed Ahene Fia event.",
  startDate: "2027-10-16T08:30:00.000Z",
  endDate: "2027-10-17T14:45:00.000Z",
  timezone: "Africa/Accra",
  venueName: "Accra International Conference Centre",
  venueAddress: "Street address to be confirmed",
  city: "Accra",
  country: "Ghana",
  eventFormat: "IN_PERSON" as const,
  travelInfo:
    "Transportation has not been confirmed. The Accra International Conference Centre is a public venue in Accra. Visitors should plan their own route. This note is not a shuttle, airline, or hotel partnership.",
  accessibilityInfo:
    "Accessibility provisions have not been confirmed with the venue. Use the registration form to tell the organizer what you need. A request is not a guarantee of a specific accommodation.",
  faqs: [
    {
      question: "Is this a confirmed event?",
      answer: "No. This summit is demonstration content so the website can be previewed. Speakers, prices, and the agenda are samples.",
    },
  ],
};

export const demoSpeakers = [
  {
    name: "Ama Serwaa Boateng",
    slug: "ama-serwaa-boateng",
    professionalTitle: "Demonstration programme chair",
    organization: "Demonstration Leadership Circle",
    biography:
      "Fictional demonstration profile. Ama is not a confirmed guest of Ahene Fia. This biography exists so the directory, filters, and session links can be previewed before a real lineup is published.",
    portrait: "/speakers/ama.svg",
    portraitAlt: "Demonstration portrait placeholder for Ama Serwaa Boateng. Not a photograph of a real person.",
    expertise: ["Leadership"],
    session: "Opening keynote: Where vision meets experience",
  },
  {
    name: "Kwesi Annan-Darko",
    slug: "kwesi-annan-darko",
    professionalTitle: "Demonstration product director",
    organization: "Demonstration Technology Studio",
    biography:
      "Fictional demonstration profile. Kwesi is not a confirmed guest. The profile shows how a technology speaker, organization, and session topic appear in the directory.",
    portrait: "/speakers/kwesi.svg",
    portraitAlt: "Demonstration portrait placeholder for Kwesi Annan-Darko. Not a photograph of a real person.",
    expertise: ["Technology"],
    session: "Building products that travel",
  },
  {
    name: "Nia Okoye",
    slug: "nia-okoye",
    professionalTitle: "Demonstration founder",
    organization: "Demonstration Venture Atelier",
    biography:
      "Fictional demonstration profile. Nia is not a confirmed guest. Use this card to preview entrepreneurship sessions and the student-to-founder range of the programme.",
    portrait: "/speakers/nia.svg",
    portraitAlt: "Demonstration portrait placeholder for Nia Okoye. Not a photograph of a real person.",
    expertise: ["Entrepreneurship", "Business"],
    session: "Capital, craft, and the next company",
  },
  {
    name: "Idris Mensah",
    slug: "idris-mensah",
    professionalTitle: "Demonstration creative director",
    organization: "Demonstration Cultural Studio",
    biography:
      "Fictional demonstration profile. Idris is not a confirmed guest. The profile stands in for a creative practitioner until the organizer publishes real speakers.",
    portrait: "/speakers/idris.svg",
    portraitAlt: "Demonstration portrait placeholder for Idris Mensah. Not a photograph of a real person.",
    expertise: ["Creativity"],
    session: "Design, culture, and the room",
  },
] as const;

export const demoTickets = [
  {
    name: "General Admission",
    description:
      "Provisional demonstration price. Open to general registrants. Benefits are proposals until the organizer confirms what will actually be delivered.",
    priceMinor: 35000,
    currency: "GHS",
    capacity: 240,
    minimumQuantity: 1,
    maximumQuantity: 4,
    benefits: ["Access to scheduled conference sessions", "General networking access", "Event materials where provided"],
    eligibility: "Open registration. No extra eligibility check in this demonstration.",
  },
  {
    name: "VIP Experience",
    description:
      "Provisional demonstration price. Includes the general admission proposals plus VIP items only where the event can actually deliver them.",
    priceMinor: 75000,
    currency: "GHS",
    capacity: 40,
    minimumQuantity: 1,
    maximumQuantity: 4,
    benefits: [
      "General Admission benefits",
      "Priority check-in when operationally supported",
      "Access to a designated VIP networking experience",
    ],
    eligibility: "Open registration. Priority check-in depends on on-site operations and is not guaranteed by this preview.",
  },
  {
    name: "Student Pass",
    description:
      "Provisional demonstration price for eligible students. Verification is collected with the registration and has not been confirmed as a formal policy.",
    priceMinor: 15000,
    currency: "GHS",
    capacity: 80,
    minimumQuantity: 1,
    maximumQuantity: 1,
    benefits: ["Discounted admission for eligible students", "Access to scheduled conference sessions", "General networking access"],
    eligibility: "Students only. Enter a school or student identifier at registration. The organizer has not published a final verification method.",
  },
] as const;

export const demoSessions = [
  { title: "Arrival", description: "Demonstration arrival block. Doors and registration timing are not confirmed.", start: "2027-10-16T08:30:00.000Z", end: "2027-10-16T09:15:00.000Z", room: "Foyer (sample)", category: "Arrival", speakers: [] as string[] },
  { title: "Opening keynote: Where vision meets experience", description: "Sample keynote for the demonstration programme.", start: "2027-10-16T09:15:00.000Z", end: "2027-10-16T10:15:00.000Z", room: "Main hall (sample)", category: "Keynote", speakers: ["ama-serwaa-boateng"] },
  { title: "Break", description: "Sample pause. Catering has not been confirmed.", start: "2027-10-16T10:15:00.000Z", end: "2027-10-16T10:45:00.000Z", room: "Foyer (sample)", category: "Break", speakers: [] },
  { title: "Building products that travel", description: "Sample technology conversation about products built for more than one market.", start: "2027-10-16T10:45:00.000Z", end: "2027-10-16T11:45:00.000Z", room: "Main hall (sample)", category: "Panel", speakers: ["kwesi-annan-darko"] },
  { title: "Midday networking", description: "Sample networking block. No hosted introductions are confirmed.", start: "2027-10-16T11:45:00.000Z", end: "2027-10-16T13:00:00.000Z", room: "Atrium (sample)", category: "Networking", speakers: [] },
  { title: "Capital, craft, and the next company", description: "Sample entrepreneurship workshop.", start: "2027-10-16T13:00:00.000Z", end: "2027-10-16T14:15:00.000Z", room: "Studio (sample)", category: "Workshop", speakers: ["nia-okoye"] },
  { title: "Design, culture, and the room", description: "Sample creativity session.", start: "2027-10-16T14:30:00.000Z", end: "2027-10-16T15:30:00.000Z", room: "Main hall (sample)", category: "Panel", speakers: ["idris-mensah"] },
  { title: "Close of day one", description: "Sample closing conversation.", start: "2027-10-16T15:30:00.000Z", end: "2027-10-16T16:15:00.000Z", room: "Main hall (sample)", category: "Closing", speakers: ["ama-serwaa-boateng"] },
  { title: "Day two arrival", description: "Sample arrival block for the second day.", start: "2027-10-17T09:00:00.000Z", end: "2027-10-17T09:30:00.000Z", room: "Foyer (sample)", category: "Arrival", speakers: [] },
  { title: "Leadership studio", description: "Sample leadership workshop.", start: "2027-10-17T09:30:00.000Z", end: "2027-10-17T10:30:00.000Z", room: "Studio (sample)", category: "Workshop", speakers: ["ama-serwaa-boateng"] },
  { title: "Break", description: "Sample pause.", start: "2027-10-17T10:30:00.000Z", end: "2027-10-17T11:00:00.000Z", room: "Foyer (sample)", category: "Break", speakers: [] },
  { title: "Practical innovation forum", description: "Sample forum on applying ideas after the room empties.", start: "2027-10-17T11:00:00.000Z", end: "2027-10-17T12:15:00.000Z", room: "Main hall (sample)", category: "Panel", speakers: ["kwesi-annan-darko", "nia-okoye"] },
  { title: "Open networking", description: "Sample networking block.", start: "2027-10-17T12:15:00.000Z", end: "2027-10-17T13:15:00.000Z", room: "Atrium (sample)", category: "Networking", speakers: [] },
  { title: "The future of African enterprise", description: "Sample closing keynote for the demonstration programme.", start: "2027-10-17T13:15:00.000Z", end: "2027-10-17T14:15:00.000Z", room: "Main hall (sample)", category: "Keynote", speakers: ["idris-mensah"] },
  { title: "Close", description: "Sample close of the summit.", start: "2027-10-17T14:15:00.000Z", end: "2027-10-17T14:45:00.000Z", room: "Main hall (sample)", category: "Closing", speakers: ["ama-serwaa-boateng"] },
] as const;

export const demoSponsors = [
  { name: "Demonstration partner", logo: "/sponsors/demo-wide.svg", logoAlt: "Placeholder mark labeled demonstration partner. Not a confirmed sponsor.", tier: "Demonstration", displayOrder: 1 },
  { name: "Demonstration collaborator", logo: "/sponsors/demo-square.svg", logoAlt: "Placeholder mark labeled demonstration collaborator. Not a confirmed partner.", tier: "Demonstration", displayOrder: 2 },
  { name: "Demonstration cultural ally", logo: "/sponsors/demo-mid.svg", logoAlt: "Placeholder mark labeled demonstration cultural ally. Not a confirmed partner.", tier: "Demonstration", displayOrder: 3 },
  { name: "Demonstration institutional seat", logo: "/sponsors/demo-tall.svg", logoAlt: "Placeholder mark labeled demonstration institutional seat. Not a confirmed partner.", tier: "Demonstration", displayOrder: 4 },
] as const;

export const brandSettings = {
  id: "site",
  brandName: brand.name,
  legalName: brand.legalName,
  tagline: brand.tagline,
  secondaryTagline: brand.secondaryTagline,
  defaultCurrency: "GHS",
  announcementEnabled: true,
  announcement: brand.announcement,
  footerContent: brand.footer,
  seoTitle: brand.seoTitle,
  seoDescription: brand.seoDescription,
  registrationHoldMinutes: 30,
};

export const demoPages = [
  {
    key: "home-about",
    title: "More Than an Event. A Meeting of Possibilities.",
    body: "Ahene Fia brings leaders, innovators, entrepreneurs, creatives, and professionals into the same room to exchange ideas, start working relationships, and look at what they might build next.\n\nThe public site is managed from the admin dashboard. This introduction is editable. It is not a claim about past attendance or a company history.",
  },
  {
    key: "about",
    title: "A gathering built with care",
    body: "Ahene Fia is an events and conference house for professional conferences, corporate gatherings, technology summits, business forums, leadership workshops, cultural meetings, and private institutional events.\n\nThe work is to make a room where ambitious people can find one another. Programmes, speakers, and prices stay labeled as demonstration content until the organizer replaces them with confirmed information.\n\nContact details, partners, and a confirmed lineup stay empty until someone with access to the dashboard publishes them. This page does not claim a founding year, a number of past events, or an audience size.",
  },
  {
    key: "benefits",
    title: "The Ahene Fia experience",
    body: JSON.stringify(pillars),
  },
  {
    key: "privacy",
    title: "Privacy notice",
    body: "This notice is a template for the organizer to edit and, where needed, have reviewed. It is not legal advice.\n\nAhene Fia collects the details you submit on a registration, contact, or newsletter form: name, email, optional phone and organization, ticket choice, optional dietary and accessibility notes, student verification when you request a student ticket, and the message you send. Marketing email is stored only if you opt in. Payment card numbers are handled by the payment provider and are not stored on this site.\n\nRegistration records are visible to signed-in administrators and to the person who has the registration reference. The public site does not list attendees.\n\nNewsletter subscription requires separate consent. You can unsubscribe from the link on the site, which records the withdrawal of consent.\n\nInquiries are kept so the organizer can reply. They can be marked reviewed or closed in the dashboard.\n\nThe site uses a signed-in session cookie for administrators. It is httpOnly and is not used to advertise to visitors.\n\nAsk the organizer if you want a copy of your record or want it corrected. Do not send passwords or card details by email.",
  },
  {
    key: "terms",
    title: "Terms of use",
    body: "These terms are a starting template. They are not legal advice, and they are not a confirmed refund policy.\n\nThe public pages describe events that an administrator has published. Demonstration content is labeled and is not a confirmed offer. Ticket prices, capacities, and sale windows are the values stored for that ticket at the time you register. A later price change does not rewrite a saved registration. The browser does not set the price.\n\nA free registration is confirmed when it is saved and inventory is available. A paid registration is confirmed only after the payment provider verifies the charge. Opening the return page is not itself proof of payment. If paid checkout is not configured, a paid registration is refused and nothing is saved.\n\nPending paid registrations hold inventory for a limited time, then the hold is released. Cancelled, failed, and expired registrations are not tickets.\n\nNo refund or cancellation promise is published with the demonstration catalogue. Do not assume a ticket is refundable. The organizer should replace this section before taking live payment.\n\nYou agree not to misuse the forms, attempt to access another person's registration, or interfere with the site.\n\nThe organizer can cancel or archive an event. A cancelled event does not accept new registrations.",
  },
] as const;

export const demoFaqs = [
  ["How do I register?", "Choose a published ticket and submit the attendee details. Free tickets are confirmed when places remain and the database accepts the registration. Paid tickets are confirmed only after payment is verified. If paid checkout is not configured, the paid registration is not saved.", "Tickets", 1],
  ["Are the sample events real?", "Entries marked Demonstration are sample content so the platform can be previewed. They are not confirmed Ahene Fia events, speakers, sponsors, or prices.", "Events", 2],
  ["Where are attendees listed?", "They are not listed publicly. Administrators can see registrations after signing in.", "Privacy", 3],
  ["How do I unsubscribe?", "Use the unsubscribe page, or the link sent with a message when email delivery is configured.", "Newsletter", 4],
  ["What is the refund policy?", "A refund policy has not been confirmed. Do not treat demonstration tickets as refundable. Paid checkout stays unavailable until a payment provider is configured and the organizer publishes terms.", "Tickets", 5],
  ["Who can use the student pass?", "The demonstration student pass asks for a school or student identifier. That check is a preview of the form, not a published verification policy.", "Tickets", 6],
] as const;
