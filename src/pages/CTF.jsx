import { useState } from "react"
import { Link } from "react-router-dom"
import Confetti from "react-confetti"

const challenges = [
  { q: "ROT5 decode 'sjts'", a: "FLAG{neon}" },
  { q: "Find Base64 in source", a: "FLAG{cyber}" },
  { q: "Check DevTools Console", a: "FLAG{overlord}" },
  { q: "Hidden CSS comment", a: "FLAG{elite}" },
  { q: "Apex of the hunt. Four letters.", a: "FLAG{apex}" }
]

export default function CTF({ recruiterMode }){
  const [step, setStep] = useState(0)
  const [input, setInput] = useState("")
  const [celebrate, setCelebrate] = useState(false)

  function submit(){
    if(input.trim() === challenges[step].a){
      setCelebrate(true)
      const solved = step + 1
      localStorage.setItem("ctfSolved", solved)
      setTimeout(() => {
        setCelebrate(false)
        setStep(solved)
        setInput("")
      }, 1200)
    }
  }

  if (recruiterMode) {
    return (
      <div className="container">
        <h1>CTF Hidden</h1>
        <p>Recruiter Mode enabled.</p>
        <Link to="/portfolio" className="btn">View Portfolio</Link>
      </div>
    )
  }

  return (
    <div className="container">
      {celebrate && <Confetti />}
      <h1 className="glitch" data-text="CTF ACCESS">CTF ACCESS</h1>

      {step < challenges.length ? (
        <div className="card">
          <h2>Level {step + 1}</h2>
          <p>{challenges[step].q}</p>
          <input value={input} onChange={e=>setInput(e.target.value)} />
          <button onClick={submit} className="btn">Submit</button>
        </div>
      ) : (
        <div className="card">
          <h2>All levels cleared</h2>
          <p>Portfolio fully unlocked.</p>
        </div>
      )}

      <Link to="/portfolio" className="skip-btn">→ Portfolio</Link>
    </div>
  )
}
