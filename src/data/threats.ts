import type { Threat } from "./types";

export const threats: Threat[] = [
  { name: "SQL Injection attempt", status: "BLOCKED", severity: "low" },
  { name: "XSS payload detected", status: "BLOCKED", severity: "low" },
  { name: "Port scan \u2014 10.0.0.44", status: "LOGGED", severity: "warning" },
  { name: "Brute force \u2014 SSH", status: "BLOCKED", severity: "low" },
  { name: "Suspicious container exec", status: "ALERT", severity: "critical" },
  { name: "SSRF attempt", status: "BLOCKED", severity: "low" },
  { name: "Directory traversal", status: "BLOCKED", severity: "low" },
  { name: "DNS exfiltration probe", status: "ALERT", severity: "critical" },
  { name: "Malformed JWT token", status: "LOGGED", severity: "warning" },
  { name: "Container escape attempt", status: "BLOCKED", severity: "low" },
  { name: "RCE via deserialization", status: "BLOCKED", severity: "low" },
  { name: "K8s API unauthorized", status: "ALERT", severity: "critical" },
];
