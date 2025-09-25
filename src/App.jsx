import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loading from './components/Loading'
import MatrixRain from './components/MatrixRain'
import Background from './components/Background' // optional particles
import CTF from './pages/CTF'
import Portfolio from './pages/Portfolio'

export default function App(){
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    const t = setTimeout(()=>setLoading(false), 1500)
    return ()=>clearTimeout(t)
  },[])

  if(loading) return <Loading />

  return (
    <Router>
      {/* Matrix code rain background */}
      <MatrixRain colorPalette={['#ff69b4','#5df2ff','#c38bff']} fontSize={14} />

      {/* Optional particles background (can comment out if too heavy) */}
      {/* <Background /> */}

      <div className="app-container">
        <Routes>
          <Route path="/" element={<CTF/>}/>
          <Route path="/portfolio" element={<Portfolio/>}/>
        </Routes>
      </div>
    </Router>
  )
}
