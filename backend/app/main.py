from fastapi import FastAPI

from app.api.chat import router as chat_router

app = FastAPI(
    title = "Offline AI learning API",
    description="Local AI learning assistant powered by ollama.",
    version="1.0.0",
)

@app.get("/")
async def root():
    return{
        "message":  "Offile AI learning API is running"
    }
    
@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }

app.include_router(
    chat_router,prefix="/api",
    tags=["Chat"],
)