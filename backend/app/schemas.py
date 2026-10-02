from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal, List

class AskRequest(BaseModel):
    question: str = Field(..., max_length=500, description="User question (factual query)")
    scheme: Optional[str] = Field(None, description="Optional scheme name filter")

    @field_validator("question")
    @classmethod
    def validate_question(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Question cannot be empty or whitespace only.")
        return trimmed

class AskResponse(BaseModel):
    answer: str
    source_url: str
    source_title: str
    last_updated: str
    type: Literal["answer", "refusal", "pii_warning", "unverified"]

class SourceItem(BaseModel):
    source_id: str
    source_title: str
    url: str
    source_type: str
    amc: str
    scheme: str
    document_type: str
    last_updated: str

class HealthResponse(BaseModel):
    status: str
    version: str
    database_ready: bool
    document_count: int
