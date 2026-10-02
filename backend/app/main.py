import os
import csv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List

from app.config import settings
from app.schemas import AskRequest, AskResponse, SourceItem, HealthResponse
from app.rag import ask_assistant
from app.retrieval import get_collection

app = FastAPI(
    title="Facts-Only Mutual Fund Assistant",
    description="Factual, citation-backed RAG assistant for mutual fund schemes using official AMC, SEBI, and AMFI sources.",
    version="1.0.0"
)

# CORS enabled for development; in production frontend is served statically
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/ask", response_model=AskResponse)
def ask(req: AskRequest):
    """
    Primary Q&A endpoint.
    Performs PII scrubbing, advice/opinion refusal, performance filtering,
    context retrieval from ChromaDB, and grounded factual generation.
    """
    try:
        response = ask_assistant(req)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while answering your factual query: {str(e)}"
        )

@app.get("/api/health", response_model=HealthResponse)
def health():
    """Health check endpoint checking ChromaDB status."""
    try:
        collection = get_collection()
        count = collection.count()
        db_ready = True
    except Exception:
        count = 0
        db_ready = False

    return HealthResponse(
        status="healthy",
        version="1.0.0",
        database_ready=db_ready,
        document_count=count
    )

@app.get("/api/sources", response_model=List[SourceItem])
def get_sources():
    """Returns verified knowledge-base sources from sources.csv."""
    sources = []
    csv_candidates = [
        settings.SOURCES_CSV,
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sources.csv"),
        "sources.csv"
    ]
    
    csv_file = None
    for cand in csv_candidates:
        if os.path.exists(cand):
            csv_file = cand
            break

    if not csv_file:
        return []

    try:
        with open(csv_file, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                sources.append(SourceItem(
                    source_id=row.get("source_id", ""),
                    source_title=row.get("source_title", ""),
                    url=row.get("url", ""),
                    source_type=row.get("source_type", ""),
                    amc=row.get("amc", ""),
                    scheme=row.get("scheme", ""),
                    document_type=row.get("document_type", ""),
                    last_updated=row.get("last_updated", "")
                ))
    except Exception as e:
        print(f"[Error reading sources.csv]: {e}")

    return sources

# Mount frontend/dist if built (for single Render web service deployment)
frontend_dist_candidates = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist"),
    "frontend/dist"
]

frontend_dist = None
for cand in frontend_dist_candidates:
    if os.path.isdir(cand):
        frontend_dist = cand
        break

if frontend_dist and os.path.exists(os.path.join(frontend_dist, "index.html")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
