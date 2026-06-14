import type { Project } from "@/lib/types";

// Local, static source of truth for projects. Swapping to Sanity later means
// rewriting src/lib/data/index.ts only — this file (and the UI) stay put.

const cover = (slug: string, title: string): Project["cover"] => ({
  type: "image",
  src: `/images/project-${slug}-01.jpg`,
  width: 1600,
  height: 2000,
  alt: `${title} — cover`,
});

const shot = (slug: string, n: number, title: string) => ({
  type: "image" as const,
  src: `/images/project-${slug}-${String(n).padStart(2, "0")}.jpg`,
  width: 2400,
  height: 1600,
  alt: `${title} — frame ${n}`,
});

export const projects: Project[] = [
  {
    id: "p-kurokawa",
    slug: "kurokawa",
    title: "Kurokawa",
    year: 2025,
    category: "Editorial",
    role: "Direction · Photography",
    tags: ["Art direction", "Editorial", "Print"],
    cover: cover("kurokawa", "Kurokawa"),
    media: [shot("kurokawa", 2, "Kurokawa"), shot("kurokawa", 3, "Kurokawa")],
    description:
      "A study of stillness and shadow shot across a winter onsen town — restraint as a visual language.",
  },
  {
    id: "p-monolith",
    slug: "monolith",
    title: "Monolith",
    year: 2025,
    category: "Brand",
    role: "Direction · Photography",
    tags: ["Branding", "Architecture"],
    cover: cover("monolith", "Monolith"),
    media: [shot("monolith", 2, "Monolith"), shot("monolith", 3, "Monolith")],
    description:
      "Concrete forms photographed as portraits — scale, weight and the silence between surfaces.",
  },
  {
    id: "p-lumen",
    slug: "lumen",
    title: "Lumen",
    year: 2024,
    category: "Campaign",
    role: "Digital production",
    tags: ["Campaign", "Light"],
    cover: cover("lumen", "Lumen"),
    media: [shot("lumen", 2, "Lumen"), shot("lumen", 3, "Lumen")],
    description:
      "A campaign built entirely around natural light — chasing one hour of gold across a week.",
  },
  {
    id: "p-atlas",
    slug: "atlas",
    title: "Atlas Down",
    year: 2024,
    category: "Documentary",
    role: "Photography",
    tags: ["Documentary", "Landscape"],
    cover: cover("atlas", "Atlas Down"),
    media: [shot("atlas", 2, "Atlas Down"), shot("atlas", 3, "Atlas Down")],
    description:
      "Field notes from a descent through the high Atlas — terrain, weather and the people who hold it.",
  },
  {
    id: "p-vesper",
    slug: "vesper",
    title: "Vesper",
    year: 2023,
    category: "Editorial",
    role: "Direction · Photography",
    tags: ["Editorial", "Fashion"],
    cover: cover("vesper", "Vesper"),
    media: [shot("vesper", 2, "Vesper"), shot("vesper", 3, "Vesper")],
    description:
      "Dusk-lit fashion editorial — fabric and motion held a half-second past the light.",
  },
  {
    id: "p-nadir",
    slug: "nadir",
    title: "Nadir",
    year: 2023,
    category: "Personal",
    role: "Photography",
    tags: ["Personal", "Abstract"],
    cover: cover("nadir", "Nadir"),
    media: [shot("nadir", 2, "Nadir"), shot("nadir", 3, "Nadir")],
    description:
      "An ongoing personal series on the lowest point — looking up from the bottom of things.",
  },
];
