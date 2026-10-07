import type {
  Message,
} from "../types/chat";

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={
        isUser
          ? "message-row user-row"
          : "message-row assistant-row"
      }
    >
      <div
        className={
          isUser
            ? "message-bubble user-message"
            : "message-bubble assistant-message"
        }
      >
        <div className="message-role">
          {isUser
            ? "You"
            : "Assistant"}
        </div>

        <div className="message-text">
          {message.content}
        </div>

        {!isUser &&
          message.sources &&
          message.sources.length > 0 && (
            <div className="sources">
              <div className="sources-title">
                Sources
              </div>

              {message.sources.map(
                (source) => (
                  <div
                    key={source.chunk_id}
                    className="source-card"
                  >
                    <div className="source-name">
                      {source.filename}
                    </div>

                    <div className="source-meta">
                      <span>
                        Chunk{" "}
                        {source.chunk_index}
                      </span>

                      <span>
                        Similarity{" "}
                        {(
                          source.similarity *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default ChatMessage;