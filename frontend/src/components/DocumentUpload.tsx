import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  uploadDocument,
} from "../services/api";

import type {
  UploadResponse,
} from "../types/chat";

interface DocumentUploadProps {
  onUploadSuccess: (
    document: UploadResponse
  ) => void;
}

function DocumentUpload({
  onUploadSuccess,
}: DocumentUploadProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [uploadedDocument, setUploadedDocument] =
    useState<UploadResponse | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setError("");
    setUploadedDocument(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      extension !== "pdf" &&
      extension !== "txt"
    ) {
      setSelectedFile(null);

      setError(
        "Only PDF and TXT files are supported."
      );

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError(
        "Please select a PDF or TXT file."
      );

      return;
    }

    try {
      setUploading(true);
      setError("");

      const result =
        await uploadDocument(selectedFile);

      setUploadedDocument(result);

      onUploadSuccess(result);

      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to upload document."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="document-upload">
      <div className="upload-header">
        <div>
          <h2>Upload Document</h2>

          <p>
            Upload a PDF or TXT file to add it
            to your local knowledge base.
          </p>
        </div>
      </div>

      <div className="upload-controls">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          disabled={uploading}
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={
            uploading ||
            !selectedFile
          }
        >
          {uploading
            ? "Processing..."
            : "Upload"}
        </button>
      </div>

      {selectedFile && (
        <div className="selected-file">
          {selectedFile.name}
        </div>
      )}

      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}

      {uploadedDocument && (
        <div className="upload-success">
          <strong>
            {uploadedDocument.filename}
          </strong>

          <span>
            {uploadedDocument.chunks} chunks
          </span>

          <span>
            Ready for chat
          </span>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;