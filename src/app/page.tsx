import {
  getProjects,
  getServices,
  getPackages,
  getSiteSettings,
} from "@/lib/data";

import { Preloader } from "@/components/layout/Preloader";
import { StickyNav } from "@/components/layout/StickyNav";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { SelectedWork } from "@/sections/SelectedWork";
import { Projects } from "@/sections/Projects";
import { FeaturedProject } from "@/sections/FeaturedProject";
import { VideoWork } from "@/sections/VideoWork";
import { Editorial } from "@/sections/Editorial";
import { Services } from "@/sections/Services";
import { Packages } from "@/sections/Packages";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";

export default async function Home() {
  const [settings, projects, services, packages] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getServices(),
    getPackages(),
  ]);

  const preloadAssets = settings.hero.portraits.map((p) => p.src);

  return (
    <>
      <Preloader assets={preloadAssets} name={settings.name} />

      <StickyNav
        name={settings.name}
        links={settings.nav}
        cta={settings.contact.cta}
      />

      <main>
        <Hero
          name={settings.name}
          portraits={settings.hero.portraits}
          tags={settings.hero.tags}
          showreelHref={settings.hero.showreelHref}
        />

        <About statement={settings.about.statement} frames={settings.about.frames} />

        <SelectedWork images={settings.selectedWork} />

        <Projects projects={projects} />

        <FeaturedProject
          title={settings.featured.title}
          subtitle={settings.featured.subtitle}
          clips={settings.featured.clips}
        />

        <VideoWork videos={settings.videoWork} />

        <Editorial images={settings.editorial} />

        <Services services={services} />

        <Packages packages={packages} />

        <Contact
          heading={settings.contact.heading}
          email={settings.contact.email}
          cta={settings.contact.cta}
        />

        <Footer
          name={settings.name}
          statement={settings.footer.statement}
          links={settings.footer.links}
        />
      </main>
    </>
  );
}

