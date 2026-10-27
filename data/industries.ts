/**
 * Potential markets — not verified clients or contracts. Edit or remove freely.
 * `services` lists slugs from data/services.ts that are typically relevant.
 */
export type IndustryIconKey =
  | "office"
  | "retail"
  | "hospitality"
  | "warehouse"
  | "education"
  | "healthcare"
  | "commercial"
  | "sme";

export const industries: {
  slug: string;
  title: string;
  icon: IndustryIconKey;
  text: string;
  services: string[];
  /** Optional photo under /public; cards without one use an icon layout. */
  image?: { src: string; alt: string; position?: string };
}[] = [
  { slug: "corporate-offices", title: "Corporate offices", icon: "office", text: "Controlled entry, attendance records, reliable networks and internal software.", services: ["access-control", "attendance-systems", "it-support"], image: { src: "/images/industries/corporate-office.png", alt: "Open-plan office with staff at workstations, a meeting room behind glass and an employee using a door card reader", position: "55% 45%" } },
  { slug: "retail", title: "Retail and supermarkets", icon: "retail", text: "Fast checkout, stock visibility and camera coverage of tills and entrances.", services: ["pos-systems", "cctv-installation", "it-support"], image: { src: "/images/industries/retail-supermarkets-pos.png", alt: "Supermarket cashier scanning groceries at a POS terminal for a customer", position: "45% 45%" } },
  { slug: "hospitality", title: "Restaurants and hospitality", icon: "hospitality", text: "Front-of-house POS, back-office systems and coverage of public areas.", services: ["pos-systems", "cctv-installation", "website-development"], image: { src: "/images/industries/restaurants-hospitality-pos.png", alt: "Restaurant host using a touchscreen POS terminal with a receipt printer at the front counter", position: "45% 40%" } },
  { slug: "warehouses", title: "Warehouses and logistics", icon: "warehouse", text: "Perimeter cameras, restricted stock areas and staff time recording.", services: ["cctv-installation", "access-control", "attendance-systems"], image: { src: "/images/industries/warehouses-logistics.png", alt: "Warehouse manager checking a tablet beside racking while a forklift moves pallets under ceiling cameras", position: "40% 45%" } },
  { slug: "education", title: "Educational institutions", icon: "education", text: "Campus security, staff attendance and dependable classroom IT.", services: ["cctv-installation", "attendance-systems", "it-support"], image: { src: "/images/industries/educational-institutions-campus.png", alt: "Two staff members reviewing a tablet in a busy campus foyer with a card reader on the glass door", position: "40% 40%" } },
  { slug: "healthcare", title: "Healthcare facilities", icon: "healthcare", text: "Restricted access to sensitive rooms, staff rosters and stable IT.", services: ["access-control", "door-access", "it-support"], image: { src: "/images/industries/healthcare-facilities-hospital.png", alt: "Hospital reception with a doctor and nurse at a computer while a nurse badges into the ICU", position: "55% 40%" } },
  { slug: "commercial-buildings", title: "Commercial buildings", icon: "commercial", text: "Shared-entry control, lobby coverage and door hardware for tenants.", services: ["door-access", "access-control", "cctv-installation"], image: { src: "/images/industries/commercial-buildings-security.png", alt: "Office lobby reception desk with CCTV monitoring screens and card-operated security turnstiles", position: "60% 45%" } },
  { slug: "sme", title: "Small and medium-sized businesses", icon: "sme", text: "A single technology partner for security, websites, software and support.", services: ["website-development", "software-development", "it-support"] },
];
