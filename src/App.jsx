import { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Loading from './components/Loading'
import CTF from './pages/CTF'
import Portfolio from './pages/Portfolio'

const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='

export default function App(){
  const [loading, setLoading] = useState(true)
  const [musicOn, setMusicOn] = useState(true)

  useEffect(()=>{ 
    const t=setTimeout(()=>setLoading(false), 1500)
    return ()=>clearTimeout(t)
  },[])

  if(loading) return <Loading/>

  return (
    <Router>
      <audio src={SILENT_WAV} autoPlay loop muted={!musicOn} />
      <button className="music-toggle" onClick={()=>setMusicOn(!musicOn)}>
        {musicOn ? '🔊' : '🔈'}
      </button>
      <Routes>
        <Route path="/" element={<CTF/>} />
        <Route path="/portfolio" element={<Portfolio/>} />
      </Routes>
    </Router>
  )
}
