import type { MediaItem, SiteSettings } from "@/lib/types";

const heroPortraits: MediaItem[] = Array.from({ length: 5 }, (_, i) => ({
  type: "image",
  src: `/images/hero-${String(i + 1).padStart(2, "0")}.jpg`,
  width: 1600,
  height: 2000,
  alt: `Mo7ammed Abuzaid — portrait ${i + 1}`,
}));

const editorialSizes: [number, number][] = [
  [1600, 2000],
  [2400, 1600],
  [1600, 1600],
  [2000, 1400],
  [1400, 1800],
];
const editorial: MediaItem[] = editorialSizes.map(([w, h], i) => ({
  type: "image",
  src: `/images/editorial-${String(i + 1).padStart(2, "0")}.jpg`,
  width: w,
  height: h,
  alt: `Moment ${i + 1}`,
}));

const videoWork: MediaItem[] = Array.from({ length: 5 }, (_, i) => {
  const id = String(i + 1).padStart(2, "0");
  return {
    type: "video",
    src: `/videos/video-${id}.mp4`,
    poster: `/images/video-${id}-poster.jpg`,
    width: 1920,
    height: 1080,
    alt: `Film ${i + 1}`,
  };
});

const featuredClips: MediaItem[] = Array.from({ length: 4 }, (_, i) => {
  const id = String(i + 1).padStart(2, "0");
  return {
    type: "video",
    src: `/videos/featured-${id}.mp4`,
    poster: `/images/featured-${id}-poster.jpg`,
    width: 1920,
    height: 1080,
    alt: `Featured clip ${i + 1}`,
  };
});

export const siteSettings: SiteSettings = {
  name: { first: "Mo7ammed", family: "Abuzaid" },
  tagline: "Photographer & director crafting image-led brand worlds.",
  nav: [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Insights", href: "#editorial" },
    { label: "Contact", href: "#contact" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com/world_of_lens.jo" },
    { label: "Behance", href: "https://behance.net" },
    { label: "Vimeo", href: "https://vimeo.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  hero: {
    portraits: heroPortraits,
    tags: ["Art direction", "Digital production", "Branding"],
  },
  editorial,
  videoWork,
  featured: {
    title: "Aurora — Brand Film",
    subtitle: "A flagship campaign across film, stills and identity.",
    clips: featuredClips,
  },
  about: {
    statement:
      "I make pictures that hold their breath. For a decade I've worked between editorial, brand and documentary — chasing the half-second where a thing falls apart and comes back together.",
    frames: { dir: "/frames/about", count: 41, pad: 4, ext: "jpg" },
  },
  contact: {
    heading: "Let's make something worth looking at.",
    email: "studio@abuzaid.photo",
    cta: { label: "Start a project", href: "mailto:studio@abuzaid.photo" },
  },
  footer: {
    statement: "Mo7ammed Abuzaid — Photography & Direction.",
    links: [
      { label: "Instagram", href: "https://instagram.com/world_of_lens.jo" },
      { label: "Behance", href: "https://behance.net" },
      { label: "Vimeo", href: "https://vimeo.com" },
      { label: "Email", href: "mailto:studio@abuzaid.photo" },
    ],
  },
};
