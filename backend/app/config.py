import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    OPENAI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    LLM_BASE_URL: Optional[str] = None
    LLM_MODEL: str = "openai/gpt-oss-20b"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    CHROMA_PERSIST_DIRECTORY: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "chroma_db"
    )
    DATA_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data"
    )
    SOURCES_CSV: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "sources.csv"
    )
    SIMILARITY_THRESHOLD: float = 0.25
    TOP_K: int = 4

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
