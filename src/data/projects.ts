import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "agnishield",
    number: "01",
    name: "AgniShield",
    status: "ACTIVE",
    type: "FLAGSHIP",
    impact:
      "Browser-extension firewall replacing perimeter hardware with a centrally-managed policy layer.",
    description:
      "Layer-7 + DNS filtering enforced client-side via a managed Chromium extension. Admins push site, IP, and DNS rules across all endpoints from a single console — no per-device install, no perimeter rewiring.",
    details: [
      "Centrally-managed Chromium extension distributing policy to all endpoints",
      "Site filtering, IP and DNS rule enforcement, and traffic logging",
      "Designed for SMB networks without dedicated security hardware",
    ],
    metrics: [
      { label: "AWARDED", value: "1st Place" },
      { label: "DEPLOYMENT", value: "Endpoint-native" },
    ],
    chips: ["Browser Extension", "Admin Dashboard", "IP Block", "DNS Filter", "Layer 7"],
  },
  {
    id: "aws-labs",
    number: "02",
    name: "AWS Security Labs",
    status: "LIVE",
    type: "INFRASTRUCTURE",
    impact:
      "Production AWS lab environment running concurrent offensive and defensive exercises at scale.",
    description:
      "Custom AMIs, scoped IAM, and isolated Linux/Windows ranges for hands-on cybersecurity training. Sessions are policy-bounded so concurrent learners cannot affect each other or the host account.",
    details: [
      "Custom AMIs pre-loaded with offensive and defensive tooling",
      "Least-privilege IAM scoped per session",
      "Network and account isolation between concurrent ranges",
    ],
    metrics: [
      { label: "LEARNERS", value: "1,000+" },
      { label: "PLATFORMS", value: "Linux · Windows" },
    ],
    chips: ["AWS", "Custom AMIs", "IAM", "Linux", "Windows"],
  },
  {
    id: "hash-cracker",
    number: "03",
    name: "Hash Cracker",
    status: "STABLE",
    type: "OFFENSIVE",
    impact:
      "Multi-algorithm dictionary cracker demonstrating practical weakness in unsalted hash storage.",
    description:
      "Python utility supporting MD5, SHA-1, and SHA-2 family hashes with configurable wordlists. Used as a teaching artifact for authentication security and as a reference baseline for modern KDF resistance.",
    details: [
      "Pluggable hash interface — MD5, SHA-1, SHA-256, SHA-384, SHA-512",
      "Dictionary attack with configurable wordlist input",
      "Used in instructional contexts to contrast unsalted hashes with modern KDFs",
    ],
    metrics: [
      { label: "COVERAGE", value: "MD5 · SHA-1/2 family" },
      { label: "CONTEXT", value: "Educational" },
    ],
    chips: ["Python", "MD5", "SHA-256", "SHA-512", "Linux"],
  },
  {
    id: "network-scanner",
    number: "04",
    name: "Network Scanner",
    status: "STABLE",
    type: "RECON",
    impact:
      "Internal network discovery combining Layer-2 ARP sweep with service-level enumeration.",
    description:
      "Recon utility producing an inventory of live hosts, exposed ports, and running services. Built for the early-recon phase of an internal assessment.",
    details: [
      "ARP sweep for Layer-2 host discovery in segmented networks",
      "Nmap-driven port and service version enumeration",
      "Inventory output of hosts, ports, and detected services",
    ],
    metrics: [
      { label: "PROBES", value: "ARP + Nmap" },
      { label: "LAYERS", value: "L2 + L3" },
    ],
    chips: ["ARP", "Nmap", "Python", "Recon"],
  },
  {
    id: "edutech",
    number: "05",
    name: "EduTech",
    status: "LIVE",
    type: "EDTECH",
    impact:
      "Cybersecurity learning platform serving 1,000+ active learners through structured curriculum and hands-on exercises.",
    description:
      "Web platform unifying lessons, scenario-based quests, and assessment into a single tracked progression. Backed by a peer community for support and instructor feedback.",
    details: [
      "84 lessons across multiple security domains",
      "10+ scenario-based hands-on quests",
      "Domain roadmaps, quizzes, and rewards-based progression tracking",
    ],
    metrics: [
      { label: "USERS", value: "1,000+" },
      { label: "LESSONS", value: "84" },
    ],
    chips: ["Next.js", "Quizzes", "Roadmaps", "Vercel"],
    url: "https://edutech-seven.vercel.app/",
  },
];
