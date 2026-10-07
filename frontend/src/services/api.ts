import type {
  ChatResponse,
  DeleteDocumentResponse,
  DocumentListResponse,
  Message,
  UploadResponse,
} from "../types/chat";

const API_BASE_URL = "http://127.0.0.1:8000/api";

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (data.detail) {
      return JSON.stringify(data.detail);
    }
  } catch {
    // Ignore JSON parsing error
  }

  return fallback;
}

export async function uploadDocument(
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Document upload failed."
      )
    );
  }

  return response.json();
}

export async function getDocuments():
Promise<DocumentListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/documents`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Unable to load documents."
      )
    );
  }

  return response.json();
}

export async function deleteDocument(
  documentId: string
): Promise<DeleteDocumentResponse> {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Unable to delete document."
      )
    );
  }

  return response.json();
}

export async function sendChatMessage(
  documentId: string,
  messages: Message[]
): Promise<ChatResponse> {
  const cleanMessages = messages.map(
    (message) => ({
      role: message.role,
      content: message.content,
    })
  );

  const response = await fetch(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        document_id: documentId,
        messages: cleanMessages,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Unable to generate response."
      )
    );
  }

  return response.json();
}