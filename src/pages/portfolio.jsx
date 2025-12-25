// src/pages/Portfolio.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const TABS = ["About", "Skills", "Projects", "Achievements", "Contact", "Secret"]

export default function Portfolio(){
  const [activeTab, setActiveTab] = useState("About")
  const [solvedCount, setSolvedCount] = useState(0)
  const totalLevels = 5

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ctfProgress") || "{}")
    if (typeof saved.solvedCount === "number") {
      setSolvedCount(Math.min(saved.solvedCount, totalLevels))
    }
  }, [])

  const allUnlocked = solvedCount >= totalLevels
  const visibleTabs = allUnlocked ? TABS : TABS.filter(t => t !== "Secret")
  const progressPercent = (solvedCount / totalLevels) * 100

  const renderTabContent = () => {
    switch (activeTab) {
      case "About":
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2>About Me</h2>
            <p>
              I’m <b>Swastik Sharma</b> — a cybersecurity-focused developer who enjoys
              breaking and building systems to understand them deeply.
            </p>
            <p>
              I work across CTFs, firewalls, browser extensions, and AI-powered
              defenses, with a strong bias for practical, hands-on security.
            </p>
          </motion.div>
        )
      case "Skills":
        return (
          <motion.div key="skills" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2>Skills</h2>
            <div className="grid">
              <div className="card">Penetration Testing</div>
              <div className="card">Web App Security</div>
              <div className="card">Python & C++</div>
              <div className="card">React Basics</div>
              <div className="card">AI / ML for Security</div>
              <div className="card">Firewall & WAF Design</div>
            </div>
          </motion.div>
        )
      case "Projects":
        return (
          <motion.div key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2>Projects</h2>
            <div className="grid">
              <div className="card">
                <h3>Agni Shield</h3>
                <p>Context-aware firewall + L7 WAF. Dashboard + browser extension.</p>
              </div>
              <div className="card">
                <h3>Spam Image Classifier</h3>
                <p>AI model to detect spam popups and images with high accuracy.</p>
              </div>
              <div className="card">
                <h3>Browser Extension</h3>
                <p>Blocks malicious domains and IPs, works across all major devices.</p>
              </div>
            </div>
          </motion.div>
        )
      case "Achievements":
        return (
          <motion.div key="achievements" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2>Achievements</h2>
            <ul>
              <li>1st place with Agni Shield in a university-level exhibition.</li>
              <li>CEH certified; actively engaged in CTF and security practice.</li>
              <li>Experience building both endpoint and web firewalls.</li>
            </ul>
          </motion.div>
        )
      case "Contact":
        return (
          <motion.div key="contact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2>Contact</h2>
            <p>Feel free to reach out for security, dev work, or just to talk tech.</p>
            <p>
              <a href="mailto:11swastiksharma@gmail.com" className="btn">Email</a>
              <a href="https://www.linkedin.com/in/swastik-sharma-73184a252/" target="_blank" rel="noreferrer" className="btn">LinkedIn</a>
              <a href="https://github.com/11SwaStik" target="_blank" rel="noreferrer" className="btn">GitHub</a>
            </p>
          </motion.div>
        )
      case "Secret":
        return (
          <motion.div key="secret" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2>Secret Section</h2>
            <p>
              You cleared all CTF levels. That already says more about you than any
              bullet list ever could.
            </p>
            <p>
              This portfolio is wired to react to your curiosity — that’s the whole point.
            </p>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container">
      <motion.h1
        className="glitch"
        data-text="Swastik Sharma"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Swastik Sharma
      </motion.h1>
      <p className="subtitle">Cybersecurity · Developer · CTF Enjoyer</p>

      {/* CTF progress bar */}
      <div className="progress-wrapper">
        <div className="progress-label">
          CTF Progress: {solvedCount} / {totalLevels}{!allUnlocked && " · Solve more to unlock extras"}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        {visibleTabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content card">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>

      <Link to="/" className="skip-btn">← Back to CTF</Link>
    </div>
  )
}
