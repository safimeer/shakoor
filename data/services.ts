/**
 * Central service definitions. Cards, the carousel, the Services menu, detail pages,
 * related-service links, the enquiry form and the sitemap are all generated from this file.
 *
 * Content is a draft. Phrases such as "where required" or "can include" are deliberate:
 * confirm every capability and integration with the company before removing them.
 */

export type ServiceCategory = "security" | "business" | "software" | "support";

export type ServiceIconKey =
  | "cctv"
  | "access"
  | "attendance"
  | "door"
  | "pos"
  | "software"
  | "website"
  | "support";

export type Service = {
  slug: string;
  title: string;
  category: ServiceCategory;
  icon: ServiceIconKey;
  shortDescription: string;
  /** Hero line on the detail page. */
  headline: string;
  overview: string[];
  problems: string[];
  features: { title: string; text: string }[];
  benefits: { title: string; text: string }[];
  useCases: string[];
  process: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  relatedServices: string[];
  /** Paths under /public. Files may not exist yet — see IMAGES.md. */
  cardImage: string;
  heroImage: string;
  imageAlt: string;
  /** CSS object-position keeping the subject in frame when the image is cropped. */
  cardPosition?: string;
  /** Optional zoom (e.g. 1.5) toward cardPosition, for cards that share a source photo. */
  cardZoom?: number;
  heroPosition?: string;
};

export const serviceCategories: { id: ServiceCategory | "all"; label: string }[] = [
  { id: "all", label: "All services" },
  { id: "security", label: "Security systems" },
  { id: "business", label: "Business technology" },
  { id: "software", label: "Software & web" },
  { id: "support", label: "IT support" },
];

export const categoryLabel: Record<ServiceCategory, string> = {
  security: "Security systems",
  business: "Business technology",
  software: "Software & web",
  support: "IT support",
};

export const services: Service[] = [
  {
    slug: "cctv-installation",
    title: "CCTV Installation",
    category: "security",
    icon: "cctv",
    shortDescription:
      "Planned camera coverage, recording and remote viewing for offices, shops and warehouses.",
    headline: "Camera coverage planned around how your site actually works.",
    overview: [
      "A CCTV system is only as useful as its placement. We start by walking the site, identifying entrances, blind spots and high-value areas, then design coverage that records what matters with the image quality you need.",
      "Installation can include cameras, recorders, cabling, storage sizing and configuration of remote viewing, followed by testing and a walkthrough with your team.",
    ],
    problems: [
      "Blind spots at entrances, loading areas or cash points",
      "Footage that is too dark or too low-resolution to identify people or plates",
      "Recorders that run out of storage or stop recording unnoticed",
      "No way to check the site when nobody is there",
    ],
    features: [
      { title: "Site survey and camera plan", text: "Coverage mapped to entrances, perimeters and sensitive areas before any hardware is chosen." },
      { title: "Indoor and outdoor cameras", text: "Camera types selected for lighting, distance and weather at each position." },
      { title: "Recording and storage", text: "Recorders and storage sized to the retention period you need." },
      { title: "Remote viewing setup", text: "Secure access to live and recorded footage from approved devices." },
      { title: "Clean cabling and mounting", text: "Neat, labelled installation that is easier to maintain later." },
      { title: "Testing and handover", text: "Each camera checked for angle, focus and night performance, with a walkthrough for your staff." },
    ],
    benefits: [
      { title: "Clearer evidence", text: "Footage that is usable when you need to review an incident." },
      { title: "Visible deterrence", text: "Well-placed cameras discourage theft and misuse." },
      { title: "Oversight from anywhere", text: "Check multiple sites without being on location." },
      { title: "Room to grow", text: "Systems planned so cameras can be added later." },
    ],
    useCases: ["Corporate offices", "Retail stores and supermarkets", "Warehouses and yards", "Schools and campuses", "Residential compounds"],
    process: [
      { title: "Survey", text: "Walk the site and agree on what each camera must see." },
      { title: "Design", text: "Camera positions, equipment list and storage plan." },
      { title: "Install", text: "Mounting, cabling, recorder and network setup." },
      { title: "Test and train", text: "Verify every view and show your team how to use it." },
    ],
    faqs: [
      { q: "Can I view cameras on my phone?", a: "Remote viewing can be configured on supported equipment. We will confirm compatibility with the devices you plan to use during the survey." },
      { q: "How long is footage kept?", a: "Retention depends on the number of cameras, resolution and storage installed. We size storage to the period you need." },
      { q: "Can you work with my existing cameras?", a: "Often, yes. We assess existing equipment during the survey and recommend what can be reused." },
    ],
    relatedServices: ["access-control", "door-access", "it-support"],
    cardImage: "/images/services/cctv/cctv-installation-technicians.png",
    heroImage: "/images/services/cctv/cctv-installation-technicians.png",
    imageAlt: "Two technicians on ladders mounting CCTV cameras at the glass entrance of a modern office building",
    cardPosition: "88% 30%",
    heroPosition: "78% 40%",
  },
  {
    slug: "access-control",
    title: "Access Control Systems",
    category: "security",
    icon: "access",
    shortDescription:
      "Card, PIN and biometric entry with permissions for who goes where, and when.",
    headline: "Decide who can enter each area, and keep a record of it.",
    overview: [
      "Access control replaces keys with credentials you can issue, change and revoke. Staff, contractors and visitors get access only to the doors and hours they need.",
      "We help you choose readers, credentials and controllers, configure permission groups and, where supported, connect access events with attendance or CCTV systems.",
    ],
    problems: [
      "Lost or copied keys that cannot be cancelled",
      "No record of who entered a room and when",
      "Contractors and visitors with more access than they need",
      "Different doors managed with different, unconnected systems",
    ],
    features: [
      { title: "Readers and credentials", text: "Card, PIN, fingerprint or face readers, chosen per door." },
      { title: "Controllers", text: "Controllers sized to the number of doors and future expansion." },
      { title: "Permission groups", text: "Access by role, department, area and time of day." },
      { title: "Event logs", text: "A history of granted and denied entries for review." },
      { title: "Visitor access", text: "Temporary credentials that expire automatically, where supported." },
      { title: "Integrations", text: "Connection with attendance or CCTV platforms where equipment allows." },
    ],
    benefits: [
      { title: "Instant revocation", text: "Cancel a lost card in minutes instead of changing locks." },
      { title: "Accountability", text: "Know who accessed sensitive areas." },
      { title: "Less admin", text: "Manage access centrally rather than door by door." },
      { title: "Scalable", text: "Add doors and users as the business grows." },
    ],
    useCases: ["Office floors and server rooms", "Shared commercial buildings", "Warehouses and stock rooms", "Clinics and labs", "Educational institutions"],
    process: [
      { title: "Requirements", text: "Map doors, user groups and access rules." },
      { title: "Design", text: "Choose readers, controllers and credentials." },
      { title: "Install and configure", text: "Fit hardware and set up permission groups." },
      { title: "Handover", text: "Train administrators to add users and review logs." },
    ],
    faqs: [
      { q: "Can access control work with our attendance system?", a: "Some equipment supports this. We will check compatibility between the devices and software you use or plan to use." },
      { q: "What happens during a power cut?", a: "Behaviour on power loss depends on the lock type and backup power. We discuss fail-safe and fail-secure options for each door." },
      { q: "Can we start with a few doors?", a: "Yes. Systems can start small and be expanded later." },
    ],
    relatedServices: ["door-access", "attendance-systems", "cctv-installation"],
    cardImage: "/images/industries/commercial-buildings-security.png",
    heroImage: "/images/industries/commercial-buildings-security.png",
    imageAlt: "Employee tapping an access card on a reader beside security turnstiles in an office lobby",
    cardPosition: "88% 45%",
    heroPosition: "75% 50%",
  },
  {
    slug: "attendance-systems",
    title: "Attendance Systems",
    category: "business",
    icon: "attendance",
    shortDescription:
      "Biometric, RFID and card-based time recording with reports your HR team can use.",
    headline: "Accurate time records without paper registers.",
    overview: [
      "Attendance terminals record when staff arrive and leave, using fingerprint, face recognition or cards depending on the device. Records feed into reports for payroll and HR.",
      "We help select devices for your workforce and environment, install them, configure shifts and set up reporting, with export or integration options where the software supports them.",
    ],
    problems: [
      "Manual registers that are slow to process and easy to falsify",
      "Buddy punching and disputed hours",
      "Shift and overtime calculations done by hand",
      "Attendance data spread across several branches",
    ],
    features: [
      { title: "Biometric terminals", text: "Fingerprint or face-recognition devices, where suitable." },
      { title: "RFID and card options", text: "Card-based recording for sites where biometrics are not preferred." },
      { title: "Shift configuration", text: "Shifts, grace periods and overtime rules set up for your policies." },
      { title: "Reports", text: "Daily, monthly and per-employee attendance reports." },
      { title: "Multi-branch setup", text: "Devices at several locations reporting centrally, where supported." },
      { title: "Data export", text: "Export for payroll processing, depending on the software in use." },
    ],
    benefits: [
      { title: "Reliable records", text: "Time data tied to the individual, not a signature." },
      { title: "Faster payroll", text: "Less time compiling hours each month." },
      { title: "Fewer disputes", text: "A clear record both staff and management can check." },
      { title: "Visibility", text: "See lateness and absence trends across teams." },
    ],
    useCases: ["Offices with flexible shifts", "Factories and warehouses", "Retail chains", "Schools and colleges", "Hospitals and clinics"],
    process: [
      { title: "Policy review", text: "Understand shifts, rules and reporting needs." },
      { title: "Device selection", text: "Choose terminals suited to staff numbers and environment." },
      { title: "Install and enrol", text: "Mount devices and enrol employees." },
      { title: "Reports and training", text: "Configure reports and train HR staff." },
    ],
    faqs: [
      { q: "Fingerprint or face recognition?", a: "It depends on the environment and workforce. Face recognition can suit sites where hands are often dirty or gloved; we recommend options after a review." },
      { q: "Can it connect to our payroll software?", a: "Many systems export data in common formats. Direct integration depends on your payroll software and is confirmed case by case." },
      { q: "How is employee biometric data handled?", a: "We configure devices and access in line with your data policies and recommend restricting administrative access." },
    ],
    relatedServices: ["access-control", "software-development", "it-support"],
    cardImage: "/images/services/attendance/attendance-biometric-terminal-install.png",
    heroImage: "/images/services/attendance/attendance-biometric-terminal-install.png",
    imageAlt: "Technician in a hard hat fitting a fingerprint and face-recognition attendance terminal to a wall",
    cardPosition: "62% 40%",
    heroPosition: "60% 40%",
  },
  {
    slug: "door-access",
    title: "Door Access Installation",
    category: "security",
    icon: "door",
    shortDescription:
      "Electronic locks, readers, exit buttons and controllers fitted and wired properly.",
    headline: "Electronic door hardware, installed to work every time.",
    overview: [
      "Door access installation covers the physical side of securing a door: electronic locks, readers, exit devices, door contacts, power supplies and the wiring that connects them.",
      "We assess each door's construction and usage, recommend suitable hardware, install it neatly and test locking, release and emergency behaviour before handover.",
    ],
    problems: [
      "Doors that fail to lock or release reliably",
      "Hardware that does not suit the door type or traffic",
      "Untidy or unsafe wiring",
      "No safe exit option during emergencies",
    ],
    features: [
      { title: "Electronic locks", text: "Magnetic locks, electric strikes or other lock types matched to the door." },
      { title: "Readers and keypads", text: "Entry devices positioned for ease of use." },
      { title: "Exit devices", text: "Push-to-exit buttons and emergency release where required." },
      { title: "Controllers and power", text: "Controllers and backup power sized for the installation." },
      { title: "Wiring", text: "Concealed or trunked cabling, labelled for maintenance." },
      { title: "Testing", text: "Lock, release and alarm behaviour verified on every door." },
    ],
    benefits: [
      { title: "Dependable doors", text: "Hardware chosen for the door, not a one-size kit." },
      { title: "Safer exits", text: "Emergency release planned from the start." },
      { title: "Tidy finish", text: "Installations that look professional in customer-facing areas." },
      { title: "Easier upkeep", text: "Clear wiring and documentation for future work." },
    ],
    useCases: ["Main entrances and reception", "Server and records rooms", "Glass office doors", "Stock rooms", "Gated areas"],
    process: [
      { title: "Door assessment", text: "Check construction, frame and usage for each door." },
      { title: "Hardware plan", text: "Agree on locks, readers and exit devices." },
      { title: "Installation", text: "Fit hardware and wiring with minimal disruption." },
      { title: "Commissioning", text: "Test every function and hand over documentation." },
    ],
    faqs: [
      { q: "Can you fit locks on glass doors?", a: "Many glass doors can take suitable electronic locks with the right brackets. We confirm during the door assessment." },
      { q: "Do you supply the access control software too?", a: "Door installation is often combined with our access control service. See Access Control Systems for permissions and management." },
      { q: "Will installation disrupt our office?", a: "We plan work to minimise disruption and can schedule around business hours where needed." },
    ],
    relatedServices: ["access-control", "cctv-installation", "attendance-systems"],
    cardImage: "/images/services/door-access/door-access-maglock-installation.png",
    heroImage: "/images/services/door-access/door-access-maglock-installation.png",
    imageAlt: "Technician fitting a magnetic lock above a glass office door while a colleague tests a card reader",
    cardPosition: "22% 35%",
    heroPosition: "50% 35%",
  },
  {
    slug: "pos-systems",
    title: "Point of Sale (POS) Systems",
    category: "business",
    icon: "pos",
    shortDescription:
      "Checkout terminals, scanners, printers and cash drawers set up for retail and restaurants.",
    headline: "A checkout that keeps the queue moving.",
    overview: [
      "A POS system brings together the terminal, peripherals and software your staff use at every sale. When it is set up well, checkout is fast and your stock and sales figures stay accurate.",
      "We help select hardware, install and configure terminals and peripherals, and set up the software for your products and workflow, including inventory or reporting features where the chosen software provides them.",
    ],
    problems: [
      "Slow checkout and long queues at busy times",
      "Stock levels that do not match what is on the shelf",
      "Peripherals that are unreliable or incompatible",
      "Sales data that is hard to review",
    ],
    features: [
      { title: "POS terminals", text: "Touchscreen terminals sized for your counter and volume." },
      { title: "Barcode scanners", text: "Handheld or fixed scanners for quick item entry." },
      { title: "Receipt printers and cash drawers", text: "Peripherals configured to work with your software." },
      { title: "Software setup", text: "Products, prices, taxes and users configured for launch." },
      { title: "Inventory and reporting", text: "Stock and sales reporting where the chosen software supports it." },
      { title: "Staff training", text: "Hands-on training for cashiers and managers." },
    ],
    benefits: [
      { title: "Faster service", text: "Less time per transaction." },
      { title: "Accurate stock", text: "Sales update inventory as they happen, where supported." },
      { title: "Clear reporting", text: "See what sells and when." },
      { title: "Reliable hardware", text: "Peripherals tested together before go-live." },
    ],
    useCases: ["Retail shops", "Supermarkets", "Restaurants and cafés", "Pharmacies", "Multi-counter stores"],
    process: [
      { title: "Workflow review", text: "Understand how you sell, serve and manage stock." },
      { title: "Hardware and software", text: "Recommend a compatible set of equipment and software." },
      { title: "Setup", text: "Install, configure products and connect peripherals." },
      { title: "Go-live support", text: "Training and support during your first trading days." },
    ],
    faqs: [
      { q: "Which POS software do you work with?", a: "We will recommend options based on your business type and budget, and confirm which ones we support during consultation." },
      { q: "Can we use our existing hardware?", a: "Sometimes. We test existing printers, scanners and drawers for compatibility with the software you choose." },
      { q: "Do you handle restaurant ordering?", a: "Restaurant workflows such as table and kitchen orders depend on the software. We discuss your requirements before recommending a setup." },
    ],
    relatedServices: ["software-development", "it-support", "cctv-installation"],
    cardImage: "/images/services/pos/pos-grocery-checkout-setup.png",
    heroImage: "/images/services/pos/pos-grocery-checkout-setup.png",
    imageAlt: "Technician configuring a touchscreen POS terminal with scanner, receipt printer and cash drawer at a grocery counter",
    cardPosition: "50% 40%",
    heroPosition: "50% 40%",
  },
  {
    slug: "software-development",
    title: "Software Development",
    category: "software",
    icon: "software",
    shortDescription:
      "Custom business tools, dashboards and integrations built around your workflow.",
    headline: "Software shaped around the way your business works.",
    overview: [
      "Off-the-shelf tools rarely fit every process. Custom software can replace spreadsheets, connect systems that do not talk to each other, and give managers the information they need in one place.",
      "We work through requirements with you, propose a practical scope, and build in stages so you can review progress, from internal tools and dashboards to APIs and database-driven applications.",
    ],
    problems: [
      "Critical processes running on spreadsheets and email",
      "Systems that do not share data",
      "Reports compiled by hand every week",
      "Software that no longer fits how the business operates",
    ],
    features: [
      { title: "Internal business tools", text: "Applications for operations, approvals, records and requests." },
      { title: "Dashboards", text: "Key figures presented clearly for managers." },
      { title: "Workflow automation", text: "Repetitive steps handled automatically." },
      { title: "APIs and integrations", text: "Connections between your existing systems, where they allow it." },
      { title: "Database-driven systems", text: "Structured data with appropriate access controls." },
      { title: "Maintenance", text: "Updates and improvements after launch, by agreement." },
    ],
    benefits: [
      { title: "Fits your process", text: "Built around how your team actually works." },
      { title: "Less manual work", text: "Fewer copy-paste steps and spreadsheets." },
      { title: "Better decisions", text: "Up-to-date information in one place." },
      { title: "Owned and extendable", text: "Software that can grow with the business." },
    ],
    useCases: ["Inventory and order tracking", "HR and attendance reporting", "Customer and job management", "Approval workflows", "Management dashboards"],
    process: [
      { title: "Discovery", text: "Understand users, processes and constraints." },
      { title: "Scope and design", text: "Agree on features, screens and priorities." },
      { title: "Build in stages", text: "Regular reviews so you see progress early." },
      { title: "Launch and support", text: "Deployment, training and agreed follow-up support." },
    ],
    faqs: [
      { q: "How long does a project take?", a: "It depends on scope. After discovery we provide a proposed plan and timeline for your review." },
      { q: "Who owns the software?", a: "Ownership and licensing terms are agreed in the project contract before work starts." },
      { q: "Can you improve an existing system?", a: "Yes, where the existing code and infrastructure allow. We review it first and advise on the best approach." },
    ],
    relatedServices: ["website-development", "it-support", "pos-systems"],
    cardImage: "/images/services/website-development/developer-workspace-code-and-website.png",
    heroImage: "/images/services/website-development/developer-workspace-code-and-website.png",
    imageAlt: "Developer writing code across two monitors at a modern office desk",
    cardPosition: "28% 40%",
    cardZoom: 1.6,
    heroPosition: "35% 45%",
  },
  {
    slug: "website-development",
    title: "Website Development",
    category: "software",
    icon: "website",
    shortDescription:
      "Fast, responsive company websites and landing pages that are easy to keep up to date.",
    headline: "A website that explains your business clearly, on any screen.",
    overview: [
      "Your website is often the first place a customer checks you out. It should load quickly, work on phones, explain what you do and make it easy to get in touch.",
      "We design and build corporate websites and landing pages with responsive layouts, sound SEO foundations and, where needed, a content management system so your team can update pages.",
    ],
    problems: [
      "An outdated site that does not reflect the business",
      "Pages that are slow or broken on mobile",
      "Hard-to-find contact information and enquiry forms",
      "Content that only a developer can change",
    ],
    features: [
      { title: "Corporate websites", text: "Clear structure for services, company information and contact." },
      { title: "Landing pages", text: "Focused pages for campaigns or individual services." },
      { title: "Responsive design", text: "Layouts that work from small phones to wide monitors." },
      { title: "Content management", text: "Editable content where a CMS is part of the scope." },
      { title: "Performance and SEO basics", text: "Fast pages, metadata and clean structure." },
      { title: "Maintenance", text: "Updates and fixes after launch, by agreement." },
    ],
    benefits: [
      { title: "Credibility", text: "A professional first impression." },
      { title: "More enquiries", text: "Clear calls to action and working forms." },
      { title: "Mobile reach", text: "A good experience for visitors on phones." },
      { title: "Easier updates", text: "Change content without starting over." },
    ],
    useCases: ["Company websites", "Service landing pages", "Product catalogues", "Recruitment pages", "Website redesigns"],
    process: [
      { title: "Discovery", text: "Goals, audience, content and pages." },
      { title: "Design", text: "Layout and visual direction for review." },
      { title: "Build", text: "Responsive development, forms and content." },
      { title: "Launch", text: "Testing, deployment and handover." },
    ],
    faqs: [
      { q: "Will my site work on phones?", a: "Yes. Every site we build is designed and tested for mobile, tablet and desktop screens." },
      { q: "Can I update the content myself?", a: "If content editing is part of the scope, we set up a suitable CMS and show your team how to use it." },
      { q: "Do you provide hosting and domains?", a: "We can advise on hosting and domain setup. Arrangements are confirmed per project." },
    ],
    relatedServices: ["software-development", "it-support", "pos-systems"],
    cardImage: "/images/services/website-development/developer-workspace-code-and-website.png",
    heroImage: "/images/services/website-development/developer-workspace-code-and-website.png",
    imageAlt: "Business website shown on a desktop monitor and laptop beside a code editor",
    cardPosition: "88% 38%",
    cardZoom: 1.45,
    heroPosition: "70% 40%",
  },
  {
    slug: "it-support",
    title: "IT Support Services",
    category: "support",
    icon: "support",
    shortDescription:
      "Workstations, networks, servers and backups looked after so your team can keep working.",
    headline: "Dependable IT, so technology stays out of your way.",
    overview: [
      "When computers, networks or printers fail, work stops. IT support keeps everyday systems running and gives your team someone to call when something goes wrong.",
      "Support can include workstation setup, software installation, network troubleshooting, server assistance, backups and preventive maintenance. Scope and response arrangements are agreed with each client.",
    ],
    problems: [
      "Slow or unreliable office Wi-Fi and network",
      "New staff waiting days for a working computer",
      "No tested backup of important files",
      "Recurring problems that never get properly fixed",
    ],
    features: [
      { title: "Computer support", text: "Troubleshooting and repair for desktops and laptops." },
      { title: "Network troubleshooting", text: "Diagnosing Wi-Fi, switching and connectivity issues." },
      { title: "Workstation setup", text: "New machines prepared with the software staff need." },
      { title: "Server assistance", text: "Help with on-site or hosted servers, where in scope." },
      { title: "Backups", text: "Backup setup and periodic restore checks." },
      { title: "Preventive maintenance", text: "Updates and checks to reduce unexpected failures." },
    ],
    benefits: [
      { title: "Less downtime", text: "Problems fixed faster, and some avoided altogether." },
      { title: "One point of contact", text: "A single team for everyday IT issues." },
      { title: "Protected data", text: "Backups that are set up and checked." },
      { title: "Predictable planning", text: "Advice on upgrades before things fail." },
    ],
    useCases: ["Small and medium-sized offices", "Retail and restaurant branches", "Schools", "Clinics", "Warehouses with networked equipment"],
    process: [
      { title: "Assessment", text: "Review devices, network and current pain points." },
      { title: "Support plan", text: "Agree on scope, priorities and contact method." },
      { title: "Fix and stabilise", text: "Resolve urgent issues and recurring faults." },
      { title: "Ongoing support", text: "Maintenance and help as agreed." },
    ],
    faqs: [
      { q: "Do you offer on-site support?", a: "On-site and remote support options are discussed during assessment and depend on location and agreement." },
      { q: "What are your response times?", a: "Response arrangements are agreed with each client as part of the support plan." },
      { q: "Can you help with a one-off problem?", a: "Yes. Contact us with the details and we will advise on the next step." },
    ],
    relatedServices: ["software-development", "cctv-installation", "website-development"],
    cardImage: "/images/services/it-support/it-support-onsite-workstation.png",
    heroImage: "/images/services/it-support/it-support-onsite-workstation.png",
    imageAlt: "IT technician servicing an office desktop computer while a colleague points to a system update on screen",
    cardPosition: "40% 40%",
    heroPosition: "45% 40%",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
