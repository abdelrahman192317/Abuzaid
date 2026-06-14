import type { Package } from "@/lib/types";

export const packages: Package[] = [
  {
    id: "pkg-half-day",
    name: "Half Day",
    price: 1200,
    currency: "USD",
    period: "/ session",
    features: [
      "Up to 4 hours on location",
      "1 look / setup",
      "15 retouched images",
      "Online gallery delivery",
      "Personal usage license",
    ],
    cta: { label: "Start a project", href: "#contact" },
  },
  {
    id: "pkg-full-day",
    name: "Full Day",
    price: 2200,
    currency: "USD",
    period: "/ session",
    features: [
      "Up to 8 hours on location",
      "Multiple looks / setups",
      "40 retouched images",
      "Art direction included",
      "Commercial usage license",
      "Priority delivery",
    ],
    cta: { label: "Start a project", href: "#contact" },
    featured: true,
  },
  {
    id: "pkg-campaign",
    name: "Campaign",
    price: 6500,
    currency: "USD",
    period: "/ project",
    features: [
      "Multi-day production",
      "Full crew & logistics",
      "Photography + motion",
      "Concept & art direction",
      "Extended usage license",
      "Dedicated post timeline",
    ],
    cta: { label: "Let's talk", href: "#contact" },
  },
];
