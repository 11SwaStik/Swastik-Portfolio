export type ProjectStatus = "ACTIVE" | "LIVE" | "STABLE" | "TESTING" | "ARCHIVED";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  number: string;
  name: string;
  status: ProjectStatus;
  impact: string;
  description: string;
  details: string[];
  metrics: ProjectMetric[];
  chips: string[];
  type: string;
  url?: string;
  repoUrl?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  tags: string[];
}

export interface PipelineStage {
  id: string;
  label: string;
  info: string;
  active?: boolean;
}

export interface CTFChallenge {
  id: string;
  question: string;
  answer: string;
}

export interface DevSecOpsGroup {
  title: string;
  items: string[];
  why: string;
}

export interface TerminalLine {
  html: string;
  delay: number;
}

export interface ContactLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  category: string;
  credentialId?: string;
  url?: string;
}
