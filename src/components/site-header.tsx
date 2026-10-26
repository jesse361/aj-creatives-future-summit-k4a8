"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { buttonClass } from "@/lib/styles";

const links = [
  { href: "/", label: "Home" },
  { href: "/speakers", label: "Speakers" },
  { href: "/schedule", label: "Schedule" },
  { href: "/tickets", label: "Tickets" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ brand }: { brand: string }) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const open = menuPath === pathname;
  const home = pathname === "/";
  const solid = !home || scrolled || open;
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef(false);
  const close = useCallback(() => {
    returnFocus.current = true;
    setMenuPath(null);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setMenuPath(null);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const menuButton = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const inerted = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== panelRef.current);
    for (const node of inerted) node.inert = true;
    const panel = panelRef.current;
    const closeButton = panel?.querySelector<HTMLElement>("[data-menu-close]");
    closeButton?.focus();
    const items = panel ? [...panel.querySelectorAll<HTMLElement>("a, button")] : [];
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab" || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      for (const node of inerted) node.inert = false;
      document.removeEventListener("keydown", onKey);
      if (returnFocus.current) {
        returnFocus.current = false;
        menuButton?.focus();
      }
    };
  }, [open, close]);

  const current = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const menu = open ? (
    <div
      ref={panelRef}
      id={menuId}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-midnight text-ivory lg:hidden"
    >
      <div className="shell flex min-h-[4.75rem] shrink-0 items-center justify-between gap-3 pt-[env(safe-area-inset-top)]">
        <BrandLogo name={brand} compact onNavigate={close} />
        <button
          type="button"
          data-menu-close
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20"
          onClick={close}
        >
          <span className="sr-only">Close menu</span>
          <X size={20} aria-hidden />
        </button>
      </div>
      <nav className="shell flex flex-1 flex-col py-4" aria-label="Mobile">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            aria-current={current(link.href) ? "page" : undefined}
            className={`flex min-h-14 items-center border-b border-white/10 text-[0.95rem] font-semibold uppercase tracking-[0.16em] ${current(link.href) ? "text-gold" : "text-ivory"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="shell pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Link href="/tickets" onClick={close} className={`${buttonClass("gold")} w-full`}>
          Get Tickets
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <header className={`sticky top-0 z-40 text-ivory transition-colors ${solid ? "border-b border-white/10 bg-midnight/95 backdrop-blur" : "bg-transparent"}`}>
      <div className="shell flex h-[4.75rem] items-center justify-between gap-3">
        <BrandLogo name={brand} compact />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current(link.href) ? "page" : undefined}
              className={`text-[0.72rem] font-semibold uppercase tracking-[0.16em] underline-offset-8 ${current(link.href) ? "text-gold underline" : "text-ivory/80 hover:text-ivory"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/tickets" className={`${buttonClass("gold")} !px-3 sm:!px-5`}>
            <span className="sm:hidden">Tickets</span>
            <span className="hidden sm:inline">Get Tickets</span>
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>
      {open && typeof document !== "undefined" ? createPortal(menu, document.body) : null}
    </header>
  );
}
