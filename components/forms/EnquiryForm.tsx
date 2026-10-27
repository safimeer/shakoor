"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import {
  contactMethods,
  emptyEnquiry,
  serviceOptions,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from "@/lib/enquiry";
import { buttonClass } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({ defaultService = "", subjectHint = "" }: { defaultService?: string; subjectHint?: string }) {
  const uid = useId();
  const [values, setValues] = useState<EnquiryValues>({
    ...emptyEnquiry,
    service: serviceOptions.some((o) => o.id === defaultService) ? defaultService : "",
    subject: subjectHint,
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef<number | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const id = (name: string) => `${uid}-${name}`;

  const set = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Time-on-form spam check: measured from when the form appears, so autofill users aren't blocked.
  useEffect(() => {
    if (status === "idle" && startedAt.current === null) startedAt.current = Date.now();
  }, [status]);

  // Move focus to the error summary so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (status === "error") statusRef.current?.focus();
  }, [status, message]);

  const focusFirstError = (errs: EnquiryErrors) => {
    const first = Object.keys(errs)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return; // guard against double submission

    const errs = validateEnquiry({ ...values, name: values.name.trim(), email: values.email.trim(), subject: values.subject.trim(), message: values.message.trim() });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot.current?.value ?? "",
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; errors?: EnquiryErrors };
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        focusFirstError(data.errors);
      }
      setStatus("error");
      setMessage(data.message ?? "Something went wrong and your enquiry was not sent. Please try again.");
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server, so your enquiry was not sent. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] border border-success/40 bg-white p-8 text-center">
        <CircleCheck aria-hidden="true" className="mx-auto size-12 text-[#16a34a]" />
        <h3 className="t-h3 mt-4 text-ink">Enquiry sent</h3>
        <p className="mx-auto mt-2 max-w-md leading-relaxed text-slate-ink">
          Thank you, {values.name.split(" ")[0]}. Your enquiry has been delivered to our team and we&apos;ll reply
          {values.preferredContact === "phone" ? " by phone" : " by email"}.
        </p>
        <button
          type="button"
          className={buttonClass("outline-light", "mt-6")}
          onClick={() => {
            setValues({ ...emptyEnquiry, service: values.service });
            startedAt.current = null;
            setStatus("idle");
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={id("required-note")}
      className="rounded-[var(--radius-card)] border border-line-light bg-white p-6 sm:p-8"
    >
      <p id={id("required-note")} className="mb-6 text-sm text-slate-ink">
        Fields marked <span className="font-semibold text-ink">*</span> are required.
      </p>

      {status === "error" && message ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-danger-ink/25 bg-[#fef3f2] p-4 text-sm text-danger-ink"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>{message}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Full name" required error={errors.name}>
          <input id={id("name")} name="name" required autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} {...aria(id("name"), errors.name)} className={inputClass(errors.name)} />
        </Field>
        <Field id={id("email")} label="Business email" required error={errors.email}>
          <input id={id("email")} name="email" required type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => set("email", e.target.value)} {...aria(id("email"), errors.email)} className={inputClass(errors.email)} />
        </Field>
        <Field id={id("phone")} label="Phone number" error={errors.phone}>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} {...aria(id("phone"), errors.phone)} className={inputClass(errors.phone)} />
        </Field>
        <Field id={id("company")} label="Company name" error={errors.company}>
          <input id={id("company")} name="company" autoComplete="organization" value={values.company} onChange={(e) => set("company", e.target.value)} className={inputClass()} />
        </Field>
        <Field id={id("service")} label="Service required" required error={errors.service}>
          <select id={id("service")} name="service" required value={values.service} onChange={(e) => set("service", e.target.value)} {...aria(id("service"), errors.service)} className={inputClass(errors.service)}>
            <option value="">Select a service</option>
            {serviceOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("subject")} label="Subject" required error={errors.subject}>
          <input id={id("subject")} name="subject" required value={values.subject} onChange={(e) => set("subject", e.target.value)} {...aria(id("subject"), errors.subject)} className={inputClass(errors.subject)} />
        </Field>
        <div className="sm:col-span-2">
          <Field id={id("message")} label="Message or project requirements" required error={errors.message} hint="Site type, size, number of doors or cameras, timelines — anything that helps.">
            <textarea id={id("message")} name="message" required rows={6} value={values.message} onChange={(e) => set("message", e.target.value)} {...aria(id("message"), errors.message, true)} className={inputClass(errors.message, "min-h-36 py-3")} />
          </Field>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-semibold text-ink">Preferred contact method</legend>
          <div className="flex flex-wrap gap-2">
            {contactMethods.map((m) => (
              <label key={m.id} className="relative cursor-pointer">
                <input type="radio" name="preferredContact" value={m.id} checked={values.preferredContact === m.id} onChange={() => set("preferredContact", m.id)} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-xl border border-line-light px-4 text-sm font-medium text-slate-ink peer-checked:border-blue peer-checked:bg-blue/5 peer-checked:text-blue peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cyan">
                  {m.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-ink">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? id("consent-error") : undefined}
              className="mt-0.5 size-5 shrink-0 accent-blue"
            />
            <span>
              I agree that
              <span className="font-semibold text-ink">Shakoor Integrated Solutions</span> may use these details to
              respond to my enquiry, as described in the{" "}
              <Link href="/privacy" className="font-semibold text-blue underline underline-offset-2">
                privacy policy
              </Link>
              . <span className="font-semibold text-ink">*</span>
            </span>
          </label>
          {errors.consent ? (
            <p id={id("consent-error")} className="mt-2 text-sm font-medium text-danger-ink">
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button type="submit" disabled={submitting} className={buttonClass("primary", "mt-8 w-full sm:w-auto")}>
        {submitting ? (
          <>
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Sending enquiry…
          </>
        ) : (
          <>
            Send enquiry
            <Send aria-hidden="true" className="size-4" />
          </>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {submitting ? "Sending your enquiry" : ""}
      </span>
    </form>
  );
}

function aria(fieldId: string, error?: string, hasHint = false) {
  const ids = [hasHint ? `${fieldId}-hint` : "", error ? `${fieldId}-error` : ""].filter(Boolean).join(" ");
  return { "aria-invalid": Boolean(error), "aria-describedby": ids || undefined };
}

function inputClass(error?: string, extra = "") {
  return `block w-full min-h-12 rounded-xl border bg-white px-4 text-[1rem] text-ink placeholder:text-slate-ink/60 transition-colors focus:border-blue focus:outline-none focus:ring-3 focus:ring-blue/20 ${
    error ? "border-danger-ink" : "border-line-light hover:border-slate-ink/40"
  } ${extra}`;
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-slate-ink">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
