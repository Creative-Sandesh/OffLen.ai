import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import ChatMessage from "./ChatMessage";

import {
  sendChatMessage,
} from "../services/api";

import type {
  Message,
} from "../types/chat";

interface ChatBoxProps {
  documentId: string | null;
  documentName?: string;
}

function ChatBox({
  documentId,
  documentName,
}: ChatBoxProps) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const documentSelected =
    documentId !== null;

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();

    if (
      !text ||
      loading ||
      !documentId
    ) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    const updatedMessages: Message[] = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    setInput("");

    setLoading(true);

    try {
      const response =
        await sendChatMessage(
          documentId,
          updatedMessages
        );

      const assistantMessage: Message = {
        role: "assistant",
        content: response.answer,
        sources: response.sources,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      const assistantError: Message = {
        role: "assistant",

        content:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      };

      setMessages((previous) => [
        ...previous,
        assistantError,
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event:
      KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSend();
    }
  }

  function handleNewChat() {
    setMessages([]);
    setInput("");
  }

  return (
    <div className="chat-box">
      <div className="chat-header">
        <div>
          <span className="chat-label">
            Active document
          </span>

          <h2>
            {documentSelected
              ? documentName ??
                "Document Chat"
              : "Document Chat"}
          </h2>

          <p>
            {documentSelected
              ? "Answers are generated only from this document."
              : "Select a document to start chatting."}
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={handleNewChat}
          disabled={
            messages.length === 0 ||
            loading
          }
        >
          New Chat
        </button>
      </div>

      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-chat">
            <div className="empty-chat-icon">
              AI
            </div>

            <h3>
              {documentSelected
                ? "Ask about this document"
                : "Select a document"}
            </h3>

            <p>
              {documentSelected
                ? `Ask questions about ${
                    documentName ??
                    "the selected document"
                  }.`
                : "Upload or select a document from the document panel."}
            </p>

            {documentSelected && (
              <div className="example-question">
                Try: “Summarize the main points
                of this document.”
              </div>
            )}
          </div>
        )}

        {messages.map(
          (message, index) => (
            <ChatMessage
              key={`${message.role}-${index}`}
              message={message}
            />
          )
        )}

        {loading && (
          <div className="message-row assistant-row">
            <div className="message-bubble assistant-message">
              <div className="message-role">
                Assistant
              </div>

              <div className="typing">
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          rows={2}
          maxLength={5000}
          placeholder={
            documentSelected
              ? `Ask about ${
                  documentName ??
                  "this document"
                }...`
              : "Select a document first..."
          }
          disabled={
            loading ||
            !documentSelected
          }
          onChange={(event) =>
            setInput(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="send-button"
          onClick={handleSend}
          disabled={
            loading ||
            !documentSelected ||
            !input.trim()
          }
        >
          {loading
            ? "..."
            : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;