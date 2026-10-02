# Facts-Only Mutual Fund Assistant — Project Explanation & Submission Guide
**NextLeap Fellowship: Milestone 4 (AI System Design, LLMs & Prompt Engineering)**  
**Author:** Juhi Mungle  
**Live Application URL:** [https://nextleap-lhtc.onrender.com](https://nextleap-lhtc.onrender.com)  
**GitHub Repository:** [https://github.com/juhimungle/NextLeap](https://github.com/juhimungle/NextLeap)  

---

## 1. Executive Summary & Problem Framing

### The Problem in WealthTech (Groww Context)
Retail mutual fund investors in India often face information asymmetry and conflicting third-party aggregator claims. When seeking factual answers (such as current Total Expense Ratios, minimum SIP amounts, exit loads, or statutory lock-in periods), generic conversational AI chatbots tend to hallucinate or, worse, provide unsolicited buy/sell investment advice or return projections. Under SEBI regulations, non-registered entities cannot distribute investment advice.

### The Solution: Facts-Only MF Assistant
A production-ready, domain-constrained Retrieval-Augmented Generation (RAG) assistant designed for mutual fund investors. It strictly limits knowledge to verified, authoritative documents from:
1. **Asset Management Company (AMC):** HDFC Mutual Fund official SIDs, KIMs, addendums, and factsheets.
2. **Regulator:** Securities and Exchange Board of India (SEBI) guidelines and categorization circulars.
3. **Industry Association:** Association of Mutual Funds in India (AMFI) investor education portal.

### Core Product Guardrails:
* **Factual Responses Only:** Maximum 3 sentences per factual answer, citing exactly ONE primary official link, accompanied by the mandatory footer: `"Last updated from sources: <date>"`.
* **Zero Investment Advice:** Automatically intercepts and politely refuses recommendation queries (*"Should I buy?"*, *"Which fund is best?"*) with a redirection to AMFI Investor Education.
* **Zero Return Speculation:** Prohibits calculation, comparison, or prediction of CAGR/returns with a direct link to the official monthly factsheet.
* **Strict Anti-Hallucination Fallback:** If a fact is absent from verified documents, the system refuses to guess and outputs: *"I couldn't verify this fact from the official sources available in my knowledge base..."*.
* **Zero-Log PII Redaction:** High-speed regex filter detects and redacts PAN cards, Aadhaar numbers, phone numbers, email addresses, OTPs, and passwords before query processing.

---

## 2. Technical Architecture & End-to-End Workflow

```
[ User Query / 1-Click Prompt ]
              │
              ▼
    ┌───────────────────┐
    │  PII Scrubber     │ ──► [Contains PAN / Aadhaar / OTP?] ──► Block & Warn (0ms, No Logging)
    └───────────────────┘
              │ No PII
              ▼
    ┌───────────────────┐
    │  Intent Classifier│ ──► [Advice Query?] ──────────► Politely Refuse + AMFI Education Link
    │  (Regex Guardrail)│ ──► [Returns/CAGR Speculation] ─► Politely Refuse + Factsheet Link
    └───────────────────┘ ──► [Greeting / Meta Help?] ──► Guide User on Allowed Questions
              │ Factual Query
              ▼
    ┌───────────────────┐
    │ Scheme Extraction │ ──► Detects: Flexi Cap | Large Cap | ELSS | Mid-Cap
    └───────────────────┘
              │
              ▼
    ┌───────────────────┐
    │ ChromaDB Retriever│ ──► Dense Vector Search (all-MiniLM-L6-v2, top_k=4)
    └───────────────────┘     Metadata Filter: [scheme == detected_scheme]
              │
              ▼
    ┌───────────────────┐
    │ Context Filtering │ ──► Score Threshold Check (> 0.45 cosine similarity)
    └───────────────────┘     If below threshold ──► Fallback: "Unverified from Corpus"
              │ High-confidence official chunks
              ▼
    ┌───────────────────┐
    │ Groq LPU Engine   │ ──► Model: openai/gpt-oss-20b (temperature: 0.0)
    │ (Prompt Synthesis)│     Strict System Prompt: <= 3 sentences + 1 primary link
    └───────────────────┘
              │
              ▼
    ┌───────────────────┐
    │ Answer Normalizer │ ──► Regex sentence truncation (strictly <= 3 sentences)
    └───────────────────┘     Enforces footer: "Last updated from sources: 2026-10-02"
              │
              ▼
    ┌───────────────────┐
    │ React Frontend    │ ──► Displays verified answer card with official link badge,
    └───────────────────┘     copy action, and glowing fintech UI feedback
```

---

## 3. Technology Stack Breakdown

| Layer | Technology | Rationale & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + Vite** | Ultra-fast client-side hydration, hot module replacement, and modern hooks. |
| **Styling & Design System** | **Tailwind CSS v4** | Dark fintech terminal aesthetic, glassmorphism, responsive grid textures, and fluid spacing. |
| **3D Visualization** | **Three.js + React Three Fiber + Drei** | Procedural rotating financial node sphere with WebGL fallback and reduced-motion toggle. |
| **Icons & Micro-Interactions** | **Lucide React** | Clean, accessible SVG icons for categories, copy confirmations, and security badges. |
| **Backend API Framework** | **FastAPI (Python 3.11+)** | High-throughput asynchronous REST API serving both API endpoints and the static compiled frontend. |
| **Vector Database** | **ChromaDB (Persistent)** | Embedded vector database with 563 chunks stored locally in SQLite/HNSW. Zero external database cost. |
| **Embeddings Model** | **HuggingFace `all-MiniLM-L6-v2`** | 384-dimensional dense semantic embeddings running locally without external API latency. |
| **LLM Inference** | **Groq LPU (GPT-OSS-20B)** | Sub-second latency inference with temperature 0.0 for strict deterministic, factual grounding. |
| **Safety & Guardrails** | **Python Regex Pipeline** | Ultra-low latency (<1ms) deterministic guardrails for PII redaction and SEBI policy enforcement. |
| **Deployment Platform** | **Render (Unified Web Service)** | Single unified Docker/Python service serving frontend and backend on one single URL. |

---

## 4. Ingested Data & Target Schemes

### AMC Selected: HDFC Mutual Fund
1. **HDFC Flexi Cap Fund** (Equity: Dynamic Market-Cap Allocation)
2. **HDFC Large Cap Fund** (Equity: Top 100 Bluechip Companies — *verified official rename from HDFC Top 100 Fund via Dec 24, 2024 AMC Addendum*)
3. **HDFC ELSS Tax Saver** (Equity Linked Savings Scheme: 3-Year Statutory Lock-in under Sec 80C)
4. **HDFC Mid-Cap Opportunities Fund** (Equity: Mid-Cap Growth Leaders)

### Verified Official Source Whitelist (24 HTTP 200 Documents):
* **HDFC AMC Official File Repository (`files.hdfcfund.com`):**
  * Scheme Information Documents (SIDs)
  * Key Information Memoranda (KIMs)
  * Statutory Addendums (Scheme Name Change circulars)
  * Monthly Portfolio Disclosures & Factsheets
* **SEBI Official Portal (`sebi.gov.in`):**
  * Master Circular for Mutual Funds (Categorization & Rationalization)
  * Riskometer norms (6-tier risk classification guidelines)
  * Valuation and TER expense ratio ceilings
* **AMFI India Portal (`amfiindia.com`):**
  * Consolidated Account Statement (CAS) download procedures
  * Investor education modules & KYC guidelines
  * Exit load and dividend distribution norms

*Zero third-party aggregator websites (Moneycontrol, ET Money, Value Research) are permitted in the knowledge base.*

---

## 5. Automated Evaluation & Verification

The project includes an automated test suite executed via `pytest` (`backend/tests/test_assistant.py`):

* **Factual Accuracy Tests (7 queries):** Verified expense ratio, minimum SIP, exit loads, riskometer, benchmark, lock-in period, and CAS statement.
* **Investment Advice Refusal Tests (5 queries):** Verified that queries like *"Should I buy?"* or *"Where should I invest?"* trigger polite refusals with educational links.
* **Return Speculation Tests:** Verified that CAGR and profit prediction queries are blocked with factsheet citations.
* **PII Redaction Tests (6 patterns):** Verified that PAN, Aadhaar, phone, email, OTP, and passwords trigger instant privacy warnings without being logged.
* **API Health & Validation Tests:** Verified `/api/health`, `/api/sources`, and `/api/ask` schemas.

**Test Result:** **24 out of 24 tests passing (100% test pass rate)**.

---

## 6. How to Run Locally

```bash
# 1. Clone repository
git clone https://github.com/juhimungle/NextLeap.git
cd NextLeap

# 2. Run backend & serve frontend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 3. Run automated tests
python -m pytest tests/test_assistant.py -v
```
Navigate to `http://localhost:8000` to interact with the full application.
