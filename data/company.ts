/**
 * Editable company copy. All text is a draft: replace with verified wording.
 * Do not add dates, headcounts, certifications or awards until confirmed.
 */

export const about = {
  intro:
    "Shakoor Integrated Solutions Private Limited brings security systems, business technology, software and IT support together under one team, so businesses can plan, install and maintain the technology they rely on with a single partner.",
  overview: [
    "Many businesses buy cameras from one supplier, a POS from another and call someone else when the network fails. We aim to simplify that by looking at the whole environment and recommending solutions that work together.",
    "Our work covers the full cycle: understanding requirements, assessing the site, designing a practical solution, installing it properly and supporting it afterwards.",
  ],
  // TODO(company): replace with the approved mission and vision statements.
  mission:
    "To help businesses operate more safely and efficiently through practical, well-installed technology and responsive support.",
  vision:
    "To be a trusted technology partner for businesses that want security, operations and IT handled with care and accountability.",
  values: [
    { title: "Honest advice", text: "We recommend what a site needs, not the most expensive option." },
    { title: "Careful workmanship", text: "Neat installations, tested before handover." },
    { title: "Clear communication", text: "Plain explanations, agreed scope and no surprises." },
    { title: "Long-term thinking", text: "Solutions planned to be maintained and extended." },
  ],
  approach: [
    { title: "One team, several disciplines", text: "Security, business systems, software and IT handled together, so the pieces fit." },
    { title: "Requirements first", text: "Every recommendation starts with how your site and team work." },
    { title: "Support after installation", text: "Follow-up support and maintenance options agreed with each client." },
  ],
};

export const whyChooseUs = [
  { icon: "layers", title: "Tailored solutions", text: "Systems planned around your site, workflow and budget." },
  { icon: "shield", title: "Security-focused installation", text: "Equipment placed and configured with protection in mind." },
  { icon: "network", title: "Integrated services", text: "Security, business technology, software and IT from one team." },
  { icon: "lifebuoy", title: "Professional support", text: "Technical help after handover, as agreed with each client." },
  { icon: "trending", title: "Scalable by design", text: "Start with what you need now and extend later." },
  { icon: "wrench", title: "Maintenance options", text: "Preventive checks and servicing plans available on request." },
] as const;

export const processSteps = [
  { title: "Consultation", text: "Understand your business requirements and goals." },
  { title: "Assessment", text: "Review the environment, existing systems and project needs." },
  { title: "Solution design", text: "Propose a suitable approach, equipment and scope." },
  { title: "Implementation", text: "Carry out the agreed installation or development work." },
  { title: "Testing and handover", text: "Verify the delivered solution and train your team." },
  { title: "Ongoing support", text: "Provide follow-up support where agreed." },
];

/** Shown under the hero in place of statistics until verified figures exist. */
export const capabilityStrip = [
  { icon: "cctv", label: "Security systems", text: "CCTV, access and door control" },
  { icon: "pos", label: "Business technology", text: "Attendance and POS" },
  { icon: "software", label: "Software & web", text: "Custom tools and websites" },
  { icon: "support", label: "IT support", text: "Networks, devices and backups" },
] as const;
