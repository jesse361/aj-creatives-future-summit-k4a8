"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerAction } from "@/server/actions/public";
import { buttonClass, inputClass, labelClass } from "@/lib/styles";
import { formatMajor } from "@/lib/money";
import type { FormState } from "@/lib/types";

export type TicketOffer = {
  id: string;
  name: string;
  description: string;
  priceMinor: number;
  currency: string;
  benefits: string[];
  remaining: number;
  minimumQuantity: number;
  maximumQuantity: number;
  isDemonstration: boolean;
};

export type EventOffer = {
  id: string;
  title: string;
  slug: string;
  isDemonstration: boolean;
  tickets: TicketOffer[];
};

const schema = z.object({
  eventId: z.string().min(1, "Choose an event."),
  ticketTypeId: z.string().min(1, "Choose a ticket."),
  quantity: z.coerce.number().int().min(1, "Choose at least one ticket."),
  fullName: z.string().trim().min(2, "Enter the attendee name."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(30),
  organization: z.string().trim().max(160),
  dietaryNotes: z.string().trim().max(500),
  accessibilityNotes: z.string().trim().max(500),
  studentVerification: z.string().trim().max(160),
  termsAccepted: z.boolean().refine((value) => value, { message: "Agree to the terms to continue." }),
  privacyAccepted: z.boolean().refine((value) => value, { message: "Acknowledge the privacy notice." }),
  marketingConsent: z.boolean(),
});

type Values = z.infer<typeof schema>;
const initial: FormState = { ok: false, message: "" };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="text-sm text-red-800">{message}</p>;
}

export function RegistrationForm({ events, initialEventId = "", initialTicketId = "", paymentConfigured }: { events: EventOffer[]; initialEventId?: string; initialTicketId?: string; paymentConfigured: boolean }) {
  const [step, setStep] = useState(0);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [state, action, pending] = useActionState(registerAction, initial);
  const stepRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  useEffect(() => {
    if (!pending) lock.current = false;
  }, [pending]);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventId: initialEventId,
      ticketTypeId: initialTicketId,
      quantity: 1,
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      dietaryNotes: "",
      accessibilityNotes: "",
      studentVerification: "",
      termsAccepted: false,
      privacyAccepted: false,
      marketingConsent: false,
    },
  });
  // React Hook Form's watch() is the supported way to follow these fields.
  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch cannot be memoized by the React compiler
  const eventId = form.watch("eventId");
  const ticketTypeId = form.watch("ticketTypeId");
  const quantity = Number(form.watch("quantity") || 1);
  const values = form.watch();
  const event = events.find((item) => item.id === eventId);
  const ticket = event?.tickets.find((item) => item.id === ticketTypeId);
  const studentTicket = /student/i.test(ticket?.name ?? "");
  const max = ticket ? Math.min(ticket.maximumQuantity, Math.max(ticket.remaining, ticket.minimumQuantity)) : 1;
  const review = useMemo(() => {
    if (!ticket) return null;
    return { unit: formatMajor(ticket.priceMinor, ticket.currency), total: formatMajor(ticket.priceMinor * quantity, ticket.currency) };
  }, [ticket, quantity]);

  useEffect(() => {
    stepRef.current?.focus();
  }, [step]);

  const next = async () => {
    const fields = step === 0
      ? (["eventId", "ticketTypeId", "quantity"] as const)
      : (["fullName", "email", "phone", "organization", "dietaryNotes", "accessibilityNotes", "studentVerification", "termsAccepted", "privacyAccepted"] as const);
    const valid = await form.trigger(fields);
    if (studentTicket && step === 1 && form.getValues("studentVerification").trim().length < 3) {
      form.setError("studentVerification", { message: "Enter a school or student identifier." });
      return;
    }
    if (ticket && (quantity < ticket.minimumQuantity || quantity > Math.min(ticket.maximumQuantity, ticket.remaining))) {
      form.setError("quantity", { message: `Choose between ${ticket.minimumQuantity} and ${Math.min(ticket.maximumQuantity, ticket.remaining)}.` });
      return;
    }
    if (valid) setStep((value) => value + 1);
  };

  return (
    <form
      action={(formData) => {
        if (lock.current || pending) return;
        lock.current = true;
        action(formData);
      }}
      onSubmit={(event) => {
        if (step < 2) {
          event.preventDefault();
          void next();
        }
      }}
      className="grid gap-6 border border-line bg-white p-6 sm:p-8"
      noValidate
    >
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="ticketTypeId" value={ticketTypeId} />
      <input type="hidden" name="quantity" value={quantity} />
      <input className="hp-field" tabIndex={-1} autoComplete="off" name="companyWebsite" aria-hidden="true" />
      <ol className="flex flex-wrap gap-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
        {["Ticket", "Details", "Review"].map((label, index) => (
          <li key={label} className={index === step ? "text-forest" : undefined} aria-current={index === step ? "step" : undefined}>
            0{index + 1} {label}
          </li>
        ))}
      </ol>
      {events.length === 0 ? <p className="text-sm text-ink-soft">No tickets are on sale. Nothing can be submitted.</p> : null}

      <div ref={stepRef} tabIndex={-1} className="outline-none">
        {step === 0 ? (
          <div className="grid gap-4">
            <label className={labelClass}>
              Event
              <select className={inputClass} {...form.register("eventId")} onChange={(eventChange) => { form.setValue("eventId", eventChange.target.value); form.setValue("ticketTypeId", ""); }}>
                <option value="">Select an event</option>
                {events.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                    {item.isDemonstration ? " (demonstration)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <FieldError message={form.formState.errors.eventId?.message} />
            <fieldset className="grid gap-3">
              <legend className={labelClass}>Ticket</legend>
              {(event?.tickets ?? []).map((item) => (
                <label key={item.id} className={`grid gap-1 border px-4 py-4 ${ticketTypeId === item.id ? "ticket-rail border-gold" : "border-line bg-white"}`}>
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-medium">
                      <input type="radio" value={item.id} disabled={item.remaining < item.minimumQuantity} {...form.register("ticketTypeId")} />
                      {item.name}
                    </span>
                    <span>{formatMajor(item.priceMinor, item.currency)}</span>
                  </span>
                  <span className="text-sm text-ink-soft">{item.description}</span>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">{item.remaining} remaining{item.isDemonstration ? " · provisional demonstration price" : ""}</span>
                </label>
              ))}
              {event && event.tickets.length === 0 ? <p className="text-sm text-ink-soft">No tickets are on sale for this event.</p> : null}
            </fieldset>
            <FieldError message={form.formState.errors.ticketTypeId?.message} />
            <label className={labelClass}>
              Quantity
              <input className={inputClass} type="number" min={ticket?.minimumQuantity ?? 1} max={Math.max(max, 1)} {...form.register("quantity", { valueAsNumber: true })} />
            </label>
            <FieldError message={form.formState.errors.quantity?.message} />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4">
            <label className={labelClass}>
              Full name
              <input className={inputClass} autoComplete="name" aria-invalid={Boolean(form.formState.errors.fullName)} {...form.register("fullName")} />
            </label>
            <FieldError message={form.formState.errors.fullName?.message} />
            <label className={labelClass}>
              Email
              <input className={inputClass} type="email" autoComplete="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
            </label>
            <FieldError message={form.formState.errors.email?.message} />
            <label className={labelClass}>
              Phone <span className="font-normal text-ink-soft">(optional)</span>
              <input className={inputClass} autoComplete="tel" {...form.register("phone")} />
            </label>
            <label className={labelClass}>
              Organization <span className="font-normal text-ink-soft">(optional)</span>
              <input className={inputClass} {...form.register("organization")} />
            </label>
            {studentTicket ? (
              <label className={labelClass}>
                Student verification
                <input className={inputClass} {...form.register("studentVerification")} />
                <span className="mt-2 block text-sm font-normal text-ink-soft">A school or student identifier. The organizer has not published a final verification method.</span>
              </label>
            ) : null}
            <FieldError message={form.formState.errors.studentVerification?.message} />
            <label className={labelClass}>
              Dietary requirements <span className="font-normal text-ink-soft">(optional)</span>
              <textarea className={`${inputClass} min-h-20`} {...form.register("dietaryNotes")} />
            </label>
            <label className={labelClass}>
              Accessibility requests <span className="font-normal text-ink-soft">(optional)</span>
              <textarea className={`${inputClass} min-h-20`} {...form.register("accessibilityNotes")} />
            </label>
            <label className="flex items-start gap-2 text-sm leading-6">
              <input type="checkbox" className="mt-1" {...form.register("termsAccepted")} />
              <span>I agree to the <a className="underline" href="/terms">terms</a>.</span>
            </label>
            <FieldError message={form.formState.errors.termsAccepted?.message} />
            <label className="flex items-start gap-2 text-sm leading-6">
              <input type="checkbox" className="mt-1" {...form.register("privacyAccepted")} />
              <span>I acknowledge the <a className="underline" href="/privacy">privacy notice</a>.</span>
            </label>
            <FieldError message={form.formState.errors.privacyAccepted?.message} />
            <label className="flex items-start gap-2 text-sm leading-6">
              <input type="checkbox" className="mt-1" {...form.register("marketingConsent")} />
              <span>Send me event news. This is optional and separate from registration.</span>
            </label>
          </div>
        ) : null}

        {step === 2 && event && ticket && review ? (
          <div className="ticket-rail grid gap-2 border border-line p-5 text-sm leading-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-forest">Review before anything is saved</p>
            <p className="font-display text-3xl text-midnight">{event.title}</p>
            <p>{ticket.name} × {quantity}</p>
            <p>Unit price {review.unit}, taken from the catalogue</p>
            <p className="border-t border-dashed border-gold/80 pt-3 font-display text-2xl text-midnight">Total {review.total}</p>
            <p>{values.fullName} · {values.email}</p>
            {values.dietaryNotes ? <p>Dietary notes included</p> : null}
            {values.accessibilityNotes ? <p>Accessibility request included</p> : null}
            {studentTicket ? <p>Student verification: {values.studentVerification}</p> : null}
            {values.marketingConsent ? <p>Marketing consent: yes</p> : <p>Marketing consent: no</p>}
            {ticket.priceMinor > 0 && !paymentConfigured ? (
              <p className="bg-amber-50 px-3 py-3 text-amber-950">Paid checkout is not configured. Submitting will not confirm this ticket, take payment, or save the registration.</p>
            ) : null}
            {ticket.isDemonstration || event.isDemonstration ? <p className="text-ink-soft">This is demonstration inventory, not a confirmed public offer.</p> : null}
            <input type="hidden" name="fullName" value={values.fullName} />
            <input type="hidden" name="email" value={values.email} />
            <input type="hidden" name="phone" value={values.phone} />
            <input type="hidden" name="organization" value={values.organization} />
            <input type="hidden" name="dietaryNotes" value={values.dietaryNotes} />
            <input type="hidden" name="accessibilityNotes" value={values.accessibilityNotes} />
            <input type="hidden" name="studentVerification" value={studentTicket ? values.studentVerification : ""} />
            {values.termsAccepted ? <input type="hidden" name="termsAccepted" value="true" /> : null}
            {values.privacyAccepted ? <input type="hidden" name="privacyAccepted" value="true" /> : null}
            {values.marketingConsent ? <input type="hidden" name="marketingConsent" value="true" /> : null}
          </div>
        ) : null}
      </div>

      {state.message ? <p role="alert" className="bg-red-50 px-3 py-3 text-sm text-red-900">{state.message} You can correct the form and submit again. What you entered is still here.</p> : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" className={buttonClass("ghost")} onClick={() => setStep((value) => value - 1)}>
            Back
          </button>
        ) : null}
        {step < 2 ? (
          <button type="button" className={buttonClass("primary")} onClick={next} disabled={events.length === 0}>
            Continue
          </button>
        ) : (
          <button className={buttonClass("primary")} disabled={pending}>
            {pending ? "Saving…" : ticket && ticket.priceMinor > 0 ? "Continue to payment" : "Confirm registration"}
          </button>
        )}
      </div>
    </form>
  );
}
