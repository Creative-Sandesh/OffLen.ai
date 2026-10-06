from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.documents import router as document_router

app = FastAPI(
    title = "Offline AI learning API",
    description="Local AI learning assistant powered by ollama.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    chat_router,
    prefix="/api",
    tags=["Chat"],
)

app.include_router(
    document_router,
    prefix="/api/documents"
)