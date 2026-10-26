export function eventPlace(event: { eventFormat: string; venueName?: string | null; city?: string | null }) {
  if (event.eventFormat === "ONLINE") return "Online";
  const place = [event.venueName, event.city].filter(Boolean).join(", ");
  if (event.eventFormat === "HYBRID") return place ? `${place} and online` : "Hybrid";
  return place || "Location to be confirmed";
}

export function mapsSearchUrl(parts: Array<string | null | undefined>) {
  const query = parts
    .map((part) => part?.trim() ?? "")
    .filter((part) => part && part.toLowerCase() !== "street address to be confirmed" && part.toLowerCase() !== "venue to be confirmed")
    .join(", ");
  if (!query) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function coverSrc(src: string | null | undefined) {
  if (src && (src.startsWith("/") || src.startsWith("https://"))) return src;
  return "/images/hero.jpg";
}
