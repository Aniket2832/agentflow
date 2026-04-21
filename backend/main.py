from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json
import time
import requests

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Request models ───────────────────────────────────────────────────
class AgentRequest(BaseModel):
    task: str
    agent_type: str  # "research", "qa", "email"

# ── Tools the agents can use ─────────────────────────────────────────

def search_wikipedia(query: str) -> str:
    """Search Wikipedia and return a summary"""
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            return data.get("extract", "No information found.")
        return "Could not find information on Wikipedia."
    except:
        return "Search failed. Using AI knowledge instead."

def calculate(expression: str) -> str:
    """Safely evaluate a math expression"""
    try:
        allowed = set('0123456789+-*/()., ')
        if all(c in allowed for c in expression):
            result = eval(expression)
            return f"Result: {result}"
        return "Invalid expression"
    except:
        return "Could not calculate"

def get_current_info(topic: str) -> str:
    """Get structured info about a topic"""
    return f"Gathering structured information about: {topic}"

# ── Agent runner with streaming steps ────────────────────────────────

def run_research_agent(task: str):
    """Research agent — searches, analyses, summarises"""
    steps = []

    # Step 1 — Plan
    yield json.dumps({
        "step": 1,
        "type": "thinking",
        "title": "Planning research",
        "content": f"Breaking down the research task: '{task}'"
    }) + "\n"
    time.sleep(0.5)

    # Step 2 — Search Wikipedia
    yield json.dumps({
        "step": 2,
        "type": "tool_call",
        "title": "Calling Wikipedia tool",
        "content": f"Searching Wikipedia for: {task}"
    }) + "\n"
    time.sleep(0.5)

    wiki_result = search_wikipedia(task)

    yield json.dumps({
        "step": 3,
        "type": "tool_result",
        "title": "Wikipedia result received",
        "content": wiki_result[:400] + "..." if len(wiki_result) > 400 else wiki_result
    }) + "\n"
    time.sleep(0.5)

    # Step 3 — Analyse with LLM
    yield json.dumps({
        "step": 4,
        "type": "thinking",
        "title": "Analysing information",
        "content": "Sending retrieved information to LLM for analysis and summarisation..."
    }) + "\n"
    time.sleep(0.5)

    prompt = f"""You are a research analyst. Based on the following information, provide a comprehensive research summary about "{task}".

Information gathered:
{wiki_result}

Provide:
1. Overview (2-3 sentences)
2. Key facts (3-5 bullet points)
3. Significance/Impact
4. Conclusion

Be concise but informative."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=600
    )

    final_answer = response.choices[0].message.content

    # Step 4 — Final answer
    yield json.dumps({
        "step": 5,
        "type": "final_answer",
        "title": "Research complete",
        "content": final_answer
    }) + "\n"


def run_qa_agent(task: str):
    """Q&A agent — answers questions with reasoning steps"""

    yield json.dumps({
        "step": 1,
        "type": "thinking",
        "title": "Understanding the question",
        "content": f"Analysing question: '{task}'"
    }) + "\n"
    time.sleep(0.5)

    yield json.dumps({
        "step": 2,
        "type": "thinking",
        "title": "Breaking down into sub-questions",
        "content": "Identifying what knowledge is needed to answer this accurately..."
    }) + "\n"
    time.sleep(0.5)

    # Check if calculation needed
    if any(op in task for op in ['+', '-', '*', '/', 'calculate', 'compute', 'what is']):
        numbers = ''.join(c for c in task if c in '0123456789+-*/().')
        if numbers:
            yield json.dumps({
                "step": 3,
                "type": "tool_call",
                "title": "Calling calculator tool",
                "content": f"Computing: {numbers}"
            }) + "\n"
            calc_result = calculate(numbers)
            yield json.dumps({
                "step": 4,
                "type": "tool_result",
                "title": "Calculation result",
                "content": calc_result
            }) + "\n"
            time.sleep(0.3)

    yield json.dumps({
        "step": 3,
        "type": "thinking",
        "title": "Formulating answer",
        "content": "Reasoning through the answer step by step..."
    }) + "\n"
    time.sleep(0.5)

    prompt = f"""You are an expert Q&A assistant. Answer the following question with clear reasoning.

Question: {task}

Structure your answer as:
- Direct Answer: (one sentence)
- Explanation: (detailed explanation)
- Example (if relevant):
- Key Takeaway:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500
    )

    yield json.dumps({
        "step": 4,
        "type": "final_answer",
        "title": "Answer ready",
        "content": response.choices[0].message.content
    }) + "\n"


def run_email_agent(task: str):
    """Email agent — drafts professional emails"""

    yield json.dumps({
        "step": 1,
        "type": "thinking",
        "title": "Understanding email requirements",
        "content": f"Analysing email request: '{task}'"
    }) + "\n"
    time.sleep(0.5)

    yield json.dumps({
        "step": 2,
        "type": "thinking",
        "title": "Identifying tone and structure",
        "content": "Determining appropriate tone (formal/informal), structure, and key points to include..."
    }) + "\n"
    time.sleep(0.5)

    yield json.dumps({
        "step": 3,
        "type": "tool_call",
        "title": "Calling email drafting tool",
        "content": "Generating professional email with subject line, greeting, body, and signature..."
    }) + "\n"
    time.sleep(0.5)

    prompt = f"""You are a professional email writer. Draft a complete, professional email based on this request:

Request: {task}

Write a complete email with:
Subject: (clear subject line)
---
Dear [Name],

(Email body — professional, clear, concise)

Best regards,
[Your Name]

Make it professional but natural. Include all necessary details based on the request."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=500
    )

    yield json.dumps({
        "step": 4,
        "type": "final_answer",
        "title": "Email drafted",
        "content": response.choices[0].message.content
    }) + "\n"


# ── Routes ───────────────────────────────────────────────────────────

@app.post("/run-agent")
async def run_agent(body: AgentRequest):
    """Stream agent steps back to frontend"""

    def generate():
        if body.agent_type == "research":
            yield from run_research_agent(body.task)
        elif body.agent_type == "qa":
            yield from run_qa_agent(body.task)
        elif body.agent_type == "email":
            yield from run_email_agent(body.task)
        else:
            yield json.dumps({
                "step": 1,
                "type": "final_answer",
                "title": "Error",
                "content": "Unknown agent type"
            }) + "\n"

    return StreamingResponse(generate(), media_type="text/plain")


@app.get("/agents")
async def get_agents():
    """Return available agents and their descriptions"""
    return {
        "agents": [
            {
                "id": "research",
                "name": "Research Agent",
                "icon": "🔍",
                "description": "Searches Wikipedia, analyses information, and produces structured research summaries on any topic.",
                "example": "Research the history of artificial intelligence",
                "color": "#6366f1"
            },
            {
                "id": "qa",
                "name": "Q&A Agent",
                "icon": "💡",
                "description": "Answers complex questions with step-by-step reasoning, using calculator and knowledge tools.",
                "example": "What is the difference between RAG and fine-tuning?",
                "color": "#10b981"
            },
            {
                "id": "email",
                "name": "Email Agent",
                "icon": "✉️",
                "description": "Drafts professional emails for any situation — job applications, follow-ups, client communication.",
                "example": "Write a follow-up email after a job interview at a startup",
                "color": "#f59e0b"
            }
        ]
    }


@app.get("/")
async def root():
    return {"message": "AgentFlow Multi-Agent API is running!"}