import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Loading from "./components/Loading"
import MatrixRain from "./components/MatrixRain"
import Background from "./components/Background"
import CTF from "./pages/CTF"
import Portfolio from "./pages/Portfolio"


export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loading />

  return (
    <Router>
      {/* 🔻 Bottom Layer */}
      <MatrixRain />

      {/* 🔻 Mid Layer */}
      <Background />

      {/* 🔝 Top Layer (Your UI) */}
      <div className="app-ui-layer">
        <Routes>
          <Route path="/" element={<CTF />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </Router>
  )
}
