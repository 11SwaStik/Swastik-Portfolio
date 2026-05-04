import type { DevSecOpsGroup } from "./types";

export const devsecopsGroups: DevSecOpsGroup[] = [
  {
    title: "CONTAINER HARDENING",
    items: [
      "Distroless or minimal base images",
      "Non-root USER directive, read-only root filesystem",
      "Multi-stage builds — build tools never reach the runtime image",
      "Image scanned with Trivy before push",
    ],
    why: "Less in the container means less for an attacker to use. Strip out the shell, run as a regular user, and scan the image before it ships.",
  },
  {
    title: "KUBERNETES POSTURE",
    items: [
      "Pod Security Admission for default-deny baseline",
      "NetworkPolicies for namespace-level isolation",
      "Sealed Secrets / External Secrets — no plaintext in git",
      "RBAC scoped per workload, not per cluster",
    ],
    why: "Kubernetes defaults are open. These settings flip that around — pods can't do dangerous things unless allowed, namespaces don't talk by default, and secrets never sit in git as plaintext.",
  },
  {
    title: "CI/CD SECURITY GATES",
    items: [
      "Pre-commit hooks for secrets detection (gitleaks)",
      "SAST + SCA as blocking PR checks",
      "OIDC short-lived tokens for cloud auth — no long-lived keys",
      "SBOM generation at build time",
    ],
    why: "The pipeline is where most security mistakes leak through — a stray credential, a dependency with a known CVE, a missed review. Gates catch these before they reach production.",
  },
  {
    title: "CLOUD POSTURE (AWS)",
    items: [
      "Least-privilege IAM scoped per role and per session",
      "S3 block-public-access enforced by default",
      "Security Hub + GuardDuty findings as remediation input",
      "VPC + Security Group baseline review before launch",
    ],
    why: "Most cloud breaches aren't fancy exploits — they're misconfigurations. Tight permissions, closed-by-default storage, and actually reading the alerts catches the boring 90% of issues.",
  },
];
