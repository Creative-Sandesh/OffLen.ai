from fastapi import APIRouter, HTTPException
import httpx

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,ChatSource
)

from app.services.rag_service import (
    generate_rag_response
)


router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):
    try:
        messages = [
            message.model_dump()
            for message in request.messages
        ]

        document_id = str(
            request.document_id
        )
        
        answer, retrieved_chunks = (
            await generate_rag_response(
                messages=messages,
                document_id=document_id
            )
        )
        sources = []

        for chunk in retrieved_chunks:
            metadata = chunk["metadata"]

            sources.append(
                    ChatSource(
                        chunk_id=chunk["chunk_id"],
                        document_id=metadata["document_id"],
                        filename=metadata["filename"],
                        chunk_index=metadata["chunk_index"],
                        similarity=round(
                            chunk["similarity"],
                            4
                        )
                    )
                )  
        
        return ChatResponse(
            answer=answer,
            sources=sources
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to connect to Ollama. "
                "Make sure Ollama is running."
            )
        )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Ollama request timed out."
        )
        
    except httpx.HTTPStatusError as error:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama returned an error: {error.response.status_code}",
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server error: {str(error)}",
        )
    