import { Link } from 'react-router-dom'

export default function Portfolio(){
  return (
    <div className="container">
      <h1 className="glitch" data-text="Swastik Sharma">Swastik Sharma</h1>
      <p className="subtitle">Cybersecurity • Developer • Hacker</p>

      <section>
        <h2>⚡ Skills</h2>
        <div className="grid">
          <div className="card">Penetration Testing</div>
          <div className="card">Web Security</div>
          <div className="card">Python</div>
          <div className="card">JavaScript</div>
          <div className="card">AI/ML</div>
        </div>
      </section>

      <section>
        <h2>🛠️ Projects</h2>
        <div className="grid">
          <div className="card">Agni Shield — AI Firewall</div>
          <div className="card">Spam Image Classifier</div>
          <div className="card">Browser Extension</div>
        </div>
      </section>

      <section>
        <h2>🎓 Certifications</h2>
        <div className="grid">
          <div className="card">CEH v12</div>
          <div className="card">Google Cybersecurity</div>
        </div>
      </section>

      <section>
        <h2>🎮 Hobbies</h2>
        <div className="grid">
          <div className="card">CTFs</div>
          <div className="card">Chess</div>
          <div className="card">Photography</div>
        </div>
      </section>

      <section>
        <h2>📬 Contact</h2>
        <p>
          <a href="mailto:11swastiksharma@gmail.com" className="btn">Email</a>
          <a href="https://www.linkedin.com/in/swastik-sharma-73184a252/" target="_blank" className="btn">LinkedIn</a>
          <a href="https://github.com/11SwaStik" target="_blank" className="btn">GitHub</a>
        </p>
      </section>

      <Link to="/" className="skip-btn">← Back to CTF</Link>
    </div>
  )
}
