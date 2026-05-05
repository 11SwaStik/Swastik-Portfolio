import { aboutParagraphs, terminalLines } from "@/data/about";
import { skillCategories, pipelineStages } from "@/data/skills";
import { projects } from "@/data/projects";
import { devsecopsGroups } from "@/data/devsecops";
import { certifications } from "@/data/certifications";
import { contactLinks } from "@/data/contact";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import DevSecOps from "@/components/sections/DevSecOps";
import Certifications from "@/components/sections/Certifications";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About paragraphs={aboutParagraphs} terminalLines={terminalLines} />
        <Skills categories={skillCategories} pipeline={pipelineStages} />
        <Projects projects={projects} />
        <DevSecOps groups={devsecopsGroups} />
        <Certifications items={certifications} />
        <Contact links={contactLinks} />
      </main>
      <Footer />
    </>
  );
}
