export default function AttackPanel(){
  return (
    <div className="card">
      <h2>Attack Simulation</h2>
      <pre>
[INFO] Request from 192.168.1.42
[WARN] SQLi pattern detected
[BLOCKED] Dropped by WAF
      </pre>
    </div>
  )
}
