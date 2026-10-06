from fastapi import APIRouter, HTTPException
import httpx


from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ollama_service import generate_response

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        messages = [
            message.model_dump()
            for message in request.messages
        ]
        
        answer = await generate_response(messages)
        return ChatResponse(
            answer = answer
        )
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Ollama. Make sure ollama is running.",
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