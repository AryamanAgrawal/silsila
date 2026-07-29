import type { APIRoute } from "astro";
import { event, showStart, showEnd, addressLine } from "@/data/event";

const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/** RFC 5545 folds lines at 75 octets; long descriptions must be wrapped. */
const fold = (line: string) => line.match(/.{1,73}/g)?.join("\r\n ") ?? line;

const escape = (s: string) =>
  s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export const GET: APIRoute = () => {
  const summary = `Silsila: ${event.title}`;
  const description = `${event.tagline}. Doors ${event.doors}, curtain ${event.showtime}. Presented by ${event.presentedBy}.`;
  const location = `${event.venue.name}, ${event.venue.room}, ${addressLine}`;

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//silsila//resonance//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:resonance-${event.date}@silsila`,
    `DTSTAMP:${stamp(showStart)}`,
    `DTSTART:${stamp(showStart)}`,
    `DTEND:${stamp(showEnd)}`,
    fold(`SUMMARY:${escape(summary)}`),
    fold(`DESCRIPTION:${escape(description)}`),
    fold(`LOCATION:${escape(location)}`),
    ...(event.tickets.url ? [fold(`URL:${event.tickets.url}`)] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="silsila-resonance.ics"',
    },
  });
};
