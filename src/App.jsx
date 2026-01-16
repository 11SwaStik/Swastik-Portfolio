import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Loading from "./components/Loading"
import CursorSnake from "./components/CursorSnake"

import CTF from "./pages/CTF"
import Portfolio from "./pages/Portfolio"

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <Loading />

  return (
    <Router>
      {/* Interaction-driven cursor snake */}
      <CursorSnake />

      <div className="app-ui-layer">
        <Routes>
          <Route path="/" element={<CTF />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </Router>
  )
}
