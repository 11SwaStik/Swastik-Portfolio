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
  {
    id: "plan",
    label: "PLAN",
    info: "Threat modeling, abuse cases, and security requirements defined before code is written.",
  },
  {
    id: "code",
    label: "CODE",
    info: "Secure coding standards, pre-commit hooks, secrets detection, IDE security plugins.",
  },
  {
    id: "sast-sca",
    label: "SAST / SCA",
    info: "Static analysis on source (SAST) plus third-party dependency and license scanning (SCA) — Semgrep, Snyk, OWASP DC.",
  },
  {
    id: "build",
    label: "BUILD",
    info: "Hardened CI runners, SBOM generation, and build provenance attestation (SLSA).",
  },
  {
    id: "dast",
    label: "DAST",
    info: "Dynamic security testing against a running app — fuzzing, API security, OWASP ZAP.",
  },
  {
    id: "iac",
    label: "IAC SCAN",
    info: "Terraform, Kubernetes manifests, and container images scanned for misconfigurations and CVEs — Checkov, Trivy, tfsec.",
  },
  {
    id: "sign",
    label: "SIGN",
    info: "Cryptographic image signing and supply-chain attestation — Cosign, Sigstore, in-toto.",
  },
  {
    id: "runtime",
    label: "RUNTIME",
    info: "Container runtime protection, RASP, anomaly detection on syscalls and network — Falco, Sysdig.",
  },
  {
    id: "monitor",
    label: "MONITOR",
    info: "SIEM ingestion, log analysis, alerting, threat detection, and incident response.",
    active: true,
  },
];
