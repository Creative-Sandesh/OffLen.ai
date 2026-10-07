export type MessageRole = "user" | "assistant";

export interface Source {
  chunk_id: string;
  document_id: string;
  filename: string;
  chunk_index: number;
  similarity: number;
}

export interface Message {
  role: MessageRole;
  content: string;
  sources?: Source[];
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

export interface UploadResponse {
  document_id: string;
  filename: string;
  content_type: string;
  characters: number;
  chunks: number;
  embeddings: number;
  embedding_dimension: number;
  stored_chunks: number;
  vector_store_total: number;
  status: string;
}

export interface DocumentSummary {
  document_id: string;
  filename: string;
  chunks: number;
}

export interface DocumentListResponse {
  documents: DocumentSummary[];
}

export interface DeleteDocumentResponse {
  document_id: string;
  deleted_chunks: number;
  status: string;
}