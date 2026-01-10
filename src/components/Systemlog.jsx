// src/components/SystemLog.jsx
import { useEffect, useState } from "react"

const BASE_LOGS = [
  "Boot sequence initiated",
  "Loading UI modules",
  "Mounting portfolio components",
  "Establishing secure context",
]

export default function SystemLog() {
  const [logs, setLogs] = useState([])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const solved = Number(localStorage.getItem("ctfSolved") || 0)

    const dynamicLogs = [
      ...BASE_LOGS,
      `CTF progress detected: ${solved}/5`,
      solved >= 1 && "Level 1 access granted",
      solved >= 2 && "Privilege escalation successful",
      solved >= 3 && "Network layer visibility enabled",
      solved >= 4 && "Advanced security modules unlocked",
      solved >= 5 && "System status: FULL ACCESS",
    ].filter(Boolean)

    let i = 0
    const interval = setInterval(() => {
      setLogs(prev => [...prev, dynamicLogs[i]])
      i++
      if (i >= dynamicLogs.length) clearInterval(interval)
    }, 700)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card system-log">
      <strong>System Log</strong>
      <pre>
        {logs.map((log, i) => `> ${log}\n`)}
        <span className="cursor">█</span>
      </pre>
    </div>
  )
}
