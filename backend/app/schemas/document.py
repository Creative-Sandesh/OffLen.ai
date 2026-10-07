from pydantic import BaseModel,Field

from uuid import UUID

class DocumentUploadResponse(BaseModel):
    document_id : str
    filename: str
    content_type: str
    characters : int
    
    chunks: int
    embeddings: int
    
    embedding_dimension: int
    
    stored_chunks:int
    vector_store_total:int
    
    status : str
    
class DocumentChunk(BaseModel):
    chunk_id:str
    document_id: str
    chunk_index: int
    text: str
    character_count: int
    
class SearchRequest(BaseModel):
    document_id: UUID
    query: str = Field(
        min_length=1,
        max_length=1000
    )
    n_results:int = Field(
        default=5,
        ge=1,
        le =20
    )
    
class SearchResult(BaseModel):
    chunk_id: str
    text:str
    document_id:str
    filename: str
    chunk_index: int
    distance: float
    similarity: float

class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
    
class DocumentSummary(BaseModel):
    document_id: str
    filename: str
    chunks: int
    
class DocumentListResponse(BaseModel):
    documents: list[DocumentSummary]

class DocumentDeleteResponse(BaseModel):
    document_id : str
    deleted_chunks: int
    status: str
    