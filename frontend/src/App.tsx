import {
  useEffect,
  useState,
} from "react";

import ChatBox from "./components/ChatBox";
import DocumentList from "./components/DocumentList";
import DocumentUpload from "./components/DocumentUpload";

import {
  deleteDocument,
  getDocuments,
} from "./services/api";

import type {
  DocumentSummary,
  UploadResponse,
} from "./types/chat";

import "./App.css";

function App() {
  const [documents, setDocuments] =
    useState<DocumentSummary[]>([]);

  const [
    activeDocumentId,
    setActiveDocumentId,
  ] = useState<string | null>(null);

  const [
    loadingDocuments,
    setLoadingDocuments,
  ] = useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoadingDocuments(true);
      setError("");

      const response =
        await getDocuments();

      setDocuments(
        response.documents
      );

      if (
        response.documents.length > 0
      ) {
        setActiveDocumentId(
          response.documents[0]
            .document_id
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load documents."
      );
    } finally {
      setLoadingDocuments(false);
    }
  }

  function handleUploadSuccess(
    uploaded: UploadResponse
  ) {
    const newDocument:
      DocumentSummary = {
      document_id:
        uploaded.document_id,

      filename:
        uploaded.filename,

      chunks:
        uploaded.chunks,
    };

    setDocuments((previous) => [
      newDocument,
      ...previous.filter(
        (document) =>
          document.document_id !==
          newDocument.document_id
      ),
    ]);

    setActiveDocumentId(
      newDocument.document_id
    );
  }

  async function handleDeleteDocument(
    documentId: string
  ) {
    await deleteDocument(
      documentId
    );

    setDocuments((previous) => {
      const remaining =
        previous.filter(
          (document) =>
            document.document_id !==
            documentId
        );

      if (
        activeDocumentId ===
        documentId
      ) {
        setActiveDocumentId(
          remaining[0]
            ?.document_id ?? null
        );
      }

      return remaining;
    });
  }

  const activeDocument =
    documents.find(
      (document) =>
        document.document_id ===
        activeDocumentId
    );

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">
            AI
          </div>

          <div>
            <h1>
              Offline AI Learning Assistant
            </h1>

            <p>
              Local document intelligence
            </p>
          </div>
        </div>

        {activeDocument && (
          <div className="active-document">
            <span>
              Active document
            </span>

            <strong>
              {activeDocument.filename}
            </strong>
          </div>
        )}
      </header>

      <main className="main-container">
        <aside className="document-sidebar">
          <DocumentUpload
            onUploadSuccess={
              handleUploadSuccess
            }
          />

          {loadingDocuments ? (
            <div className="document-loading">
              Loading documents...
            </div>
          ) : (
            <DocumentList
              documents={documents}
              activeDocumentId={
                activeDocumentId
              }
              onSelect={
                setActiveDocumentId
              }
              onDelete={
                handleDeleteDocument
              }
            />
          )}

          {error && (
            <div className="upload-error">
              {error}
            </div>
          )}
        </aside>

        <section className="chat-workspace">
          <ChatBox
            documentId={
              activeDocumentId
            }
            documentName={
              activeDocument?.filename
            }
          />
        </section>
      </main>
    </div>
  );
}

export default App;