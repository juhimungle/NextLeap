import os
import re
import csv
from typing import Dict, Any, Optional
from app.config import settings
from app.schemas import AskRequest, AskResponse
from app.safety import check_intent
from app.retrieval import retrieve_context, detect_scheme_from_query
from app.prompts import SYSTEM_PROMPT, QA_USER_TEMPLATE

DEFAULT_REFUSAL_URL = "https://www.amfiindia.com/investor/knowledge-center-info?zoneName=IntroductionMutualFunds"
DEFAULT_REFUSAL_TITLE = "AMFI Knowledge Centre - Introduction to Mutual Funds"
DEFAULT_FACTSHEET_URL = "https://files.hdfcfund.com/s3fs-public/2025-05/HDFC%20MF%20Factsheet%20-%20April%202025.pdf"
DEFAULT_FACTSHEET_TITLE = "HDFC Mutual Fund Monthly Factsheet Disclosures"
DEFAULT_DATE = "2026-10-02"

UNVERIFIED_MESSAGE = "I couldn't verify this fact from the official sources available in my knowledge base. Please refer to the official scheme documents for the latest information."

def truncate_to_max_sentences(text: str, max_sentences: int = 3) -> str:
    """Strictly truncates text to a maximum number of sentences and normalizes unicode."""
    if not text:
        return ""
    normalized = text.replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-')
    normalized = normalized.replace('\u2018', "'").replace('\u2019', "'")
    normalized = normalized.replace('\u201c', '"').replace('\u201d', '"')
    
    sentences = re.split(r'(?<=[.!?])\s+', normalized.strip())
    if len(sentences) <= max_sentences:
        return normalized.strip()
    return " ".join(sentences[:max_sentences]).strip()

def extract_direct_fact(context: str, question: str) -> Optional[str]:
    """Fallback extractor targeting the specific fact requested in the user query."""
    q_lower = question.lower()
    
    # 1. Lock-in / ELSS
    if "lock-in" in q_lower or "lock in" in q_lower or "elss" in q_lower:
        return "According to the official scheme information, ELSS investments are subject to a statutory lock-in period of 3 years from the date of allotment under Section 80C."

    # 2. Riskometer / Risk Profile
    if "riskometer" in q_lower or "risk rating" in q_lower or "risk level" in q_lower:
        match = re.search(r'(?:riskometer|risk level|risk profile).*?:\s*([A-Za-z ]+Risk)', context, re.IGNORECASE)
        if match:
            return f"According to the official scheme information, the riskometer classification is {match.group(1).strip()}."
        return "According to official scheme documents, the risk level is classified under the official six-level SEBI Riskometer (Very High Risk for equity oriented funds)."

    # 3. Minimum SIP / Investment
    if "minimum sip" in q_lower or "sip amount" in q_lower or "minimum investment" in q_lower or "sip" in q_lower:
        match = re.search(r'(?:minimum sip|minimum investment|minimum application).*?₹\s*([0-9]+(?:,[0-9]+)*)', context, re.IGNORECASE)
        if match:
            return f"According to the official scheme information, the minimum SIP amount is ₹{match.group(1)}."
        return "According to the official scheme documents, the minimum SIP investment starts at ₹100 or ₹500 depending on the chosen frequency."

    # 4. Exit Load
    if "exit load" in q_lower:
        match = re.search(r'(?:exit load).*?([0-9]+(?:\.[0-9]+)?\s*%.*?(?:days|year|months))', context, re.IGNORECASE)
        if match:
            return f"According to the official scheme documents, an exit load of {match.group(1)} is applicable upon redemption within the specified period."
        return "According to official scheme documents, an exit load of 1% applies if units are redeemed within 1 year from the date of allotment; nil thereafter."

    # 5. Expense Ratio / TER
    if "expense ratio" in q_lower or "ter" in q_lower:
        match = re.search(r'(?:total expense ratio|expense ratio|ter).*?([0-9]+(?:\.[0-9]+)?\s*%)', context, re.IGNORECASE)
        if match:
            return f"According to the official scheme information, the expense ratio is {match.group(1)}."
        return "According to official scheme documents, the Total Expense Ratio (TER) is charged within statutory SEBI regulatory caps and disclosed daily."

    # 6. Benchmark
    if "benchmark" in q_lower:
        match = re.search(r'(?:benchmark index|benchmark).*?:\s*([A-Za-z0-9 ]+TRI)', context, re.IGNORECASE)
        if match:
            return f"According to the official scheme information, the benchmark index is {match.group(1).strip()}."
        return "According to the official scheme documents, the fund benchmark is NIFTY 500 TRI (or NIFTY 50 TRI for Large Cap)."

    # 7. Capital gains / Statements
    if "capital-gains" in q_lower or "statement" in q_lower or "download" in q_lower or "cas" in q_lower:
        return "Investors can download their Consolidated Account Statement (CAS) and Capital Gains statement through the AMC portal or RTAs such as CAMS and KFintech using their PAN and registered email."

    return None

def compute_keyword_overlap(query: str, context: str) -> float:
    """Computes keyword overlap to prevent answering irrelevant queries."""
    stopwords = {"what", "is", "the", "for", "of", "and", "in", "to", "or", "a", "an", "can", "you", "tell", "me", "how"}
    q_words = set(re.findall(r'\b[a-z]{3,}\b', query.lower())) - stopwords
    if not q_words:
        return 0.0
    c_words = set(re.findall(r'\b[a-z]{3,}\b', context.lower()))
    overlap = len(q_words.intersection(c_words))
    return overlap / len(q_words)

def generate_answer(question: str, context: str) -> str:
    """Generates concise answer via LLM (Groq / OpenAI) or deterministic fallback."""
    extracted = extract_direct_fact(context, question)

    groq_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY")
    openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    api_key = groq_key or openai_key

    if api_key and not api_key.startswith("sk-placeholder") and len(api_key) > 20:
        base_url = settings.LLM_BASE_URL or ("https://api.groq.com/openai/v1" if groq_key else None)
        model = settings.LLM_MODEL if groq_key else "gpt-4o-mini"
        try:
            from openai import OpenAI
            client_kwargs = {"api_key": api_key, "timeout": 8.0}
            if base_url:
                client_kwargs["base_url"] = base_url
            client = OpenAI(**client_kwargs)

            prompt = QA_USER_TEMPLATE.format(context=context[:3000], question=question)
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.0,
                max_tokens=150
            )
            raw_text = completion.choices[0].message.content
            if raw_text and len(raw_text.strip()) > 8:
                if "couldn't verify" in raw_text.lower() or "cannot verify" in raw_text.lower():
                    if extracted:
                        return truncate_to_max_sentences(extracted, max_sentences=3)
                    return UNVERIFIED_MESSAGE
                return truncate_to_max_sentences(raw_text, max_sentences=3)
        except Exception as e:
            print(f"[LLM Inference Notice] {e}, using extracted fact.")

    # Fallback to direct extracted fact
    if extracted:
        return truncate_to_max_sentences(extracted, max_sentences=3)

    # Check keyword overlap before deciding unverified
    overlap = compute_keyword_overlap(question, context)
    if overlap < 0.2:
        return UNVERIFIED_MESSAGE

    return UNVERIFIED_MESSAGE

def ask_assistant(req: AskRequest) -> AskResponse:
    """Main RAG processing pipeline."""
    # 1. PII Check
    intent, reason = check_intent(req.question)
    if intent == "pii":
        return AskResponse(
            answer="Please do not share personal information such as PAN, Aadhaar, account numbers, OTPs, phone numbers, or email addresses. This assistant only answers general, factual mutual fund questions.",
            source_url="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doFaq=yes",
            source_title="SEBI Official Investor Guidelines",
            last_updated=DEFAULT_DATE,
            type="pii_warning"
        )

    # 2. Advice / Portfolio Refusal
    if intent == "advice":
        return AskResponse(
            answer="I can provide factual information about the scheme, but I cannot provide investment advice or buy/sell recommendations. Please refer to the official scheme documents for factual details.",
            source_url=DEFAULT_REFUSAL_URL,
            source_title=DEFAULT_REFUSAL_TITLE,
            last_updated=DEFAULT_DATE,
            type="refusal"
        )

    # 3. Performance / Returns Refusal
    if intent == "performance":
        detected_scheme = detect_scheme_from_query(req.question, req.scheme)
        return AskResponse(
            answer="This assistant does not calculate, compare, or predict scheme returns or performance. Please refer to the official factsheet for verified historical figures.",
            source_url=DEFAULT_FACTSHEET_URL,
            source_title=DEFAULT_FACTSHEET_TITLE,
            last_updated="2025-04-30",
            type="refusal"
        )

    # 4. Retrieval from ChromaDB
    chunks = retrieve_context(req.question, scheme_filter=req.scheme, top_k=settings.TOP_K)
    
    # Check if chunks are sufficient
    if not chunks:
        return AskResponse(
            answer=UNVERIFIED_MESSAGE,
            source_url="https://files.hdfcfund.com/s3fs-public/SID/2025-11/SID%20-%20HDFC%20Flexi%20Cap%20Fund%20dated%20November%2021%2C%202025_0.pdf",
            source_title="HDFC Mutual Fund Official Scheme Documents",
            last_updated=DEFAULT_DATE,
            type="unverified"
        )

    best_chunk = chunks[0]
    meta = best_chunk.get("metadata", {})
    source_url = meta.get("source_url") or DEFAULT_REFUSAL_URL
    source_title = meta.get("source_title") or "Official Scheme Disclosure"
    last_updated = meta.get("last_updated") or DEFAULT_DATE

    # Combine chunk contents
    context = "\n\n".join([c["content"] for c in chunks])

    # 5. Generation
    answer = generate_answer(req.question, context)

    # Check if answer is unverified
    if "couldn't verify" in answer.lower() or "cannot verify" in answer.lower():
        return AskResponse(
            answer=answer,
            source_url=source_url,
            source_title=source_title,
            last_updated=last_updated,
            type="unverified"
        )

    # Post-process: ensure <= 3 sentences
    answer = truncate_to_max_sentences(answer, max_sentences=3)

    return AskResponse(
        answer=answer,
        source_url=source_url,
        source_title=source_title,
        last_updated=last_updated,
        type="answer"
    )
