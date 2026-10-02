import os
import sys
import csv
import time
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Ensure parent directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.embeddings import embedding_function
from app.retrieval import get_chroma_client, COLLECTION_NAME

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def clean_html_text(html_content: bytes) -> str:
    """Extracts and cleans body text from HTML, removing headers, footers, scripts."""
    soup = BeautifulSoup(html_content, 'html.parser')
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'noscript', 'aside', 'svg']):
        tag.decompose()
    
    # Target main content container if available
    main_elem = soup.find('main') or soup.find('article') or soup.find('body')
    if main_elem:
        text = main_elem.get_text(separator=' ', strip=True)
    else:
        text = soup.get_text(separator=' ', strip=True)

    # Normalize whitespace
    cleaned = ' '.join(text.split())
    return cleaned

def extract_pdf_pages(file_path: str):
    """Extracts text page by page from a PDF file."""
    reader = PdfReader(file_path)
    pages_text = []
    # For very large PDFs (like 200-page factsheet), focus on first 25 pages to avoid memory bloat
    max_pages = min(len(reader.pages), 25)
    for idx in range(max_pages):
        try:
            page = reader.pages[idx]
            txt = page.extract_text() or ""
            cleaned = ' '.join(txt.split())
            if cleaned:
                pages_text.append((idx + 1, cleaned))
        except Exception as e:
            print(f"  Warning: failed reading page {idx+1}: {e}")
    return pages_text

def run_ingest():
    print("==================================================")
    print("   FACTS-ONLY MUTUAL FUND ASSISTANT - INGESTION   ")
    print("==================================================")
    
    csv_candidates = [
        settings.SOURCES_CSV,
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "sources.csv"),
        "sources.csv"
    ]
    csv_path = None
    for cand in csv_candidates:
        if os.path.exists(cand):
            csv_path = cand
            break

    if not csv_path:
        print(f"Error: sources.csv not found in candidate paths: {csv_candidates}")
        return

    doc_dir = os.path.join(settings.DATA_DIR, "documents")
    os.makedirs(doc_dir, exist_ok=True)
    os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)

    # Read sources
    sources = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sources.append(row)

    print(f"Found {len(sources)} sources to ingest from {csv_path}.\n")

    # Initialize ChromaDB client and recreate collection for clean state
    client = get_chroma_client()
    try:
        client.delete_collection(name=COLLECTION_NAME)
        print(f"Reset existing collection '{COLLECTION_NAME}'.")
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_function,
        metadata={"hnsw:space": "cosine"}
    )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,   # ~500-600 tokens
        chunk_overlap=300, # ~75-100 tokens
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    all_chunks = []
    all_metadatas = []
    all_ids = []

    successful_docs = 0
    failed_sources = []

    for idx, src in enumerate(sources, 1):
        source_id = src["source_id"]
        url = src["url"]
        title = src["source_title"]
        doc_type = src["document_type"]
        is_pdf = url.lower().endswith(".pdf") or "pdf" in doc_type.lower()
        ext = ".pdf" if is_pdf else ".html"
        cached_file = os.path.join(doc_dir, f"{source_id}{ext}")

        print(f"[{idx}/{len(sources)}] Processing: {source_id} - {title[:40]}...")

        # 1. Download or use cache
        if not os.path.exists(cached_file) or os.path.getsize(cached_file) == 0:
            try:
                print(f"  Downloading from {url}...")
                resp = requests.get(url, headers=HEADERS, timeout=25, stream=True)
                if resp.status_code != 200:
                    print(f"  Failed download: HTTP {resp.status_code}")
                    failed_sources.append((source_id, f"HTTP {resp.status_code}"))
                    continue
                with open(cached_file, "wb") as f_out:
                    f_out.write(resp.content)
            except Exception as e:
                print(f"  Download error: {e}")
                failed_sources.append((source_id, str(e)))
                continue

        # 2. Extract text & chunk
        try:
            if is_pdf:
                pages = extract_pdf_pages(cached_file)
                doc_chunk_count = 0
                for page_num, page_text in pages:
                    splits = splitter.split_text(page_text)
                    for chunk_idx, text_chunk in enumerate(splits):
                        chunk_id = f"{source_id}_p{page_num}_c{chunk_idx}"
                        all_chunks.append(text_chunk)
                        all_ids.append(chunk_id)
                        all_metadatas.append({
                            "source_id": source_id,
                            "source_url": url,
                            "source_title": title,
                            "amc": src.get("amc", "HDFC Mutual Fund"),
                            "scheme": src.get("scheme", "All schemes"),
                            "document_type": doc_type,
                            "page_number": page_num,
                            "last_updated": src.get("last_updated", "2026-10-02")
                        })
                        doc_chunk_count += 1
                print(f"  Extracted {len(pages)} pages -> {doc_chunk_count} chunks.")
            else:
                with open(cached_file, "rb") as f_in:
                    raw_html = f_in.read()
                clean_txt = clean_html_text(raw_html)
                splits = splitter.split_text(clean_txt)
                for chunk_idx, text_chunk in enumerate(splits):
                    chunk_id = f"{source_id}_c{chunk_idx}"
                    all_chunks.append(text_chunk)
                    all_ids.append(chunk_id)
                    all_metadatas.append({
                        "source_id": source_id,
                        "source_url": url,
                        "source_title": title,
                        "amc": src.get("amc", "HDFC Mutual Fund"),
                        "scheme": src.get("scheme", "All schemes"),
                        "document_type": doc_type,
                        "page_number": 1,
                        "last_updated": src.get("last_updated", "2026-10-02")
                    })
                print(f"  Extracted HTML text -> {len(splits)} chunks.")

            successful_docs += 1
        except Exception as e:
            print(f"  Extraction error: {e}")
            failed_sources.append((source_id, f"Extraction error: {e}"))

    # 3. Add to ChromaDB in batches
    total_chunks = len(all_chunks)
    print(f"\nStoring {total_chunks} chunks into ChromaDB...")
    batch_size = 80
    for i in range(0, total_chunks, batch_size):
        end = min(i + batch_size, total_chunks)
        collection.add(
            ids=all_ids[i:end],
            documents=all_chunks[i:end],
            metadatas=all_metadatas[i:end]
        )
        print(f"  Indexed batch {i+1} to {end} / {total_chunks}")

    print("\n==================================================")
    print("               INGESTION COMPLETE                 ")
    print("==================================================")
    print(f"Successfully processed: {successful_docs} / {len(sources)} documents")
    print(f"Total vector chunks stored: {collection.count()}")
    if failed_sources:
        print(f"Failed sources ({len(failed_sources)}):")
        for fid, msg in failed_sources:
            print(f"  - {fid}: {msg}")
    else:
        print("Failed sources: None (100% success)")
    print("==================================================")

if __name__ == "__main__":
    run_ingest()
