export const SESSION_COOKIE = "whyus_admin";
export const TAGS = {
  events: "events",
  speakers: "speakers",
  settings: "settings",
  pages: "pages",
} as const;

export const HOLD_MINUTES_DEFAULT = 30;
export const MAX_UPLOAD_BYTES = 2_000_000;

export const EVENT_CATEGORIES = [
  "Business conference",
  "Technology summit",
  "Professional workshop",
  "Entrepreneurship",
  "Leadership seminar",
  "Networking",
  "Corporate",
  "Education",
  "Creative industry",
  "Private experience",
] as const;

export const SESSION_CATEGORIES = [
  "Keynote",
  "Panel",
  "Workshop",
  "Networking",
  "Break",
  "Arrival",
  "Closing",
] as const;

export const INQUIRY_CATEGORIES = [
  { value: "GENERAL", label: "General enquiries" },
  { value: "SPONSORSHIP", label: "Sponsorship and partnerships" },
  { value: "SPEAKING", label: "Speaker applications" },
  { value: "MEDIA", label: "Media and press" },
  { value: "GROUP", label: "Group registrations" },
  { value: "PLANNING", label: "Event planning" },
] as const;

export const FORMAT_LABELS: Record<string, string> = {
  IN_PERSON: "In person",
  ONLINE: "Online",
  HYBRID: "Hybrid",
};

export const CURRENCIES = ["GHS", "NGN", "USD", "GBP", "EUR", "ZAR", "KES"] as const;

export const BENEFITS = [
  {
    title: "Thought Leadership",
    description: "Stages for people with something precise to say, and time left for the room to answer back.",
  },
  {
    title: "Meaningful Networking",
    description: "Introductions with a purpose. The schedule leaves space for conversations that are not rushed between sessions.",
  },
  {
    title: "Practical Innovation",
    description: "Workshops and forums aimed at what participants can try next, from product decisions to the shape of a company.",
  },
  {
    title: "Extraordinary Experiences",
    description: "A setting, a pace, and a standard of care that make the gathering feel considered before anyone arrives.",
  },
] as const;
