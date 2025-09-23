import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Portfolio(){
  return (
    <div className="container">
      <motion.h1 
        className="glitch" 
        data-text="Swastik Sharma"
        initial={{opacity:0, y:-30}}
        animate={{opacity:1, y:0}}
      >
        Swastik Sharma
      </motion.h1>
      <p className="subtitle">Cybersecurity • Developer • Hacker</p>

      <motion.section initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
        <h2>⚡ Skills</h2>
        <div className="grid">
          <div className="card">Penetration Testing</div>
          <div className="card">Web Security</div>
          <div className="card">Python</div>
          <div className="card">AI for Security</div>
        </div>
      </motion.section>

      <motion.section initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}>
        <h2>🛠️ Projects</h2>
        <div className="grid">
          <div className="card">Agni Shield — AI Firewall</div>
          <div className="card">Spam Image Classifier</div>
          <div className="card">Browser Extension</div>
        </div>
      </motion.section>

      <motion.section initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}}>
        <h2>🎓 Certifications</h2>
        <div className="grid">
          <div className="card">CEH v12</div>
          <div className="card">Google Cybersecurity</div>
        </div>
      </motion.section>

      <Link to="/" className="skip-btn">← Back to CTF</Link>
    </div>
  )
}
