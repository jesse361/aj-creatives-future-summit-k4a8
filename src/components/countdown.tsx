"use client";

import { useEffect, useState } from "react";
import { getCountdownState } from "@/lib/countdown";

const units = ["Days", "Hours", "Minutes", "Seconds"] as const;

function Frame({ values, summary }: { values: string[]; summary: string }) {
  return (
    <div>
      <p className="sr-only">{summary}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-hidden="true">
        {units.map((label, index) => (
          <div key={label} className="min-h-[5.25rem] border border-white/15 bg-midnight/50 px-1 py-3 text-center sm:min-h-[6rem]">
            <div className="tabular font-display text-3xl leading-none text-gold sm:text-4xl">{values[index]}</div>
            <div className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ivory/70">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Countdown({ startAt, endAt, timeZone }: { startAt: string; endAt: string; timeZone?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const kick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(kick);
      window.clearInterval(timer);
    };
  }, []);

  const zone = timeZone ? ` Times use ${timeZone}.` : "";
  if (now == null) {
    return <Frame values={["—", "—", "—", "—"]} summary={`Countdown loading.${zone}`} />;
  }
  const state = getCountdownState(now, startAt, endAt);
  if (state.phase === "upcoming") {
    const values = [state.days, state.hours, state.minutes, state.seconds].map((value) => String(Math.max(0, value)).padStart(2, "0"));
    return <Frame values={values} summary={`The event starts in ${state.days} days, ${state.hours} hours, and ${state.minutes} minutes.${zone}`} />;
  }
  if (state.phase === "live") return <p className="text-lg text-gold">The gathering has begun.</p>;
  if (state.phase === "ended") return <p className="text-ivory/80">This gathering has ended.</p>;
  if (state.phase === "invalid") return <p className="text-ivory/80">The event date could not be read.</p>;
  return <p className="text-ivory/80">The event date will appear when it is published.</p>;
}
