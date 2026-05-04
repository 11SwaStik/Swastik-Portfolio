import type { DevSecOpsGroup } from "./types";

// Honest framing — practices studied in coursework and applied in
// lab environments, not yet at production scale. Edit when that changes.
export const devsecopsIntro =
  "How I approach security in pipelines and infrastructure — drawn from coursework, lab projects, and the AWS Security ranges at Scaler. Studied and applied in lab environments; building toward production fluency.";

export const devsecopsGroups: DevSecOpsGroup[] = [
  {
    title: "CONTAINER HARDENING",
    items: [
      "Distroless or minimal base images",
      "Non-root USER directive, read-only root filesystem",
      "Multi-stage builds — build tools never reach the runtime image",
      "Image scanned with Trivy before push",
    ],
  },
  {
    title: "KUBERNETES POSTURE",
    items: [
      "Pod Security Admission for default-deny baseline",
      "NetworkPolicies for namespace-level isolation",
      "Sealed Secrets / External Secrets — no plaintext in git",
      "RBAC scoped per workload, not per cluster",
    ],
  },
  {
    title: "CI/CD SECURITY GATES",
    items: [
      "Pre-commit hooks for secrets detection (gitleaks)",
      "SAST + SCA as blocking PR checks",
      "OIDC short-lived tokens for cloud auth — no long-lived keys",
      "SBOM generation at build time",
    ],
  },
  {
    title: "CLOUD POSTURE (AWS)",
    items: [
      "Least-privilege IAM scoped per role and per session",
      "S3 block-public-access enforced by default",
      "Security Hub + GuardDuty findings as remediation input",
      "VPC + Security Group baseline review before launch",
    ],
  },
];
