from uuid import UUID

from typing import Literal

from pydantic import (
    BaseModel,
    Field
)


class ChatMessage(BaseModel):

    role: Literal[
        "user",
        "assistant"
    ]

    content: str = Field(
        min_length=1,
        max_length=5000
    )


class ChatRequest(BaseModel):

    document_id: UUID

    messages: list[
        ChatMessage
    ] = Field(
        min_length=1,
        max_length=20
    )


class ChatSource(BaseModel):

    chunk_id: str
    document_id: str
    filename: str
    chunk_index: int
    similarity: float


class ChatResponse(BaseModel):

    answer: str

    sources: list[
        ChatSource
    ] = Field(
        default_factory=list
    )