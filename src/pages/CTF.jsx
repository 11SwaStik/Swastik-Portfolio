import { useState } from 'react'
import { Link } from 'react-router-dom'

const flags = [
  { q: "Decrypt 'URYYB' (ROT13)", ans: "FLAG{hello}" },
  { q: "Check the page source for Base64", ans: "FLAG{matrix}" },
  { q: "Console whispers secrets...", ans: "FLAG{overlord}" },
  { q: "Inspect CSS comments", ans: "FLAG{elite}" },
  { q: "Final riddle: 'Cyber apex predator'", ans: "FLAG{apex}" },
]

export default function CTF(){
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState('')

  function submit(){
    if(input.trim() === flags[step].ans){
      setFeedback("✅ Correct!")
      setTimeout(()=>{ setStep(step+1); setInput(''); setFeedback('') }, 800)
    } else {
      setFeedback("❌ Try again")
    }
  }

  return (
    <div className="container">
      <h1 className="glitch" data-text="CTF Portfolio">CTF Portfolio</h1>
      {step < flags.length ? (
        <div className="card">
          <h2>Level {step+1}</h2>
          <p>{flags[step].q}</p>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter FLAG{...}"/>
          <button onClick={submit} className="btn">Submit</button>
          <p>{feedback}</p>
        </div>
      ) : (
        <h2>🎉 You unlocked all levels!</h2>
      )}

      <Link to="/portfolio" className="skip-btn">View Full Portfolio</Link>
    </div>
  )
}
