import asyncio

from app.services.retrieval_service import retrieve_relevant_chunks
from app.services.ollama_service import generate_response


TOP_K = 5

MIN_SIMILARITY = 0.35


NO_CONTEXT_RESPONSE = (
    "I don't have enough information in the selected "
    "document to answer that."
)


def build_retrieval_query(
    messages: list[dict]
) -> str:

    user_messages = [
        message["content"]
        for message in messages
        if message["role"] == "user"
    ]

    if not user_messages:
        raise ValueError(
            "No user message found."
        )

    recent_messages = user_messages[-2:]

    return "\n".join(
        recent_messages
    )


def filter_relevant_chunks(
    retrieved_chunks: list[dict],
    min_similarity: float = MIN_SIMILARITY
) -> list[dict]:

    return [
        chunk
        for chunk in retrieved_chunks
        if chunk["similarity"] >= min_similarity
    ]


def build_context(
    retrieved_chunks: list[dict]
) -> str:

    context_parts = []

    for index, chunk in enumerate(
        retrieved_chunks,
        start=1
    ):
        metadata = chunk["metadata"]

        context_part = (
            f"[Context {index}]\n"
            f"Source: {metadata['filename']}\n"
            f"Chunk: {metadata['chunk_index']}\n"
            f"{chunk['text']}"
        )

        context_parts.append(
            context_part
        )

    return "\n\n".join(
        context_parts
    )


def build_system_prompt(
    context: str
) -> str:

    return f"""
You are a document-grounded AI assistant.

Use the retrieved document context below as the factual
source for answering the user's question.

Rules:
1. Use only the retrieved document context as the factual source.
2. Do not invent facts.
3. If the context is insufficient, clearly say that the selected
   document does not contain enough information.
4. Be clear and concise.
5. Previous conversation may only be used to understand intent.
6. Previous assistant responses are not authoritative evidence.
7. Do not invent filenames, citations, or sources.

Retrieved document context:

{context}
""".strip()


async def generate_rag_response(
    messages: list[dict],
    document_id: str
):

    retrieval_query = build_retrieval_query(
        messages
    )

    retrieved_chunks = await asyncio.to_thread(
        retrieve_relevant_chunks,
        query=retrieval_query,
        document_id=document_id,
        n_results=TOP_K
    )

    relevant_chunks = filter_relevant_chunks(
        retrieved_chunks
    )

    if not relevant_chunks:
        return (
            NO_CONTEXT_RESPONSE,
            []
        )

    context = build_context(
        relevant_chunks
    )

    system_prompt = build_system_prompt(
        context
    )

    ollama_messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        *messages
    ]

    answer = await generate_response(
        ollama_messages
    )

    return (
        answer,
        relevant_chunks
    )