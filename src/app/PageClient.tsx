"use client";
import { useState, useCallback, useEffect } from "react";
import CTF from "@/components/sections/CTF";
import Secret from "@/components/sections/Secret";
import Contact from "@/components/sections/Contact";
import type { CTFChallenge, ContactLink } from "@/data/types";

interface PageClientProps {
  ctfChallenges: CTFChallenge[];
  ctfPlatforms: string[];
  contactLinks: ContactLink[];
}

export default function PageClient({
  ctfChallenges,
  ctfPlatforms,
  contactLinks,
}: PageClientProps) {
  const [secretVisible, setSecretVisible] = useState(false);

  // Check if CTF was already completed on previous visit
  useEffect(() => {
    const saved = parseInt(localStorage.getItem("kirmada3_ctf") || "0", 10);
    if (saved >= ctfChallenges.length) {
      setSecretVisible(true);
    }
  }, [ctfChallenges.length]);

  const handleCTFComplete = useCallback(() => {
    setSecretVisible(true);
  }, []);

  return (
    <>
      <CTF
        challenges={ctfChallenges}
        platforms={ctfPlatforms}
        onComplete={handleCTFComplete}
      />
      <Secret visible={secretVisible} />
      <Contact links={contactLinks} />
    </>
  );
}
