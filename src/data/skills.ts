import type { SkillCategory, PipelineStage } from "./types";

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "LANGUAGES",
    tags: ["Python", "Java", "C++", "Shell Scripting"],
  },
  {
    id: "security-tools",
    title: "SECURITY TOOLS",
    tags: ["Burp Suite", "Metasploit", "Nmap", "Wireshark", "Snort", "Splunk"],
  },
  {
    id: "cloud-devsecops",
    title: "CLOUD & DEVSECOPS",
    tags: ["AWS", "Docker Security", "Kubernetes Security", "CI/CD Hardening"],
  },
  {
    id: "concepts",
    title: "CONCEPTS",
    tags: [
      "VAPT",
      "SIEM",
      "Cryptography",
      "GRC",
      "Privilege Escalation",
      "Network Security",
      "Cloud Security",
      "Linux Security",
    ],
  },
];

export const pipelineStages: PipelineStage[] = [
  { id: "code", label: "CODE", info: "Static analysis, secret scanning, code review gates" },
  { id: "sast", label: "SAST / SCA", info: "SAST, SCA, dependency vulnerability scanning" },
  { id: "build", label: "BUILD", info: "Container image scanning, Dockerfile hardening" },
  { id: "dast", label: "DAST", info: "DAST, API fuzzing, integration security tests" },
  { id: "iac", label: "IAC SCAN", info: "Terraform/IaC scanning, Kubernetes policy enforcement" },
  { id: "sign", label: "SIGN", info: "Image signing, SBOM generation, policy gates" },
  { id: "runtime", label: "RUNTIME", info: "Runtime security, WAF, network segmentation, RBAC" },
  { id: "monitor", label: "MONITOR", info: "SIEM ingestion, alerting, threat detection, IR", active: true },
];
