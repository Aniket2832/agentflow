import { useEffect, useRef } from "react"

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
}))

export default function LandingPage({ onStart }) {
  return (
    <div style={s.page}>

      {/* Animated background particles */}
      <div style={s.particles}>
        {PARTICLES.map(p => (
          <div key={p.id} style={{
            ...s.particle,
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}/>
        ))}
      </div>

      {/* Gradient orbs */}
      <div style={s.orb1}/>
      <div style={s.orb2}/>
      <div style={s.orb3}/>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <span style={s.logoIcon}>⚡</span>
          <span style={s.logoText}>AgentFlow</span>
        </div>
        <button style={s.navBtn} onClick={onStart}>Launch App →</button>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBadge}>
          <span style={s.badgeDot}/>
          Multi-Agent AI System · Live Demo
        </div>

        <h1 style={s.heroTitle}>
          AI Agents that
          <span style={s.gradientText}> think, search,</span>
          <br/>and <span style={s.gradientText}>act for you</span>
        </h1>

        <p style={s.heroSub}>
          Watch AI agents reason through tasks in real time —
          calling tools, searching the web, drafting emails,
          and delivering results step by step.
        </p>

        <div style={s.heroBtns}>
          <button style={s.primaryBtn} onClick={onStart}>
            ⚡ Launch AgentFlow
          </button>
          <div style={s.liveIndicator}>
            <span style={s.liveDot}/>
            3 agents ready
          </div>
        </div>

        {/* Agent preview cards */}
        <div style={s.agentPreviews}>
          {[
            { icon: "🔍", name: "Research Agent", desc: "Searches & summarises", color: "#6366f1" },
            { icon: "💡", name: "Q&A Agent", desc: "Reasons step by step", color: "#10b981" },
            { icon: "✉️", name: "Email Agent", desc: "Drafts professional emails", color: "#f59e0b" },
          ].map((a, i) => (
            <div key={i} style={{ ...s.agentCard, borderColor: a.color + "44" }}>
              <div style={{ ...s.agentCardIcon, background: a.color + "22", color: a.color }}>
                {a.icon}
              </div>
              <div>
                <p style={s.agentCardName}>{a.name}</p>
                <p style={s.agentCardDesc}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={s.section}>
        <div style={s.sectionBadge}>HOW IT WORKS</div>
        <h2 style={s.sectionTitle}>Agents that show their work</h2>
        <div style={s.stepsRow}>
          {[
            { icon: "🎯", num: "01", title: "Pick an agent", desc: "Choose from Research, Q&A, or Email agent based on your task." },
            { icon: "⚡", num: "02", title: "Watch it think", desc: "See every step — tool calls, reasoning, searches — in real time." },
            { icon: "✅", num: "03", title: "Get the result", desc: "Receive a structured, actionable answer with full transparency." },
          ].map((step, i) => (
            <div key={i} style={s.stepCard}>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepNum}>{step.num}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={s.featSection}>
        <div style={s.sectionBadge}>FEATURES</div>
        <h2 style={s.sectionTitle}>Built for the agentic era</h2>
        <div style={s.featGrid}>
          {[
            { icon: "🧠", title: "Real-time reasoning", desc: "Watch agents think through problems step by step before answering." },
            { icon: "🔧", title: "Tool use", desc: "Agents call real tools — Wikipedia search, calculator, email drafting." },
            { icon: "📡", title: "Streaming steps", desc: "Every agent action streams live to your dashboard as it happens." },
            { icon: "🤖", title: "LLaMA 3 powered", desc: "Groq's ultra-fast LLaMA 3.3 70B model runs every agent." },
            { icon: "🎯", title: "Task-specific agents", desc: "Each agent is specialised — not a generic chatbot." },
            { icon: "⚡", title: "Sub-second responses", desc: "Groq inference runs at 500+ tokens/sec for instant results." },
          ].map((f, i) => (
            <div key={i} style={s.featCard}>
              <span style={s.featIcon}>{f.icon}</span>
              <h4 style={s.featTitle}>{f.title}</h4>
              <p style={s.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div style={s.ctaGlow}/>
        <h2 style={s.ctaTitle}>Ready to see agents in action?</h2>
        <p style={s.ctaSub}>No signup. No API key needed. Just pick a task and watch.</p>
        <button style={s.primaryBtn} onClick={onStart}>
          ⚡ Launch AgentFlow Now
        </button>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <span>⚡ AgentFlow — Built with React + FastAPI + Groq LLaMA 3</span>
        <span>Multi-agent AI orchestration</span>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: "100vh", background: "#020818", color: "#e2e8f0", position: "relative", overflow: "hidden" },
  particles: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 },
  particle: { position: "absolute", background: "#6366f1", borderRadius: "50%", animation: "pulse 3s infinite" },
  orb1: { position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle, #6366f144 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  orb2: { position: "fixed", bottom: "-200px", right: "-200px", width: "600px", height: "600px", background: "radial-gradient(circle, #10b98144 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  orb3: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", background: "radial-gradient(circle, #f59e0b11 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", position: "relative", zIndex: 10, borderBottom: "1px solid #ffffff11" },
  navLogo: { display: "flex", alignItems: "center", gap: "8px" },
  logoIcon: { fontSize: "22px" },
  logoText: { fontSize: "20px", fontWeight: "700", background: "linear-gradient(135deg, #6366f1, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navBtn: { padding: "8px 20px", background: "linear-gradient(135deg, #6366f1, #10b981)", color: "white", borderRadius: "8px", fontSize: "14px", fontWeight: "600" },
  hero: { textAlign: "center", padding: "80px 20px 60px", maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 10 },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff0d", border: "1px solid #ffffff22", borderRadius: "99px", padding: "6px 16px", fontSize: "13px", color: "#94a3b8", marginBottom: "28px" },
  badgeDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" },
  heroTitle: { fontSize: "56px", fontWeight: "800", lineHeight: "1.1", marginBottom: "20px", color: "white" },
  gradientText: { background: "linear-gradient(135deg, #6366f1, #10b981, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% 200%", animation: "gradientShift 3s ease infinite" },
  heroSub: { fontSize: "17px", color: "#94a3b8", lineHeight: "1.7", marginBottom: "36px", maxWidth: "560px", margin: "0 auto 36px" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center", alignItems: "center", marginBottom: "48px" },
  primaryBtn: { padding: "14px 32px", background: "linear-gradient(135deg, #6366f1, #10b981)", color: "white", borderRadius: "10px", fontSize: "15px", fontWeight: "700", border: "none", cursor: "pointer" },
  liveIndicator: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#94a3b8" },
  liveDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" },
  agentPreviews: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" },
  agentCard: { display: "flex", alignItems: "center", gap: "12px", background: "#ffffff08", border: "1px solid", borderRadius: "12px", padding: "14px 20px", backdropFilter: "blur(10px)" },
  agentCardIcon: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" },
  agentCardName: { fontSize: "14px", fontWeight: "600", color: "white", marginBottom: "2px" },
  agentCardDesc: { fontSize: "12px", color: "#64748b" },
  section: { maxWidth: "1000px", margin: "0 auto", padding: "80px 40px", position: "relative", zIndex: 10 },
  sectionBadge: { fontSize: "11px", fontWeight: "700", color: "#6366f1", letterSpacing: "2px", textAlign: "center", marginBottom: "12px" },
  sectionTitle: { fontSize: "32px", fontWeight: "700", textAlign: "center", marginBottom: "48px", color: "white" },
  stepsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" },
  stepCard: { background: "#ffffff08", borderRadius: "16px", padding: "28px", border: "1px solid #ffffff11", textAlign: "center", backdropFilter: "blur(10px)" },
  stepIcon: { fontSize: "32px", marginBottom: "12px" },
  stepNum: { fontSize: "11px", color: "#6366f1", fontWeight: "700", marginBottom: "8px", letterSpacing: "2px" },
  stepTitle: { fontSize: "16px", fontWeight: "600", marginBottom: "8px", color: "white" },
  stepDesc: { fontSize: "13px", color: "#64748b", lineHeight: "1.6" },
  featSection: { maxWidth: "1000px", margin: "0 auto", padding: "0 40px 80px", position: "relative", zIndex: 10 },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" },
  featCard: { background: "#ffffff08", borderRadius: "12px", padding: "20px", border: "1px solid #ffffff11", backdropFilter: "blur(10px)" },
  featIcon: { fontSize: "24px", marginBottom: "10px", display: "block" },
  featTitle: { fontSize: "15px", fontWeight: "600", marginBottom: "6px", color: "white" },
  featDesc: { fontSize: "13px", color: "#64748b", lineHeight: "1.5" },
  cta: { textAlign: "center", padding: "80px 40px", position: "relative", zIndex: 10 },
  ctaGlow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "400px", height: "200px", background: "radial-gradient(ellipse, #6366f133 0%, transparent 70%)", pointerEvents: "none" },
  ctaTitle: { fontSize: "36px", fontWeight: "700", color: "white", marginBottom: "12px" },
  ctaSub: { color: "#94a3b8", marginBottom: "28px", fontSize: "15px" },
  footer: { display: "flex", justifyContent: "space-between", padding: "24px 40px", borderTop: "1px solid #ffffff11", color: "#334155", fontSize: "13px", flexWrap: "wrap", gap: "8px", position: "relative", zIndex: 10 },
}