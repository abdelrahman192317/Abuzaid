import type { Service } from "@/lib/types";

const img = (n: number, alt: string) => ({
  type: "image" as const,
  src: `/images/service-${String(n).padStart(2, "0")}.jpg`,
  width: 1600,
  height: 1200,
  alt,
});

export const services: Service[] = [
  {
    id: "s-art-direction",
    title: "Art Direction",
    description:
      "Concept, mood and visual system — defining how a story should look before a single frame is shot.",
    image: img(1, "Art direction"),
  },
  {
    id: "s-photography",
    title: "Photography",
    description:
      "Editorial, brand and documentary photography on location or in studio, start to delivery.",
    image: img(2, "Photography"),
  },
  {
    id: "s-motion",
    title: "Motion & Film",
    description:
      "Short-form film and motion capture for brands — direction, shooting and the edit.",
    image: img(3, "Motion and film"),
  },
  {
    id: "s-digital",
    title: "Digital Production",
    description:
      "End-to-end production: planning, crew, logistics and post — so the idea actually ships.",
    image: img(4, "Digital production"),
  },
  {
    id: "s-branding",
    title: "Branding",
    description:
      "Visual identity rooted in photography — image-led brand worlds that hold together everywhere.",
    image: img(5, "Branding"),
  },
];
