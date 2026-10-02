import pytest
import re
from fastapi.testclient import TestClient
from app.main import app
from app.schemas import AskRequest, AskResponse
from app.rag import ask_assistant

client = TestClient(app)

def count_sentences(text: str) -> int:
    """Helper to count sentences in answer text."""
    parts = re.split(r'(?<=[.!?])\s+', text.strip())
    return len([p for p in parts if p.strip()])

# ==================================================
# 1. FACTUAL QUERIES TEST
# ==================================================
@pytest.mark.parametrize("query,expected_keyword", [
    ("What is the expense ratio of HDFC Flexi Cap Fund?", "expense ratio"),
    ("What is the minimum SIP amount for HDFC Flexi Cap Fund?", "sip"),
    ("What is the exit load for HDFC Flexi Cap Fund?", "exit load"),
    ("What is the riskometer of HDFC Large Cap Fund?", "risk"),
    ("What is the benchmark of HDFC Flexi Cap Fund?", "benchmark"),
    ("What is the lock-in period for HDFC ELSS Tax Saver?", "3 year"),
    ("How to download capital-gains statement or CAS?", "statement")
])
def test_factual_queries(query, expected_keyword):
    req = AskRequest(question=query)
    resp = ask_assistant(req)
    
    assert resp.type in ["answer", "unverified"], f"Expected answer or unverified, got {resp.type}"
    assert resp.source_url.startswith("http"), "Must have a valid source URL"
    assert resp.source_title, "Must have a source title"
    assert resp.last_updated, "Must have a last_updated date"
    assert count_sentences(resp.answer) <= 3, f"Answer exceeded 3 sentences: {resp.answer}"
    if resp.type == "answer":
        assert expected_keyword.lower() in resp.answer.lower() or "official" in resp.answer.lower()

# ==================================================
# 2. INVESTMENT ADVICE REFUSAL TEST
# ==================================================
@pytest.mark.parametrize("query", [
    "Should I buy HDFC Flexi Cap Fund right now?",
    "Which fund is best for high returns?",
    "Should I sell my mutual funds today?",
    "Where should I invest 50000 rupees?",
    "Can you recommend the safest mutual fund scheme for me?"
])
def test_advice_refusal(query):
    req = AskRequest(question=query)
    resp = ask_assistant(req)
    
    assert resp.type == "refusal", f"Expected refusal for advice query, got {resp.type}"
    assert "cannot provide investment advice" in resp.answer.lower() or "does not calculate" in resp.answer.lower()
    assert resp.source_url.startswith("http"), "Must provide official educational link"
    assert count_sentences(resp.answer) <= 3

# ==================================================
# 3. UNKNOWN / OUT OF CORPUS TEST (NO HALLUCINATION)
# ==================================================
def test_unknown_query_no_hallucination():
    query = "What is the secret cooking recipe and alien spacecraft protocol in HDFC fund?"
    req = AskRequest(question=query)
    resp = ask_assistant(req)
    
    assert resp.type == "unverified" or "couldn't verify" in resp.answer.lower()
    assert count_sentences(resp.answer) <= 3
    assert resp.source_url.startswith("http")

# ==================================================
# 4. PII PROTECTION TEST
# ==================================================
@pytest.mark.parametrize("pii_query", [
    "My PAN is ABCDE1234F, can you check my balance?",
    "My Aadhaar is 1234 5678 9012, tell me my folio",
    "Call me at +91 9876543210 for fund details",
    "My email is testuser@example.com, send statement",
    "My OTP is 849201, verify it please",
    "What is the admin password for login?"
])
def test_pii_detection(pii_query):
    req = AskRequest(question=pii_query)
    resp = ask_assistant(req)
    
    assert resp.type == "pii_warning", f"Expected pii_warning, got {resp.type}"
    assert "do not share personal information" in resp.answer.lower()
    # Critical: Check that user's PII string is NOT echoed back in the response
    assert "ABCDE1234F" not in resp.answer
    assert "9876543210" not in resp.answer
    assert "testuser@example.com" not in resp.answer
    assert "849201" not in resp.answer

# ==================================================
# 5. API ENDPOINTS & VALIDATION TESTS
# ==================================================
def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_ready"] is True
    assert data["document_count"] > 0

def test_api_sources():
    response = client.get("/api/sources")
    assert response.status_code == 200
    sources = response.json()
    assert len(sources) >= 15, f"Expected at least 15 sources, got {len(sources)}"
    for s in sources:
        assert s["url"].startswith("http")
        assert s["source_type"] in ["AMC", "SEBI", "AMFI"]

def test_api_ask_validation_empty():
    # Empty string should fail with 422
    response = client.post("/api/ask", json={"question": ""})
    assert response.status_code == 422

def test_api_ask_validation_whitespace():
    # Whitespace only should fail with 422
    response = client.post("/api/ask", json={"question": "    "})
    assert response.status_code == 422

def test_api_ask_valid():
    response = client.post("/api/ask", json={
        "question": "What is the ELSS lock-in period?",
        "scheme": "HDFC ELSS Tax Saver"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "answer"
    assert data["source_url"].startswith("http")
    assert len(data["source_title"]) > 0
    assert len(data["last_updated"]) > 0
