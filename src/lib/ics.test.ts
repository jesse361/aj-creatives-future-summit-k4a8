import { describe, expect, it } from "vitest";
import { buildAgendaIcs, escapeIcs, icsStamp } from "@/lib/ics";

describe("calendar export", () => {
  it("formats an Accra wall time and escapes text", () => {
    expect(icsStamp("2027-10-16T09:15:00.000Z", "Africa/Accra")).toBe("20271016T091500");
    expect(escapeIcs("Hello, room; one")).toBe("Hello\\, room\\; one");
  });

  it("builds an agenda and skips a session that ends before it starts", () => {
    const ics = buildAgendaIcs({
      title: "Ahene Fia, preview",
      timeZone: "Africa/Accra",
      sessions: [
        { id: "bad", title: "Bad", description: "", startAt: "2027-10-16T12:00:00.000Z", endAt: "2027-10-16T11:00:00.000Z", room: "", speakers: [] },
        { id: "good", title: "Opening", description: "A sample, with care", startAt: "2027-10-16T09:15:00.000Z", endAt: "2027-10-16T10:15:00.000Z", room: "Main hall", speakers: [{ name: "Ama" }] },
      ],
    });
    expect(ics).toContain("SUMMARY:Opening");
    expect(ics).toContain("DTSTART;TZID=Africa/Accra:20271016T091500");
    expect(ics).toContain("DTEND;TZID=Africa/Accra:20271016T101500");
    expect(ics).not.toContain("SUMMARY:Bad");
    expect(ics).toContain("A sample\\, with care");
    expect(ics.startsWith("BEGIN:VCALENDAR")).toBe(true);
  });
});
