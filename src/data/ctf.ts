import type { CTFChallenge } from "./types";

export const ctfChallenges: CTFChallenge[] = [
  {
    id: "1",
    question: 'Decode this ROT13: "xvezqn" \u2192 Submit as FLAG{answer}',
    answer: "FLAG{KIRMADA}",
  },
  {
    id: "2",
    question: "Which protocol uses port 22? Submit as FLAG{protocol}",
    answer: "FLAG{SSH}",
  },
  {
    id: "3",
    question: "What does VAPT stand for? Submit the abbreviation: FLAG{XXXX}",
    answer: "FLAG{VAPT}",
  },
  {
    id: "4",
    question: "Classic SQLi: ' OR '1'='?' \u2014 what replaces the ? Submit as FLAG{char}",
    answer: "FLAG{1}",
  },
  {
    id: "5",
    question:
      "Final level: what is the superuser account on all Unix/Linux systems? FLAG{username}",
    answer: "FLAG{ROOT}",
  },
];

export const ctfPlatforms = ["HACKTHEBOX", "TRYHACKME", "PICOCTF", "CTFtime"];
