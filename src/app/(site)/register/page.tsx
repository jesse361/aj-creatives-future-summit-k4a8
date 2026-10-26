import { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationPanel } from "@/components/registration-panel";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for a published Ahene Fia event. Prices are confirmed on the server.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage({ searchParams }: { searchParams: Promise<{ event?: string; ticket?: string }> }) {
  return (
    <>
      <PageHero
        eyebrow="Registration"
        title="Reserve your place"
        description="Choose a ticket, tell us who is attending, and review the server price before anything is saved."
        crumbs={[{ name: "Home", path: "/" }, { name: "Tickets", path: "/tickets" }, { name: "Register", path: "/register" }]}
      />
      <div className="shell max-w-3xl py-12">
        <Suspense fallback={<p className="text-ink-soft">Loading tickets…</p>}>
          <RegisterBody searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function RegisterBody({ searchParams }: { searchParams: Promise<{ event?: string; ticket?: string }> }) {
  const params = await searchParams;
  return <RegistrationPanel eventSlug={params.event ?? ""} ticketId={params.ticket ?? ""} />;
}
