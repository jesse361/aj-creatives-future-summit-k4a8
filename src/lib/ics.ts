import { safeTimeZone } from "@/lib/time";

type AgendaSession = {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  room: string;
  speakers: { name: string }[];
};

function pad(value: string) {
  return value.padStart(2, "0");
}

export function icsStamp(iso: string, timeZone: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: safeTimeZone(timeZone),
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const pick = (type: string) => {
    const value = parts.find((item) => item.type === type)?.value ?? "00";
    return value === "24" ? "00" : pad(value);
  };
  return `${pick("year")}${pick("month")}${pick("day")}T${pick("hour")}${pick("minute")}${pick("second")}`;
}

export function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function utcStamp(iso: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "19700101T000000Z";
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function buildAgendaIcs(input: { title: string; timeZone: string; sessions: AgendaSession[] }) {
  const zone = safeTimeZone(input.timeZone);
  const anchor = input.sessions.find((session) => Number.isFinite(new Date(session.startAt).getTime()));
  const stamped = utcStamp(anchor?.startAt ?? "1970-01-01T00:00:00.000Z");
  const blocks = input.sessions.flatMap((session) => {
    const start = icsStamp(session.startAt, zone);
    const end = icsStamp(session.endAt, zone);
    if (!start || !end || end <= start) return [];
    const people = session.speakers.map((speaker) => speaker.name).join(", ");
    const description = [session.description, people ? `With ${people}` : "", session.room ? `Room: ${session.room}` : ""]
      .filter(Boolean)
      .join("\n");
    const lines = [
      "BEGIN:VEVENT",
      `UID:${escapeIcs(session.id)}@ahene-fia`,
      `DTSTAMP:${stamped}`,
      `DTSTART;TZID=${zone}:${start}`,
      `DTEND;TZID=${zone}:${end}`,
      `SUMMARY:${escapeIcs(session.title)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
    ];
    if (session.room) lines.push(`LOCATION:${escapeIcs(session.room)}`);
    lines.push("END:VEVENT");
    return lines;
  });
  if (blocks.length === 0) return "";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ahene Fia//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(input.title)}`,
    `X-WR-TIMEZONE:${zone}`,
    ...blocks,
    "END:VCALENDAR",
  ].join("\r\n");
}
