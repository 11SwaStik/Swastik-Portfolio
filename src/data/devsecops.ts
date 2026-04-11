import type { DevSecOpsSkill } from "./types";

export const devsecopsSkills: DevSecOpsSkill[] = [
  { name: "Docker Security", percentage: 88 },
  { name: "Kubernetes Security", percentage: 80 },
  { name: "AWS Cloud Security", percentage: 82 },
  { name: "CI/CD Hardening", percentage: 75 },
  { name: "IaC Scanning", percentage: 72 },
];

export const devsecopsDescription = [
  "Security isn't a gate at the end of the pipeline — it's <strong>baked into every stage</strong>. I help teams shift security left, automate threat detection, and harden infrastructure without slowing delivery.",
  "From container hardening and Kubernetes policy enforcement to CI/CD pipeline security and cloud posture on <strong>AWS</strong> — I build systems that are secure by default.",
];
