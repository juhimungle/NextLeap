import os
import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any, Optional
from app.config import settings
from app.embeddings import embedding_function

COLLECTION_NAME = "mf_facts"

def get_chroma_client():
    os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
    return chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIRECTORY)

def get_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_function,
        metadata={"hnsw:space": "cosine"}
    )

def detect_scheme_from_query(query: str, explicit_scheme: Optional[str] = None) -> Optional[str]:
    """Detects scheme from explicit user choice or text pattern."""
    if explicit_scheme and explicit_scheme != "All schemes" and explicit_scheme.strip():
        return explicit_scheme.strip()

    q_lower = query.lower()
    if "flexi" in q_lower:
        return "HDFC Flexi Cap Fund"
    elif "large" in q_lower or "top 100" in q_lower or "top100" in q_lower:
        return "HDFC Large Cap Fund"
    elif "elss" in q_lower or "tax saver" in q_lower or "taxsaver" in q_lower:
        return "HDFC ELSS Tax Saver"
    elif "mid cap" in q_lower or "midcap" in q_lower or "mid-cap" in q_lower:
        return "HDFC Mid-Cap Opportunities Fund"
    return None

def retrieve_context(
    query: str,
    scheme_filter: Optional[str] = None,
    top_k: int = 4
) -> List[Dict[str, Any]]:
    """
    Retrieves top relevant chunks from ChromaDB with metadata.
    """
    collection = get_collection()
    if collection.count() == 0:
        return []

    detected_scheme = detect_scheme_from_query(query, scheme_filter)
    
    where_filter = None
    if detected_scheme:
        # Match scheme-specific documents or general all-schemes documents
        where_filter = {
            "$or": [
                {"scheme": detected_scheme},
                {"scheme": "All schemes"}
            ]
        }

    try:
        results = collection.query(
            query_texts=[query],
            n_results=min(top_k, collection.count()),
            where=where_filter,
            include=["documents", "metadatas", "distances"]
        )
    except Exception as e:
        print(f"[Query with filter error: {e}] Retrying without filter...")
        results = collection.query(
            query_texts=[query],
            n_results=min(top_k, collection.count()),
            include=["documents", "metadatas", "distances"]
        )

    chunks = []
    if results and "documents" in results and results["documents"]:
        docs = results["documents"][0]
        metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
        dists = results["distances"][0] if "distances" in results else [0.0] * len(docs)

        for doc, meta, dist in zip(docs, metas, dists):
            chunks.append({
                "content": doc,
                "metadata": meta,
                "distance": dist,
                # Cosine distance to similarity: similarity = 1 - distance
                "similarity": 1.0 - dist if dist is not None else 1.0
            })

    return chunks
