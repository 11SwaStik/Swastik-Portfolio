import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "agnishield",
    number: "01",
    name: "AgniShield",
    badge: "1ST PLACE",
    description:
      "Most companies spend thousands on enterprise firewalls. I built one that lives in a browser extension. AgniShield lets an admin block harmful or distracting sites across all employee devices, log traffic, restrict IPs and DNS — no hardware, no complex setup. One extension. Full control. Built to solve a real workplace problem: how do you protect a network and maintain productivity without being invasive?",
    chips: ["Browser Extension", "Admin Dashboard", "IP Block", "DNS Filter", "Traffic Logs", "Layer 7"],
    type: "FLAGSHIP",
  },
  {
    id: "aws-labs",
    number: "02",
    name: "AWS Security Labs @ Scaler",
    description:
      "Designed and deployed hands-on cybersecurity labs on AWS for thousands of learners. Built custom AMIs pre-loaded with tools, configured IAM policies with least-privilege principles, and architected isolated Linux and Windows environments for offensive and defensive training — so students don't just read about attacks, they run them in a safe, controlled space.",
    chips: ["AWS", "Custom AMIs", "IAM Policies", "Linux Labs", "Windows Labs"],
    type: "INFRASTRUCTURE",
  },
  {
    id: "hash-cracker",
    number: "03",
    name: "Hash Cracker",
    description:
      "A Python tool that cracks MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes using dictionary attacks on Linux. Built to understand how weak password storage gets exploited — and to make that tangible for students learning about authentication security.",
    chips: ["Python", "MD5", "SHA-256", "SHA-512", "Linux"],
    type: "OFFENSIVE",
  },
  {
    id: "network-scanner",
    number: "04",
    name: "Network Scanner",
    description:
      "Internal network reconnaissance tool using ARP scanning and Nmap to discover live hosts, open ports and running services. The kind of tool you run in the first five minutes of a pentest — built to understand what an attacker sees before you do.",
    chips: ["ARP Scan", "Nmap", "Python", "Recon"],
    type: "RECON",
  },
  {
    id: "edutech",
    number: "05",
    name: "EduTech",
    badge: "LIVE",
    description:
      "A live learning platform built for 1000+ students. EduTech brings together tutorials, domain roadmaps, practice questions, quizzes and rewards — all in one place. 84 lessons, 10+ hands-on quests, and a community spanning Discord, Twitter and Instagram. The idea was simple: make it easier to find the right resource and actually stick with it.",
    chips: ["Live", "26k Students", "Quizzes", "Roadmaps", "Vercel"],
    type: "EDTECH",
    url: "https://edutech-seven.vercel.app/",
  },
];
