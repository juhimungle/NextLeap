import os
import hashlib
import numpy as np
from typing import List
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings
from app.config import settings

class DualEmbeddingFunction(EmbeddingFunction):
    """
    Embedding function that uses OpenAI text-embedding-3-small when OPENAI_API_KEY
    is configured, with a deterministic fallback vectorizer for local/offline testing.
    """
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
        self.model = settings.EMBEDDING_MODEL
        self._openai_client = None
        if self.api_key and not self.api_key.startswith("sk-placeholder") and len(self.api_key) > 20:
            try:
                from openai import OpenAI
                self._openai_client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"[Embedding Warning] Could not init OpenAI client: {e}")

    def __call__(self, input: Documents) -> Embeddings:
        if self._openai_client:
            try:
                # Replace newlines for cleaner embedding representation
                cleaned_input = [text.replace("\n", " ") for text in input]
                response = self._openai_client.embeddings.create(
                    input=cleaned_input,
                    model=self.model
                )
                return [item.embedding for item in response.data]
            except Exception as e:
                print(f"[Embedding Error] OpenAI embedding failed ({e}), falling back to deterministic vectorizer.")

        # Deterministic 1536-dimensional pseudo-embedding fallback
        embeddings = []
        for text in input:
            embeddings.append(self._deterministic_vector(text, dim=1536))
        return embeddings

    def _deterministic_vector(self, text: str, dim: int = 1536) -> List[float]:
        """Generates a deterministic unit vector from text tokens for local search."""
        vec = np.zeros(dim, dtype=np.float32)
        words = text.lower().split()
        for i, word in enumerate(words):
            h = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
            idx = h % dim
            sign = 1.0 if ((h >> 8) & 1) else -1.0
            vec[idx] += sign * (1.0 / (1.0 + i * 0.05))
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

embedding_function = DualEmbeddingFunction()
