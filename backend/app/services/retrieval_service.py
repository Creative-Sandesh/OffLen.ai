from app.services.embedding_service import generate_query_embedding
from app.services.vector_store_service import search_chunks


def retrieve_relevant_chunks(
    query: str,
    document_id: str,
    n_results: int = 5
) -> list[dict]:

    if not query.strip():
        return []

    query_embedding = generate_query_embedding(
        query
    )

    results = search_chunks(
        query_embedding=query_embedding,
        document_id=document_id,
        n_results=n_results
    )

    return results