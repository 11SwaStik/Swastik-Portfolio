import { aboutParagraphs, keyValues, terminalLines } from "@/data/about";
import { skillCategories, pipelineStages } from "@/data/skills";
import { projects } from "@/data/projects";
import { devsecopsSkills, devsecopsDescription } from "@/data/devsecops";
import { contactLinks } from "@/data/contact";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import DevSecOps from "@/components/sections/DevSecOps";
import Contact from "@/components/sections/Contact";
import MandalaDivider from "@/components/effects/MandalaDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MandalaDivider />
        <About
          paragraphs={aboutParagraphs}
          keyValues={keyValues}
          terminalLines={terminalLines}
        />
        <MandalaDivider />
        <Skills categories={skillCategories} pipeline={pipelineStages} />
        <MandalaDivider />
        <Projects projects={projects} />
        <MandalaDivider />
        <DevSecOps
          skills={devsecopsSkills}
          description={devsecopsDescription}
        />
        <MandalaDivider />
        <Contact links={contactLinks} />
      </main>
      <Footer />
    </>
  );
}
