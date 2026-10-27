/**
 * Enquiry validation, shared by the browser form and the API route so the
 * rules can never drift apart. Kept dependency-free on purpose.
 */
import { services } from "@/data/services";

export const contactMethods = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "either", label: "Either" },
] as const;

export const serviceOptions = [
  ...services.map((s) => ({ id: s.slug, label: s.title })),
  { id: "not-sure", label: "Not sure yet / multiple services" },
];

export type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  subject: string;
  message: string;
  preferredContact: string;
  consent: boolean;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

export const emptyEnquiry: EnquiryValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  subject: "",
  message: "",
  preferredContact: "",
  consent: false,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Normalises unknown input into EnquiryValues (trimmed, length-capped). */
export function normaliseEnquiry(input: Record<string, unknown>): EnquiryValues {
  return {
    name: str(input.name, 100),
    email: str(input.email, 160),
    phone: str(input.phone, 24),
    company: str(input.company, 120),
    service: str(input.service, 60),
    subject: str(input.subject, 150),
    message: str(input.message, 3000),
    preferredContact: str(input.preferredContact, 10),
    consent: input.consent === true,
  };
}

export function validateEnquiry(v: EnquiryValues): EnquiryErrors {
  const e: EnquiryErrors = {};
  if (v.name.length < 2) e.name = "Enter your full name.";
  if (!EMAIL.test(v.email)) e.email = "Enter a valid email address, like name@company.com.";
  if (v.phone && !PHONE.test(v.phone)) e.phone = "Enter a valid phone number, digits only with an optional + prefix.";
  if (!serviceOptions.some((o) => o.id === v.service)) e.service = "Choose the service you're interested in.";
  if (v.subject.length < 3) e.subject = "Add a short subject.";
  if (v.message.length < 20) e.message = "Tell us a little more — at least 20 characters.";
  if (v.preferredContact && !contactMethods.some((m) => m.id === v.preferredContact)) e.preferredContact = "Choose a contact method.";
  if (v.preferredContact === "phone" && !v.phone) e.phone = "Add a phone number so we can call you.";
  if (!v.consent) e.consent = "Please confirm we can use these details to respond.";
  return e;
}
