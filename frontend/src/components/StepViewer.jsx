const STEP_STYLES = {
  thinking: { icon: "🧠", color: "#6366f1", label: "Thinking" },
  tool_call: { icon: "🔧", color: "#f59e0b", label: "Tool Call" },
  tool_result: { icon: "📥", color: "#10b981", label: "Tool Result" },
  final_answer: { icon: "✅", color: "#10b981", label: "Final Answer" },
}

export default function StepViewer({ steps, isRunning }) {
  return (
    <div style={s.wrapper}>
      <div style={s.header}>
        <span style={s.headerTitle}>⚡ Agent Steps</span>
        {isRunning && (
          <div style={s.runningBadge}>
            <span style={s.runningDot}/>
            Running...
          </div>
        )}
      </div>

      {steps.length === 0 && !isRunning && (
        <div style={s.empty}>
          <span style={s.emptyIcon}>🤖</span>
          <p style={s.emptyText}>Agent steps will appear here in real time</p>
        </div>
      )}

      <div style={s.steps}>
        {steps.map((step, i) => {
          const style = STEP_STYLES[step.type] || STEP_STYLES.thinking
          const isFinal = step.type === "final_answer"
          return (
            <div
              key={i}
              style={{
                ...s.step,
                animation: "slideIn 0.3s ease forwards",
                borderLeft: `3px solid ${style.color}`,
                background: isFinal ? style.color + "11" : "#ffffff06",
              }}
            >
              <div style={s.stepHeader}>
                <div style={{ ...s.stepBadge, background: style.color + "22", color: style.color }}>
                  {style.icon} {style.label}
                </div>
                <span style={s.stepNum}>Step {step.step}</span>
              </div>
              <p style={s.stepTitle}>{step.title}</p>
              <p style={{
                ...s.stepContent,
                color: isFinal ? "#e2e8f0" : "#94a3b8",
                whiteSpace: "pre-wrap",
                fontSize: isFinal ? "14px" : "13px",
              }}>
                {step.content}
              </p>
            </div>
          )
        })}

        {isRunning && (
          <div style={s.thinking}>
            <span style={s.thinkingDot}/>
            <span style={s.thinkingDot}/>
            <span style={s.thinkingDot}/>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  wrapper: { background: "#ffffff08", borderRadius: "16px", border: "1px solid #ffffff11", overflow: "hidden", height: "100%" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #ffffff11", background: "#ffffff05" },
  headerTitle: { fontSize: "14px", fontWeight: "600", color: "white" },
  runningBadge: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#10b981" },
  runningDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1s infinite" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: "12px", textAlign: "center" },
  emptyIcon: { fontSize: "40px" },
  emptyText: { fontSize: "14px", color: "#475569" },
  steps: { padding: "16px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "600px", overflowY: "auto" },
  step: { borderRadius: "10px", padding: "14px 16px" },
  stepHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  stepBadge: { display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "600" },
  stepNum: { fontSize: "11px", color: "#475569" },
  stepTitle: { fontSize: "13px", fontWeight: "600", color: "white", marginBottom: "6px" },
  stepContent: { lineHeight: "1.6" },
  thinking: { display: "flex", gap: "6px", padding: "12px 16px" },
  thinkingDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse 1s infinite" },
}