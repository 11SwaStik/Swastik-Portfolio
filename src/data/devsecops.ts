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
    why: "Container security follows the principle of minimal attack surface. Removing the shell, running as a non-root user, and scanning images for known CVEs reduces both lateral movement potential and supply-chain risk.",
  },
  {
    title: "KUBERNETES POSTURE",
    items: [
      "Pod Security Admission for default-deny baseline",
      "NetworkPolicies for namespace-level isolation",
      "Sealed Secrets / External Secrets — no plaintext in git",
      "RBAC scoped per workload, not per cluster",
    ],
    why: "Kubernetes defaults to permissive — workloads can run privileged, communicate freely across namespaces, and consume secrets in plaintext. Posture controls invert this with explicit admission policy, default-deny networking, and out-of-band secret distribution.",
  },
  {
    title: "CI/CD SECURITY GATES",
    items: [
      "Pre-commit hooks for secrets detection (gitleaks)",
      "SAST + SCA as blocking PR checks",
      "OIDC short-lived tokens for cloud auth — no long-lived keys",
      "SBOM generation at build time",
    ],
    why: "The pipeline is the highest-leverage point for shifting security left. Static analysis, dependency scanning, and secrets detection run on every commit, surfacing issues during code review rather than after deployment — when remediation cost is significantly higher.",
  },
  {
    title: "CLOUD POSTURE (AWS)",
    items: [
      "Least-privilege IAM scoped per role and per session",
      "S3 block-public-access enforced by default",
      "Security Hub + GuardDuty findings as remediation input",
      "VPC + Security Group baseline review before launch",
    ],
    why: "Cloud incidents are dominated by misconfiguration, not novel exploits. Continuous IAM scoping, secure-by-default storage, and centralized findings ingestion address the bulk of identifiable risk before adversary techniques become relevant.",
  },
];
