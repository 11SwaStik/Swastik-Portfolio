import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'

const challenges = [
  { q: "Decrypt 'URYYB' (ROT13)", ans: "FLAG{hello}" },
  { q: "Check page source for base64", ans: "FLAG{matrix}" },
  { q: "Console whispers secrets...", ans: "FLAG{overlord}" },
]

export default function CTF(){
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [solved, setSolved] = useState(false)

  function submit(){
    if(input.trim() === challenges[step].ans){
      setSolved(true)
      setTimeout(()=> {
        setStep(step+1)
        setInput('')
        setSolved(false)
      }, 1500)
    }
  }

  return (
    <div className="container">
      {solved && <Confetti />}
      <motion.h1 
        className="glitch"
        data-text="CTF Portfolio"
        initial={{opacity:0, y:-20}}
        animate={{opacity:1, y:0}}
      >
        CTF Portfolio
      </motion.h1>

      {step < challenges.length ? (
        <motion.div className="card" initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}}>
          <h2>Level {step+1}</h2>
          <p>{challenges[step].q}</p>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter FLAG{...}"/>
          <button onClick={submit} className="btn">Submit</button>
        </motion.div>
      ) : (
        <motion.h2 animate={{scale:1.1}}>🎉 All levels complete!</motion.h2>
      )}

      <Link to="/portfolio" className="skip-btn">View Portfolio →</Link>
    </div>
  )
}

