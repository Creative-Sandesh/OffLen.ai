import asyncio

from uuid import UUID

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from app.schemas.document import (
    DocumentUploadResponse,
    DocumentSummary,
    DocumentDeleteResponse,
    DocumentListResponse,
    SearchResult,
    SearchRequest,
    SearchResponse,
)

from app.services.document_service import (
    process_document
)

from app.services.retrieval_service import (
    retrieve_relevant_chunks
)

from app.services.vector_store_service import (
    list_documents,
    delete_document_chunks,
    delete_document_file
)


router = APIRouter()


@router.post(
    "/upload",
    response_model=DocumentUploadResponse
)
async def upload_document(
    file: UploadFile = File(...)
):

    result = await process_document(
        file
    )

    chunks = result["chunks"]

    embedding_dimension = 0

    if chunks:
        embedding_dimension = len(
            chunks[0]["embedding"]
        )

    return DocumentUploadResponse(
        document_id=result["document_id"],
        filename=result["filename"],
        content_type=result["content_type"],
        characters=result["characters"],
        chunks=len(chunks),
        embeddings=len(chunks),
        embedding_dimension=embedding_dimension,
        stored_chunks=result["stored_chunks"],
        vector_store_total=result[
            "vector_store_total"
        ],
        status=result["status"]
    )


@router.get(
    "",
    response_model=DocumentListResponse
)
async def get_documents():

    documents = await asyncio.to_thread(
        list_documents
    )

    return DocumentListResponse(
        documents=[
            DocumentSummary(
                **document
            )
            for document in documents
        ]
    )


@router.delete(
    "/{document_id}",
    response_model=DocumentDeleteResponse
)
async def delete_document(
    document_id: UUID
):

    document_id_string = str(
        document_id
    )

    deleted_chunks = await asyncio.to_thread(
        delete_document_chunks,
        document_id_string
    )

    if deleted_chunks == 0:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    await asyncio.to_thread(
        delete_document_file,
        document_id_string
    )

    return DocumentDeleteResponse(
        document_id=document_id_string,
        deleted_chunks=deleted_chunks,
        status="deleted"
    )


@router.post(
    "/search",
    response_model=SearchResponse
)
async def search_documents(
    request: SearchRequest
):

    results = await asyncio.to_thread(
        retrieve_relevant_chunks,
        query=request.query,
        document_id=str(
            request.document_id
        ),
        n_results=request.n_results
    )

    search_results = []

    for result in results:

        metadata = result[
            "metadata"
        ]

        search_results.append(
            SearchResult(
                chunk_id=result[
                    "chunk_id"
                ],

                text=result[
                    "text"
                ],

                document_id=metadata[
                    "document_id"
                ],

                filename=metadata[
                    "filename"
                ],

                chunk_index=metadata[
                    "chunk_index"
                ],

                distance=result[
                    "distance"
                ],

                similarity=result[
                    "similarity"
                ]
            )
        )

    return SearchResponse(
        query=request.query,
        results=search_results
    )