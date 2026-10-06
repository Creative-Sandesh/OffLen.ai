from pydantic import BaseModel

class DocumentUploadResponse(BaseModel):
    document_id : str
    filename: str
    content_type: str
    characters : int
    chunks: int
    status : str
    
class DocumentChunk(BaseModel):
    chunk_id:str
    document_id: str
    chunk_index: int
    text: str
    character_count: int