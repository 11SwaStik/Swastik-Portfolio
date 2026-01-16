import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loading from "./components/Loading"
import MatrixRain from "./components/CursorSnake"
import Background from "./components/Background"
import CTF from "./pages/CTF"
import Portfolio from "./pages/Portfolio"
import CursorSnake from "./components/CursorSnake"


export default function App(){
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState("pink")
  const [recruiterMode, setRecruiterMode] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  if (loading) return <Loading />

  return (
    <Router>
      {!recruiterMode && <MatrixRain />}
      {!recruiterMode && <Background />}

      <button className="theme-toggle" onClick={() =>
        setTheme(t => t === "pink" ? "green" : "pink")
      }>
        {theme === "pink" ? "🟢 Matrix" : "💗 Cyberpunk"}
      </button>

      <button className="recruiter-toggle" onClick={() =>
        setRecruiterMode(r => !r)
      }>
        {recruiterMode ? "🎮 Hacker Mode" : "🧑‍💼 Recruiter Mode"}
      </button>

      <div className="app-ui-layer">
        <Routes>
          <Route path="/" element={<CTF recruiterMode={recruiterMode} />} />
          <Route path="/portfolio" element={<Portfolio recruiterMode={recruiterMode} />} />
        </Routes>
      </div>
    </Router>
  )
}
