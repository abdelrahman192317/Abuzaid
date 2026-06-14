// The single data-access boundary for the whole app.
//
// UI/components import ONLY from here (and from "@/lib/types"). Today these
// read from local static modules in src/data. To move to Sanity later, rewrite
// just these four function bodies (e.g. fetch GROQ queries) — no component
// changes required.

import type { Project, Service, Package, SiteSettings } from "@/lib/types";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { packages } from "@/data/packages";
import { siteSettings } from "@/data/siteSettings";

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getPackages(): Promise<Package[]> {
  return packages;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings;
}
