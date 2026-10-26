import { Suspense } from "react";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/config/brand";
import { appUrl } from "@/lib/app-url";
import { getSpotlightEvent } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <Suspense fallback={<div className="h-[4.75rem] bg-midnight" />}>
        <SiteFrame />
      </Suspense>
      <main id="content" className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <FooterFrame />
      </Suspense>
    </>
  );
}

async function SiteFrame() {
  const [settings, spotlight] = await Promise.all([getSettings(), getSpotlightEvent()]);
  const message = settings.announcementEnabled ? settings.announcement : "";
  const href = spotlight ? `/events/${spotlight.slug}` : "/tickets";
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.legalName || brand.legalName,
    url: appUrl(),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings.contactPhone ? { telephone: settings.contactPhone } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      {message ? <AnnouncementBar message={message} href={href} /> : null}
      <SiteHeader brand={settings.brandName || brand.name} />
    </>
  );
}

async function FooterFrame() {
  const settings = await getSettings();
  return <SiteFooter settings={settings} />;
}
