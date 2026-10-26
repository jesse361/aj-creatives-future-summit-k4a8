"use client";

export function CalendarDownload({ filename, ics, label = "Add agenda to calendar" }: { filename: string; ics: string; label?: string }) {
  if (!ics) return null;
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center border border-midnight px-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-midnight hover:border-gold hover:text-forest"
      onClick={() => {
        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }}
    >
      {label}
    </button>
  );
}
