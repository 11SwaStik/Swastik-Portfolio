import {
  getAbout,
  getSkills,
  getPipeline,
  getProjects,
  getDevSecOpsSkills,
  getDevSecOpsDescription,
  getThreats,
  getCTFChallenges,
  getContactLinks,
} from "@/data/fetchers";
import { ctfPlatforms } from "@/data/ctf";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import SoundToggle from "@/components/layout/SoundToggle";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import DevSecOps from "@/components/sections/DevSecOps";
import PageClient from "./PageClient";
import BootScreenLoader from "@/components/boot/BootScreenLoader";

export default async function Home() {
  const [about, skills, pipeline, projects, devsecopsSkills, devsecopsDesc, threats, ctfChallenges, contactLinks] =
    await Promise.all([
      getAbout(),
      getSkills(),
      getPipeline(),
      getProjects(),
      getDevSecOpsSkills(),
      getDevSecOpsDescription(),
      getThreats(),
      getCTFChallenges(),
      getContactLinks(),
    ]);

  return (
    <>
      <BootScreenLoader />
      <CustomCursor />
      <SoundToggle />
      <Nav />

      <main>
        <Hero />
        <About
          paragraphs={about.paragraphs}
          keyValues={about.keyValues}
          terminalLines={about.terminalLines}
        />
        <Skills categories={skills} pipeline={pipeline} />
        <Projects projects={projects} />
        <DevSecOps
          skills={devsecopsSkills}
          description={devsecopsDesc}
          threats={threats}
        />
        <PageClient
          ctfChallenges={ctfChallenges}
          ctfPlatforms={ctfPlatforms}
          contactLinks={contactLinks}
        />
      </main>

      <Footer />
    </>
  );
}
