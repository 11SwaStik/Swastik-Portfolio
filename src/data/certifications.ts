import type { Certification } from "./types";

// Update each MOOC with the actual course title and verification URL.
// CEHv12 entry is fully populated from the resume; the credentialId
// links through to EC-Council's verify portal.
export const certifications: Certification[] = [
  {
    id: "cehv12",
    name: "Certified Ethical Hacker (CEHv12)",
    issuer: "EC-Council",
    year: "2024",
    category: "OFFENSIVE",
    credentialId: "ECC3417659820",
    url: "https://aspen.eccouncil.org/Verify",
  },
  {
    id: "google-cybersec-1",
    name: "Foundations of Cybersecurity",
    issuer: "Google",
    year: "2024",
    category: "FOUNDATIONS",
  },
  {
    id: "google-cybersec-2",
    name: "Networks & Network Security",
    issuer: "Google",
    year: "2024",
    category: "NETWORK",
  },
  {
    id: "microsoft-cybersec",
    name: "Security, Compliance & Identity (SC-900)",
    issuer: "Microsoft",
    year: "2024",
    category: "CLOUD SECURITY",
  },
];
