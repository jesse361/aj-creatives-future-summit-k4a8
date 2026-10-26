"use client";

import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactAction } from "@/server/actions/public";
import { INQUIRY_CATEGORIES } from "@/lib/constants";
import { contactSchema } from "@/lib/validation";
import { buttonClass, inputClass, labelClass } from "@/lib/styles";
import type { FormState } from "@/lib/types";
import type { z } from "zod";

const initial: FormState = { ok: false, message: "" };
type Values = z.input<typeof contactSchema>;

export function ContactForm({ defaultCategory = "GENERAL" }: { defaultCategory?: string }) {
  const [state, action, pending] = useActionState(contactAction, initial);
  const [transitionPending, startTransition] = useTransition();
  const allowed = INQUIRY_CATEGORIES.some((item) => item.value === defaultCategory) ? defaultCategory : "GENERAL";
  const form = useForm<Values>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", category: allowed as Values["category"], subject: "", message: "", privacyAccepted: false },
  });

  const busy = pending || transitionPending;
  const submit = form.handleSubmit((values) => {
    if (busy || state.ok) return;
    const data = new FormData();
    data.set("name", values.name);
    data.set("email", values.email);
    data.set("category", values.category);
    data.set("subject", values.subject);
    data.set("message", values.message);
    if (values.privacyAccepted) data.set("privacyAccepted", "true");
    startTransition(() => action(data));
  });

  const errorFor = (name: keyof Values) => form.formState.errors[name]?.message || state.fieldErrors?.[name];

  return (
    <form onSubmit={submit} className="grid gap-4 border border-line bg-white p-6 sm:p-8" noValidate>
      <input className="hp-field" tabIndex={-1} autoComplete="off" name="companyWebsite" aria-hidden="true" />
      <label className={labelClass}>
        Full name
        <input className={inputClass} autoComplete="name" aria-invalid={Boolean(errorFor("name"))} {...form.register("name")} />
      </label>
      {errorFor("name") ? <p className="text-sm text-red-800">{errorFor("name")}</p> : null}
      <label className={labelClass}>
        Email
        <input className={inputClass} type="email" autoComplete="email" aria-invalid={Boolean(errorFor("email"))} {...form.register("email")} />
      </label>
      {errorFor("email") ? <p className="text-sm text-red-800">{errorFor("email")}</p> : null}
      <label className={labelClass}>
        Enquiry
        <select className={inputClass} {...form.register("category")}>
          {INQUIRY_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Subject
        <input className={inputClass} aria-invalid={Boolean(errorFor("subject"))} {...form.register("subject")} />
      </label>
      {errorFor("subject") ? <p className="text-sm text-red-800">{errorFor("subject")}</p> : null}
      <label className={labelClass}>
        Message
        <textarea className={`${inputClass} min-h-36`} aria-invalid={Boolean(errorFor("message"))} {...form.register("message")} />
      </label>
      {errorFor("message") ? <p className="text-sm text-red-800">{errorFor("message")}</p> : null}
      <label className="flex items-start gap-2 text-sm leading-6">
        <input type="checkbox" className="mt-1" {...form.register("privacyAccepted")} />
        <span>I acknowledge the <a className="underline" href="/privacy">privacy notice</a>.</span>
      </label>
      {errorFor("privacyAccepted") ? <p className="text-sm text-red-800">{errorFor("privacyAccepted")}</p> : null}
      {state.message ? (
        <p role="status" className={`px-3 py-3 text-sm ${state.ok ? "bg-emerald-50 text-emerald-950" : "bg-red-50 text-red-900"}`}>
          {state.message}
        </p>
      ) : null}
      <button className={buttonClass("primary")} disabled={busy || state.ok}>
        {busy ? "Sending…" : state.ok ? "Message saved" : "Send message"}
      </button>
    </form>
  );
}
