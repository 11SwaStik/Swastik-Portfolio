"use client";
import { useState, useEffect } from "react";

const SECTIONS = ["hero", "about", "skills", "projects", "devsecops", "ctf", "contact"];

export function useScrollSpy() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      let current = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 220) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}
