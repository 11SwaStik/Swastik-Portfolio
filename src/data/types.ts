export interface Project {
  id: string;
  number: string;
  name: string;
  badge?: string;
  description: string;
  chips: string[];
  type: string;
  url?: string;
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

export interface Threat {
  name: string;
  status: "BLOCKED" | "LOGGED" | "ALERT";
  severity: "low" | "warning" | "critical";
}

export interface DevSecOpsSkill {
  name: string;
  percentage: number;
}

export interface KeyValue {
  key: string;
  value: string;
  highlight?: boolean;
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
