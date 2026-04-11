import type {
  Project,
  SkillCategory,
  PipelineStage,
  CTFChallenge,
  DevSecOpsSkill,
  Threat,
  ContactLink,
  KeyValue,
  TerminalLine,
} from "./types";
import { aboutParagraphs, keyValues, terminalLines } from "./about";
import { skillCategories, pipelineStages } from "./skills";
import { projects } from "./projects";
import { devsecopsSkills, devsecopsDescription } from "./devsecops";
import { ctfChallenges } from "./ctf";
import { threats } from "./threats";
import { contactLinks } from "./contact";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;

async function fetchFromCMS<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${CMS_URL}/api/${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`CMS fetch failed: ${endpoint}`);
  return res.json();
}

export async function getProjects(): Promise<Project[]> {
  if (CMS_URL) return fetchFromCMS<Project[]>("projects");
  return projects;
}

export async function getSkills(): Promise<SkillCategory[]> {
  if (CMS_URL) return fetchFromCMS<SkillCategory[]>("skills");
  return skillCategories;
}

export async function getPipeline(): Promise<PipelineStage[]> {
  if (CMS_URL) return fetchFromCMS<PipelineStage[]>("pipeline");
  return pipelineStages;
}

export async function getCTFChallenges(): Promise<CTFChallenge[]> {
  if (CMS_URL) return fetchFromCMS<CTFChallenge[]>("ctf-challenges");
  return ctfChallenges;
}

export async function getDevSecOpsSkills(): Promise<DevSecOpsSkill[]> {
  if (CMS_URL) return fetchFromCMS<DevSecOpsSkill[]>("devsecops-skills");
  return devsecopsSkills;
}

export async function getDevSecOpsDescription(): Promise<string[]> {
  if (CMS_URL) return fetchFromCMS<string[]>("devsecops-description");
  return devsecopsDescription;
}

export async function getThreats(): Promise<Threat[]> {
  if (CMS_URL) return fetchFromCMS<Threat[]>("threats");
  return threats;
}

export async function getContactLinks(): Promise<ContactLink[]> {
  if (CMS_URL) return fetchFromCMS<ContactLink[]>("contact-links");
  return contactLinks;
}

export async function getAbout(): Promise<{
  paragraphs: string[];
  keyValues: KeyValue[];
  terminalLines: TerminalLine[];
}> {
  if (CMS_URL) return fetchFromCMS("about");
  return { paragraphs: aboutParagraphs, keyValues, terminalLines };
}
