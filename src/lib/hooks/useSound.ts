"use client";
import { useState, useCallback, useEffect } from "react";
import { sound } from "../sound";

export function useSound() {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => {
    setEnabled(sound.toggle());
  }, []);

  const enable = useCallback(() => {
    sound.enable();
    setEnabled(true);
  }, []);

  // Wire global click/hover sounds
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button,a,[data-hover]")) {
        sound.playClick();
      }
    };
    const onHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button,a,[data-hover],.tag,.pstage")) {
        sound.playHover();
      }
    };
    const onMove = () => {
      sound.playMouseTexture();
    };

    document.addEventListener("click", onClick, { passive: true });
    document.addEventListener("mouseover", onHover, { passive: true });
    document.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onHover);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return { enabled, toggle, enable, sound };
}
