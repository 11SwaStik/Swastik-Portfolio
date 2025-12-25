// src/pages/CTF.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Confetti from "react-confetti"

const challenges = [
  { id: 1, title: "Level 1 · Neon Cipher", q: "Decode 'sjts' with ROT(5)", ans: "FLAG{neon}" },
  { id: 2, title: "Level 2 · Source Whisper", q: "Find the Base64 in the page source", ans: "FLAG{cyber}" },
  { id: 3, title: "Level 3 · Network Noise", q: "Open DevTools Console and read the [DECRYPT] line", ans: "FLAG{overlord}" },
  { id: 4, title: "Level 4 · Stylesheet Signal", q: "Hint: check comments in styles.css", ans: "FLAG{elite}" },
  { id: 5, title: "Level 5 · Riddle Gate", q: "“Crown among a hundred. Four letters. Apex of the hunt.”", ans: "FLAG{apex}" },
]

export default function CTF(){
  const [step, setStep] = useState(0)
  const [input, setInput] = useState("")
  const [feedback, setFeedback] = useState("")
  const [celebrate, setCelebrate] = useState(false)

  // write a little hint in console for Level 3
  useEffect(() => {
    console.log("%c[TRACE] packet capture online", "color:#ffb6c1")
    console.log("%c[DECRYPT] >>> FLAG{overlord}", "color:#5df2ff")
  }, [])

  // read existing progress (if user refreshes)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ctfProgress") || "{}")
    if (typeof saved.solvedCount === "number") {
      // clamp to number of challenges
      const idx = Math.min(saved.solvedCount, challenges.length)
      setStep(idx === challenges.length ? challenges.length - 1 : idx) // stay on last if all done
    }
  }, [])

  function updateProgress(newSolvedCount){
    const prev = JSON.parse(localStorage.getItem("ctfProgress") || "{}")
    const maxSolved = Math.max(prev.solvedCount || 0, newSolvedCount)
    localStorage.setItem("ctfProgress", JSON.stringify({ solvedCount: maxSolved }))
  }

  function submit(){
    if (!input.trim()) return
    const correct = challenges[step].ans
    if (input.trim() === correct) {
      setFeedback("✅ Correct!")
      setCelebrate(true)
      const nextIndex = step + 1
      updateProgress(nextIndex)
      setTimeout(() => {
        setCelebrate(false)
        if (nextIndex < challenges.length) {
          setStep(nextIndex)
          setInput("")
          setFeedback("")
        } else {
          setFeedback("🎉 All levels complete! Portfolio fully unlocked.")
        }
      }, 1200)
    } else {
      setFeedback("❌ Not quite. Try again.")
    }
  }

  const allDone = step >= challenges.length - 1 && feedback.startsWith("🎉")

  return (
    <div className="container">
      {celebrate && <Confetti />}

      <motion.h1
        className="glitch"
        data-text="CTF Portfolio"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CTF Portfolio
      </motion.h1>

      {!allDone && (
        <motion.div
          className="card"
          key={challenges[step].id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h2>{challenges[step].title}</h2>
          <p>{challenges[step].q}</p>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter FLAG{...}"
          />
          <button onClick={submit} className="btn">Submit</button>
          <p>{feedback}</p>
        </motion.div>
      )}

      {allDone && (
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>🎉 All levels complete!</h2>
          <p>Your portfolio is now fully unlocked.</p>
        </motion.div>
      )}

      {/* little visual: show progress out of 5 */}
      <div className="progress-wrapper">
        <div className="progress-label">
          CTF Progress:{" "}
          {Math.min(
            JSON.parse(localStorage.getItem("ctfProgress") || "{}").solvedCount || 0,
            challenges.length
          )}{" "}
          / {challenges.length}
        </div>
      </div>

      <Link to="/portfolio" className="skip-btn">
        View Full Portfolio →
      </Link>
    </div>
  )
}
