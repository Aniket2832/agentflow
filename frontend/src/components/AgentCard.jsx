export default function AgentCard({ agent, isActive, onClick }) {
  return (
    <div
      style={{
        ...s.card,
        borderColor: isActive ? agent.color : "#ffffff11",
        background: isActive ? agent.color + "15" : "#ffffff08",
        transform: isActive ? "translateY(-2px)" : "none",
      }}
      onClick={onClick}
    >
      <div style={{ ...s.iconBox, background: agent.color + "22", color: agent.color }}>
        {agent.icon}
      </div>
      <h3 style={s.name}>{agent.name}</h3>
      <p style={s.desc}>{agent.description}</p>
      <div style={s.example}>
        <span style={s.exampleLabel}>Example:</span>
        <span style={s.exampleText}>"{agent.example}"</span>
      </div>
      {isActive && <div style={{ ...s.activeBadge, background: agent.color }}>Selected ✓</div>}
    </div>
  )
}

const s = {
  card: { background: "#ffffff08", border: "1px solid", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.2s ease", position: "relative" },
  iconBox: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "14px" },
  name: { fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "8px" },
  desc: { fontSize: "13px", color: "#94a3b8", lineHeight: "1.6", marginBottom: "16px" },
  example: { background: "#ffffff08", borderRadius: "8px", padding: "10px 12px" },
  exampleLabel: { fontSize: "11px", color: "#64748b", display: "block", marginBottom: "4px", fontWeight: "600", letterSpacing: "0.5px" },
  exampleText: { fontSize: "12px", color: "#94a3b8", fontStyle: "italic" },
  activeBadge: { position: "absolute", top: "16px", right: "16px", color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "99px" },
}