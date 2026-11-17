/**
 * Portfolio entries.
 *
 * Entries with `demo: true` are DEMONSTRATION content that shows how a project
 * page is laid out; they do not describe real work by the company. The
 * 110 Mobile Tools entry is real concept work (a proposal, not a built store).
 * Replace samples with genuine projects and set `demo: false` — the "Sample layout"
 * labels disappear automatically. Only add `outcomes` that have been verified.
 */

export type PortfolioCategory =
  | "cctv"
  | "access"
  | "attendance"
  | "pos"
  | "software"
  | "website"
  | "infrastructure";

export const portfolioCategories: { id: PortfolioCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "cctv", label: "CCTV and surveillance" },
  { id: "access", label: "Access control" },
  { id: "attendance", label: "Attendance systems" },
  { id: "pos", label: "POS implementations" },
  { id: "software", label: "Software projects" },
  { id: "website", label: "Website projects" },
  { id: "infrastructure", label: "IT infrastructure" },
];

export type Project = {
  slug: string;
  demo: boolean;
  title: string;
  category: PortfolioCategory;
  service: string;
  summary: string;
  overview: string;
  requirements: string[];
  solution: string[];
  implementation: string;
  outcomes: string[] | null;
  /** position: optional CSS object-position keeping the subject in frame when cropped. */
  images: { src: string; alt: string; position?: string }[];
  /** Optional link to a clickable prototype served from /public (opens in a new tab). */
  prototypeUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "110-mobile-tools-ecommerce-ui-ux",
    demo: false,
    title: "110 Mobile Tools — e-commerce UI/UX concept",
    category: "website",
    service: "website-development",
    summary:
      "Proposed UI/UX concept and clickable prototype for a WordPress + WooCommerce store selling mobile repair tools, ICs and parts.",
    overview:
      "A proposed design concept for 110 Mobile Tools, an online store for mobile repair technicians, repair shops, training institutes and wholesalers. It maps the full customer journey on desktop and mobile, plus the store owner's admin view. This is a concept for client review: the store has not been built yet, and product details, prices, fees and policies shown are placeholders.",
    requirements: [
      "Mobile-first shopping for technicians ordering between jobs",
      "Fast product discovery by category, search and part or model number",
      "Clear product details: specifications, compatibility and stock status",
      "Configurable payment and delivery options, confirmed with the client",
      "Wholesale inquiries and WhatsApp support",
    ],
    solution: [
      "Design system in navy, electric blue and a restrained orange accent",
      "Desktop and mobile screens from home page to order tracking",
      "Working cart and checkout prototype with delivery and payment selection",
      "Alternate states: out of stock, invalid coupon, missing details, payment not completed",
      "WordPress + WooCommerce admin dashboard concept",
    ],
    implementation:
      "Planned in four phases, each ending with a client review: discovery and planning, UX/UI design, the WordPress + WooCommerce build, then QA, launch and handover.",
    outcomes: null,
    images: [
      {
        src: "/images/portfolio/110-mobile-tools-ui-ux.png",
        alt: "Home page concept for 110 Mobile Tools with search, product categories and a navy hero banner",
        position: "50% 0%",
      },
    ],
    prototypeUrl: "/prototypes/110-mobile-tools/Main.dc.html",
  },
  {
    slug: "sample-warehouse-surveillance",
    demo: true,
    title: "Warehouse surveillance upgrade",
    category: "cctv",
    service: "cctv-installation",
    summary: "Example layout: perimeter and loading-bay camera coverage for a distribution site.",
    overview: "This sample shows how a CCTV project would be presented: the site, what the client needed and how the system was delivered.",
    requirements: ["Coverage of loading bays and perimeter fencing", "Usable night-time footage", "Remote viewing for site managers"],
    solution: ["Camera plan covering entrances, bays and fence line", "Recorder sized for the agreed retention period", "Remote viewing configured for approved devices"],
    implementation: "Describe the survey, installation stages and how disruption to operations was avoided.",
    outcomes: null,
    images: [{ src: "/images/portfolio/warehouse-cctv-surveillance.png", alt: "Warehouse aisle with pallet racking and CCTV cameras mounted high on the racks, a forklift moving stock in the background", position: "60% 40%" }],
  },
  {
    slug: "sample-office-access-control",
    demo: true,
    title: "Office floor access control",
    category: "access",
    service: "access-control",
    summary: "Example layout: card-based entry with department permissions across one office floor.",
    overview: "This sample shows how an access control project would be described, from requirements to handover.",
    requirements: ["Replace keys on main and internal doors", "Restrict server-room access", "Entry logs for management"],
    solution: ["Card readers on each controlled door", "Permission groups by department", "Administrator training on adding and revoking cards"],
    implementation: "Describe door assessment, hardware fitting and configuration of permission groups.",
    outcomes: null,
    images: [{ src: "/images/portfolio/office-access-control.jpg", alt: "Office worker holding an access card to a wall-mounted card reader in a corridor", position: "55% 50%" }],
  },
  {
    slug: "sample-factory-attendance",
    demo: true,
    title: "Multi-shift attendance rollout",
    category: "attendance",
    service: "attendance-systems",
    summary: "Example layout: biometric terminals and shift reporting for a production site.",
    overview: "This sample illustrates how an attendance project page is structured.",
    requirements: ["Replace paper registers", "Support three shifts", "Monthly reports for payroll"],
    solution: ["Biometric terminals at staff entrances", "Shift and overtime rules configured", "Report exports prepared for payroll"],
    implementation: "Describe device placement, employee enrolment and HR training.",
    outcomes: null,
    images: [{ src: "/images/portfolio/workforce-attendance-system.jpg", alt: "Employee pressing a finger on a wall-mounted biometric attendance terminal", position: "60% 55%" }],
  },
  {
    slug: "sample-retail-pos",
    demo: true,
    title: "Retail checkout setup",
    category: "pos",
    service: "pos-systems",
    summary: "Example layout: terminals, scanners and receipt printers for a multi-counter store.",
    overview: "This sample shows how a POS implementation would be presented.",
    requirements: ["Faster checkout at peak hours", "Barcode scanning for all products", "Daily sales reporting"],
    solution: ["Touchscreen terminals with scanners and printers", "Product catalogue and pricing configured", "Cashier and manager training"],
    implementation: "Describe hardware installation, catalogue setup and go-live support.",
    outcomes: null,
    images: [{ src: "/images/portfolio/sample-retail-pos.webp", alt: "Supermarket checkout lane with a POS terminal and scanner" }],
  },
  {
    slug: "sample-operations-dashboard",
    demo: true,
    title: "Operations dashboard",
    category: "software",
    service: "software-development",
    summary: "Example layout: an internal dashboard bringing orders and stock into one view.",
    overview: "This sample illustrates how a software project would be described.",
    requirements: ["Replace weekly spreadsheet reports", "Combine order and stock data", "Role-based access for managers"],
    solution: ["Web dashboard with key figures", "Data imports from existing systems", "User roles and permissions"],
    implementation: "Describe discovery, staged builds and review sessions.",
    outcomes: null,
    images: [{ src: "/images/portfolio/sample-operations-dashboard.webp", alt: "Business dashboard with charts displayed on a large monitor" }],
  },
  {
    slug: "sample-corporate-website",
    demo: true,
    title: "Corporate website redesign",
    category: "website",
    service: "website-development",
    summary: "Example layout: a responsive company site with service pages and enquiry forms.",
    overview: "This sample shows how a website project page would be structured.",
    requirements: ["Mobile-friendly redesign", "Clear service pages", "Working enquiry form"],
    solution: ["Responsive page templates", "Service and contact pages", "Basic SEO and performance setup"],
    implementation: "Describe design review, build, content migration and launch.",
    outcomes: null,
    images: [{ src: "/images/portfolio/sample-corporate-website.webp", alt: "Company website shown on a laptop and a smartphone" }],
  },
  {
    slug: "sample-office-network",
    demo: true,
    title: "Office network refresh",
    category: "infrastructure",
    service: "it-support",
    summary: "Example layout: structured cabling, Wi-Fi and backups for a growing office.",
    overview: "This sample illustrates how an IT infrastructure project page is laid out.",
    requirements: ["Stable Wi-Fi across the floor", "Tidy network cabinet", "Automated file backups"],
    solution: ["Access points placed after a coverage check", "Network cabinet reorganised and labelled", "Backup schedule with restore test"],
    implementation: "Describe the assessment, after-hours work and handover documentation.",
    outcomes: null,
    images: [{ src: "/images/portfolio/sample-office-network.webp", alt: "Neatly cabled network rack in an office comms room" }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
