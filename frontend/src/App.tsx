import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "./App.css";


interface Message {
  role: "user" | "assistant";
  content: string;
}


function App() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);


  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);


  const sendMessage = async (
    event: FormEvent
  ) => {

    event.preventDefault();


    const trimmedMessage =
      message.trim();


    if (!trimmedMessage || loading) {
      return;
    }


    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
    };


    /*
       Include previous conversation
       plus the new user message.
    */
    const conversation = [
      ...messages,
      userMessage,
    ];


    setMessages(conversation);

    setMessage("");

    setLoading(true);


    try {

      const response = await fetch(
        "http://localhost:8000/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":"application/json",
          },

          body: JSON.stringify({
            messages: conversation,
          }),
        }
      );


      if (!response.ok) {
        throw new Error(
          "Failed to get AI response"
        );
      }


      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setMessages([
        ...conversation,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: "assistant",
        content:"Sorry, I could not connect to the AI server.",
      };
      setMessages([
        ...conversation,
        errorMessage,
      ]);

    } finally {

      setLoading(false);

    }

  };


  const clearConversation = () => {

    setMessages([]);

  };


  return (

    <div className="app">

      <header className="header">

        <div>

          <h1>
            AI Learning Assistant
          </h1>

          <p>
            Powered locally by Ollama
          </p>

        </div>


        <div className="header-actions">

          {messages.length > 0 && (

            <button
              className="clear-button"
              onClick={clearConversation}
            >
              New Chat
            </button>

          )}


          <span className="status">
            Local AI
          </span>

        </div>

      </header>


      <main className="chat-container">

        <div className="messages">


          {messages.length === 0 && (

            <div className="welcome">

              <h2>
                What would you like
                to learn?
              </h2>

              <p>
                Ask a question and continue
                the conversation with your
                AI tutor.
              </p>

            </div>

          )}


          {messages.map(
            (chatMessage, index) => (

              <div

                key={index}

                className={
                  `message ${
                    chatMessage.role
                  }`
                }

              >

                <div className="message-label">

                  {
                    chatMessage.role ===
                    "user"
                      ? "You"
                      : "AI Tutor"
                  }

                </div>


                <div className="message-content">

                  {chatMessage.content}

                </div>

              </div>

            )
          )}


          {loading && (

            <div className="message assistant">

              <div className="message-label">
                AI Tutor
              </div>

              <div className="message-content">
                Thinking...
              </div>

            </div>

          )}


          <div ref={messagesEndRef} />

        </div>


        <form
          className="chat-form"
          onSubmit={sendMessage}
        >

          <input

            type="text"

            value={message}

            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }

            placeholder={
              "Ask a follow-up question..."
            }

            disabled={loading}

          />


          <button
            type="submit"
            disabled={loading}
          >

            {
              loading
                ? "Thinking..."
                : "Send"
            }

          </button>

        </form>

      </main>

    </div>

  );

}


export default App;