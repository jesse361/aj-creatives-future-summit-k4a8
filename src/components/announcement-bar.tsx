"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const storageKey = "ahene-announcement-dismissed";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  return window.sessionStorage.getItem(storageKey) ?? "";
}

function dismiss(message: string) {
  window.sessionStorage.setItem(storageKey, message);
  listeners.forEach((listener) => listener());
}

export function AnnouncementBar({ message, href }: { message: string; href: string }) {
  const stored = useSyncExternalStore(subscribe, snapshot, () => "");
  if (!message.trim() || stored === message) return null;
  return (
    <div className="bg-gold text-midnight">
      <div className="shell grid grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-1 py-1">
        <Link href={href} className="py-1.5 text-center text-balance text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.12em] underline-offset-4 hover:underline sm:tracking-[0.16em]">
          {message}
        </Link>
        <button type="button" className="grid h-11 w-11 place-items-center justify-self-end" aria-label="Dismiss announcement" onClick={() => dismiss(message)}>
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
