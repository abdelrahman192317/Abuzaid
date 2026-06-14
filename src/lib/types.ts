// Domain types for the portfolio. These are the *contract* between the data
// layer (src/lib/data) and the UI. Components import types only from here.

export type MediaKind = "image" | "video";

export interface MediaItem {
  type: MediaKind;
  /** Public path, e.g. "/images/hero-01.jpg" or "/videos/video-01.mp4". */
  src: string;
  /** For videos: poster image path. */
  poster?: string;
  width: number;
  height: number;
  alt: string;
  /** Optional LQIP; usually resolved automatically via the generated blur map. */
  blurDataURL?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  year: number;
  category: string;
  role?: string;
  tags?: string[];
  cover: MediaItem;
  media: MediaItem[];
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image?: MediaItem;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  currency: string;
  period?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  name: { first: string; family: string };
  tagline: string;
  nav: NavLink[];
  socials: SocialLink[];
  hero: {
    portraits: MediaItem[];
    tags: string[];
    showreelHref: string;
  };
  selectedWork: MediaItem[];
  editorial: MediaItem[];
  videoWork: MediaItem[];
  featured: {
    title: string;
    subtitle: string;
    clips: MediaItem[];
  };
  about: {
    statement: string;
    /** Frame sequence basics for the scrub. */
    frames: { dir: string; count: number; pad: number; ext: string };
  };
  contact: {
    heading: string;
    email: string;
    cta: { label: string; href: string };
  };
  footer: {
    statement: string;
    links: NavLink[];
  };
}
