// src/components/Background.jsx
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"

export default function Background() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{ position: "fixed", zIndex: 1 }}
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          number: { value: 50 },
          color: { value: ["#ff69b4", "#5df2ff", "#c38bff"] },
          shape: { type: "circle" },
          opacity: { value: 0.3 },
          size: { value: 2 },
          links: {
            enable: true,
            distance: 150,
            color: "#ff69b4",
            opacity: 0.3,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            outModes: "bounce"
          }
        },
        detectRetina: true,
      }}
    />
  );
}
