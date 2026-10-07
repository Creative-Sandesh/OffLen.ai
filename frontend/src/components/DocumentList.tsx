import {
  useState,
  type MouseEvent,
} from "react";

import type {
  DocumentSummary,
} from "../types/chat";

interface DocumentListProps {
  documents: DocumentSummary[];

  activeDocumentId:
    string | null;

  onSelect: (
    documentId: string
  ) => void;

  onDelete: (
    documentId: string
  ) => Promise<void>;
}

function DocumentList({
  documents,
  activeDocumentId,
  onSelect,
  onDelete,
}: DocumentListProps) {
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  async function handleDelete(
    event: MouseEvent<HTMLButtonElement>,
    documentId: string
  ) {
    event.stopPropagation();

    try {
      setDeletingId(documentId);
      setError("");

      await onDelete(documentId);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2>Documents</h2>

        <span>
          {documents.length}
        </span>
      </div>

      {error && (
        <div className="document-list-error">
          {error}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="no-documents">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="document-items">
          {documents.map((document) => {
            const active =
              document.document_id ===
              activeDocumentId;

            return (
              <button
                type="button"
                key={document.document_id}
                className={
                  active
                    ? "document-item active"
                    : "document-item"
                }
                onClick={() =>
                  onSelect(
                    document.document_id
                  )
                }
              >
                <div className="document-info">
                  <div className="document-icon">
                    DOC
                  </div>

                  <div className="document-details">
                    <strong>
                      {document.filename}
                    </strong>

                    <span>
                      {document.chunks} chunks
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="delete-document"
                  disabled={
                    deletingId ===
                    document.document_id
                  }
                  onClick={(event) =>
                    handleDelete(
                      event,
                      document.document_id
                    )
                  }
                >
                  {deletingId ===
                  document.document_id
                    ? "..."
                    : "×"}
                </button>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DocumentList;