"use client";

import { useSearchParams } from "next/navigation";
import { getService } from "@/data/services";
import { EnquiryForm } from "./EnquiryForm";

/** Reads ?service=<slug> so "Get a quote" links arrive with the service preselected. */
export function ContactEnquiry() {
  const slug = useSearchParams().get("service") ?? "";
  const service = getService(slug);
  return <EnquiryForm key={slug} defaultService={service?.slug} subjectHint={service ? `${service.title} quote` : ""} />;
}
