import Link from "next/link";
import { cacheLife } from "next/cache";
import { Emblem } from "@/components/brand-logo";
import type { PublicSettings } from "@/lib/settings";

async function copyrightYear() {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 86400, expire: 604800 });
  return new Date().getFullYear();
}

export async function SiteFooter({ settings }: { settings: PublicSettings }) {
  const year = await copyrightYear();
  return (
    <footer className="relative bg-midnight text-ivory">
      <div className="motif pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="shell relative grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <Emblem className="h-10 w-10" />
            <p className="font-display text-3xl">{settings.brandName}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-ivory/75">{settings.footerContent}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold">Explore</p>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/85">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/speakers">Speakers</Link></li>
            <li><Link href="/schedule">Schedule</Link></li>
            <li><Link href="/tickets">Tickets</Link></li>
            <li><Link href="/events">All events</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold">The gathering</p>
          <ul className="mt-4 grid gap-2 text-sm text-ivory/85">
            <li><Link href="/register">Register</Link></li>
            <li><Link href="/faq">Questions</Link></li>
            <li><Link href="/contact?category=SPONSORSHIP">Sponsorship enquiry</Link></li>
            <li><Link href="/contact?category=SPEAKING">Speaker applications</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold">Contact</p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-ivory/85">
            {settings.contactEmail ? <li><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></li> : <li>Email not published yet</li>}
            {settings.contactPhone ? <li>{settings.contactPhone}</li> : <li>Phone not published yet</li>}
            {settings.address ? <li className="whitespace-pre-line">{settings.address}</li> : <li>Address not published yet</li>}
            {settings.socialLinks.length ? settings.socialLinks.map((link) => (
              <li key={link.url}><a href={link.url}>{link.label}</a></li>
            )) : <li>Social profiles will appear when they are published.</li>}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-stone">
          <p>© {year} {settings.legalName}</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
