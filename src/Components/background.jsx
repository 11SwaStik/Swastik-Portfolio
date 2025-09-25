// src/components/Background.jsx
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"

export default function Background(){
  const particlesInit = useCallback(async engine => {
    await loadFull(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#000" },
        fpsLimit: 60,
        particles: {
          color: { value: ["#ff69b4", "#5df2ff", "#c38bff"] },
          links: { enable: true, color: "#ff69b4", distance: 150 },
          move: { enable: true, speed: 2 },
          number: { value: 60 },
          opacity: { value: 0.5 },
          size: { value: { min: 1, max: 3 } }
        }
      }}
    />
  )
}
