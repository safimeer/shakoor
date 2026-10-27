import {
  BriefcaseBusiness,
  Building2,
  Cctv,
  CodeXml,
  DoorOpen,
  Fingerprint,
  GraduationCap,
  Headset,
  HeartPulse,
  KeyRound,
  Landmark,
  Layers,
  LifeBuoy,
  MonitorSmartphone,
  Network,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  UtensilsCrossed,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/data/services";
import type { IndustryIconKey } from "@/data/industries";

export const serviceIcons: Record<ServiceIconKey, LucideIcon> = {
  cctv: Cctv,
  access: KeyRound,
  attendance: Fingerprint,
  door: DoorOpen,
  pos: ShoppingCart,
  software: CodeXml,
  website: MonitorSmartphone,
  support: Headset,
};

export const industryIcons: Record<IndustryIconKey, LucideIcon> = {
  office: Building2,
  retail: Store,
  hospitality: UtensilsCrossed,
  warehouse: Warehouse,
  education: GraduationCap,
  healthcare: HeartPulse,
  commercial: Landmark,
  sme: BriefcaseBusiness,
};

export const featureIcons: Record<string, LucideIcon> = {
  layers: Layers,
  shield: ShieldCheck,
  network: Network,
  lifebuoy: LifeBuoy,
  trending: TrendingUp,
  wrench: Wrench,
};
