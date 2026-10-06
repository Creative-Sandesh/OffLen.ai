from fastapi import APIRouter, UploadFile, File

from app.schemas.document import DocumentUploadResponse
from app.services.document_service import process_document

router = APIRouter()

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    result = await process_document(file)
    
    
    chunks = result["chunks"]
    embedding_dimension =0
    
    if chunks: 
        embedding_dimension = len(chunks[0]["embedding"])
        
        
    return DocumentUploadResponse(
        document_id=result["document_id"],
        filename=result["filename"],
        content_type=result["content_type"],
        characters=result["characters"],
        chunks=len(result["chunks"]),
        embeddings=len(chunks),
        embedding_dimension=embedding_dimension,
        status=result["status"]
    )
