# ⚡ AgentFlow — Multi-Agent AI Dashboard

A multi-agent AI system built with React, FastAPI, and Groq LLaMA 3. Watch AI agents think, search, and act in real time.

## Agents
- 🔍 **Research Agent** — Searches Wikipedia, analyses and summarises any topic
- 💡 **Q&A Agent** — Answers questions with step-by-step reasoning
- ✉️ **Email Agent** — Drafts professional emails for any situation

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **LLM:** Groq API (LLaMA 3.3 70B)
- **Streaming:** Server-Sent Events for real-time step display

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn groq python-dotenv requests
```
Create `.env` in `/backend`:
```
GROQ_API_KEY=your_groq_api_key
```
```bash
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Demo
![AgentFlow Demo](frontend/src/assets/demo.gif)