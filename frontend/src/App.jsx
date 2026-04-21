import { useState, useEffect } from "react"
import axios from "axios"
import LandingPage from "./pages/LandingPage"
import AgentCard from "./components/AgentCard"
import StepViewer from "./components/StepViewer"

export default function App() {
  const [page, setPage] = useState("landing")
  const [agents, setAgents] = useState([])
  const [activeAgent, setActiveAgent] = useState(null)
  const [task, setTask] = useState("")
  const [steps, setSteps] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (page === "app") {
      axios.get("http://localhost:8000/agents")
        .then(res => {
          setAgents(res.data.agents)
          setActiveAgent(res.data.agents[0])
        })
    }
  }, [page])

  const runAgent = async () => {
    if (!task.trim() || !activeAgent || isRunning) return
    setSteps([])
    setIsRunning(true)

    try {
      const response = await fetch("http://localhost:8000/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, agent_type: activeAgent.id })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop()
        for (const line of lines) {
          if (line.trim()) {
            try {
              const step = JSON.parse(line)
              setSteps(prev => [...prev, step])
            } catch {}
          }
        }
      }

      setHistory(prev => [{
        agent: activeAgent.name,
        icon: activeAgent.icon,
        task,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)])

    } catch (err) {
      console.error(err)
    } finally {
      setIsRunning(false)
    }
  }

  if (page === "landing") return <LandingPage onStart={() => setPage("app")} />

  return (
    <div style={s.app}>

      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          <span style={s.logo}>⚡ AgentFlow</span>
          <button style={s.backBtn} onClick={() => setPage("landing")}>← Home</button>
        </div>

        <p style={s.sidebarLabel}>CHOOSE AGENT</p>
        <div style={s.agentList}>
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isActive={activeAgent?.id === agent.id}
              onClick={() => { setActiveAgent(agent); setSteps([]) }}
            />
          ))}
        </div>

        {history.length > 0 && (
          <>
            <p style={{ ...s.sidebarLabel, marginTop: "24px" }}>RECENT TASKS</p>
            <div style={s.historyList}>
              {history.map((h, i) => (
                <div key={i} style={s.historyItem}>
                  <span>{h.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={s.historyTask}>{h.task.substring(0, 40)}...</p>
                    <p style={s.historyTime}>{h.agent} · {h.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main area */}
      <div style={s.main}>

        {/* Top bar */}
        <div style={s.topBar}>
          {activeAgent && (
            <div style={s.activeAgentInfo}>
              <span style={{ fontSize: "24px" }}>{activeAgent.icon}</span>
              <div>
                <p style={s.activeAgentName}>{activeAgent.name}</p>
                <p style={s.activeAgentDesc}>{activeAgent.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={s.inputArea}>
          <div style={s.inputRow}>
            <input
              style={s.input}
              placeholder={activeAgent ? `Try: "${activeAgent.example}"` : "Enter your task..."}
              value={task}
              onChange={e => setTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && runAgent()}
            />
            <button
              style={{
                ...s.runBtn,
                background: activeAgent ? `linear-gradient(135deg, ${activeAgent.color}, ${activeAgent.color}aa)` : "#6366f1",
                opacity: isRunning || !task.trim() ? 0.6 : 1
              }}
              onClick={runAgent}
              disabled={isRunning || !task.trim()}
            >
              {isRunning ? "⏳ Running..." : "⚡ Run Agent"}
            </button>
          </div>
          {activeAgent && (
            <div style={s.suggestions}>
              <span style={s.suggestLabel}>Quick examples:</span>
              {[activeAgent.example, "What is machine learning?", "Write a thank you email"].map((ex, i) => (
                <button key={i} style={s.suggest} onClick={() => setTask(ex)}>
                  {ex.substring(0, 35)}...
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step viewer */}
        <div style={s.stepViewerWrap}>
          <StepViewer steps={steps} isRunning={isRunning} />
        </div>
      </div>
    </div>
  )
}

const s = {
  app: { display: "flex", height: "100vh", overflow: "hidden", background: "#020818" },
  sidebar: { width: "320px", borderRight: "1px solid #ffffff11", display: "flex", flexDirection: "column", padding: "20px 16px", gap: "8px", overflowY: "auto", flexShrink: 0 },
  sidebarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  logo: { fontSize: "18px", fontWeight: "700", background: "linear-gradient(135deg, #6366f1, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  backBtn: { background: "transparent", border: "1px solid #ffffff22", color: "#94a3b8", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer" },
  sidebarLabel: { fontSize: "10px", fontWeight: "700", color: "#475569", letterSpacing: "1.5px", padding: "0 4px" },
  agentList: { display: "flex", flexDirection: "column", gap: "12px" },
  historyList: { display: "flex", flexDirection: "column", gap: "8px" },
  historyItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "#ffffff06", borderRadius: "8px" },
  historyTask: { fontSize: "12px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  historyTime: { fontSize: "11px", color: "#475569", marginTop: "2px" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topBar: { padding: "20px 28px", borderBottom: "1px solid #ffffff11" },
  activeAgentInfo: { display: "flex", alignItems: "center", gap: "14px" },
  activeAgentName: { fontSize: "18px", fontWeight: "600", color: "white" },
  activeAgentDesc: { fontSize: "13px", color: "#64748b", marginTop: "2px" },
  inputArea: { padding: "20px 28px", borderBottom: "1px solid #ffffff11" },
  inputRow: { display: "flex", gap: "12px", marginBottom: "12px" },
  input: { flex: 1, padding: "12px 16px", background: "#ffffff0d", border: "1px solid #ffffff22", borderRadius: "10px", fontSize: "14px", color: "white" },
  runBtn: { padding: "12px 28px", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: "700", border: "none", cursor: "pointer", whiteSpace: "nowrap" },
  suggestions: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  suggestLabel: { fontSize: "12px", color: "#475569" },
  suggest: { padding: "6px 12px", background: "#ffffff0d", border: "1px solid #ffffff11", borderRadius: "20px", fontSize: "12px", color: "#94a3b8", cursor: "pointer" },
  stepViewerWrap: { flex: 1, padding: "20px 28px", overflow: "hidden" },
}