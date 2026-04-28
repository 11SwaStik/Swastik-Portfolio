import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "agnishield",
    number: "01",
    name: "AgniShield",
    status: "ACTIVE",
    type: "FLAGSHIP",
    impact:
      "Browser-extension firewall — admin-grade network policy without the hardware.",
    metric: { label: "AWARDED", value: "1st Place" },
    description:
      "Most companies spend thousands on enterprise firewalls. I built one that lives in a browser extension. AgniShield lets an admin block harmful or distracting sites across all employee devices, log traffic, restrict IPs and DNS — no hardware, no complex setup. One extension. Full control. Built to solve a real workplace problem: how do you protect a network and maintain productivity without being invasive?",
    chips: ["Browser Extension", "Admin Dashboard", "IP Block", "DNS Filter", "Layer 7"],
  },
  {
    id: "aws-labs",
    number: "02",
    name: "AWS Security Labs",
    status: "LIVE",
    type: "INFRASTRUCTURE",
    impact:
      "Production AWS labs delivering hands-on offensive + defensive training to thousands of learners.",
    metric: { label: "LEARNERS", value: "1,000+" },
    description:
      "Designed and deployed hands-on cybersecurity labs on AWS for thousands of learners. Built custom AMIs pre-loaded with tools, configured IAM policies with least-privilege principles, and architected isolated Linux and Windows environments for offensive and defensive training — so students don't just read about attacks, they run them in a safe, controlled space.",
    chips: ["AWS", "Custom AMIs", "IAM", "Linux", "Windows"],
  },
  {
    id: "hash-cracker",
    number: "03",
    name: "Hash Cracker",
    status: "STABLE",
    type: "OFFENSIVE",
    impact:
      "Dictionary-attack utility making weak password storage tangible for learners.",
    metric: { label: "COVERAGE", value: "MD5 · SHA-1/256/384/512" },
    description:
      "A Python tool that cracks MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes using dictionary attacks on Linux. Built to understand how weak password storage gets exploited — and to make that tangible for students learning about authentication security.",
    chips: ["Python", "MD5", "SHA-256", "SHA-512", "Linux"],
  },
  {
    id: "network-scanner",
    number: "04",
    name: "Network Scanner",
    status: "STABLE",
    type: "RECON",
    impact:
      "First-five-minutes-of-a-pentest recon tool — see what an attacker sees before they do.",
    metric: { label: "PROBES", value: "ARP + Nmap" },
    description:
      "Internal network reconnaissance tool using ARP scanning and Nmap to discover live hosts, open ports and running services. The kind of tool you run in the first five minutes of a pentest — built to understand what an attacker sees before you do.",
    chips: ["ARP", "Nmap", "Python", "Recon"],
  },
  {
    id: "edutech",
    number: "05",
    name: "EduTech",
    status: "LIVE",
    type: "EDTECH",
    impact:
      "Live learning platform — roadmaps, quizzes, and quests in one place.",
    metric: { label: "USERS", value: "1,000+" },
    description:
      "A live learning platform built for 1000+ students. EduTech brings together tutorials, domain roadmaps, practice questions, quizzes and rewards — all in one place. 84 lessons, 10+ hands-on quests, and a community spanning Discord, Twitter and Instagram. The idea was simple: make it easier to find the right resource and actually stick with it.",
    chips: ["Next.js", "Quizzes", "Roadmaps", "Vercel"],
    url: "https://edutech-seven.vercel.app/",
  },
];
