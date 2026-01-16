import { useEffect, useRef } from "react"

export default function CursorSnake({
  maxLength = 22,
  size = 13,
  color = "#5df2ff",
  glow = "#ffb6c1"
}) {
  const canvasRef = useRef(null)
  const trail = useRef([])
  const scars = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const glyphs = "01ABCDEF#@$%"

    const onMove = e => {
      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        char: glyphs[Math.floor(Math.random() * glyphs.length)]
      })

      if (trail.current.length > maxLength) {
        trail.current.shift()
      }
    }

    const onClick = e => {
      scars.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        chars: Array.from({ length: 6 }, () =>
          glyphs[Math.floor(Math.random() * glyphs.length)]
        )
      })
    }

    const onHover = e => {
      if (e.target.tagName === "BUTTON" || e.target.classList.contains("btn")) {
        const rect = e.target.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2

        for (let i = 0; i < 10; i++) {
          trail.current.push({
            x: cx + Math.cos(i) * 20,
            y: cy + Math.sin(i) * 20,
            char: glyphs[Math.floor(Math.random() * glyphs.length)]
          })
        }
      }
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("click", onClick)
    window.addEventListener("mouseover", onHover)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${size}px monospace`

      // snake trail
      trail.current.forEach((p, i) => {
        const alpha = i / trail.current.length
        ctx.fillStyle = `rgba(93,242,255,${alpha})`
        ctx.shadowColor = glow
        ctx.shadowBlur = 12 * alpha
        ctx.fillText(p.char, p.x, p.y)
      })

      // click scars
      scars.current.forEach(s => {
        s.life -= 0.02
        ctx.shadowBlur = 20 * s.life
        ctx.fillStyle = `rgba(255,182,193,${s.life})`

        s.chars.forEach((c, i) => {
          ctx.fillText(c, s.x + i * 10 - 25, s.y)
        })
      })

      scars.current = scars.current.filter(s => s.life > 0)

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("click", onClick)
      window.removeEventListener("mouseover", onHover)
      window.removeEventListener("resize", resize)
    }
  }, [maxLength, size, color, glow])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}
    />
  )
}
