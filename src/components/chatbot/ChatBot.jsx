import { useEffect, useRef, useState } from "react";
import { faqData } from "./faqData";
import { useAuth } from "../../context/AuthContext";
import "./ChatBot.css";

function ChatBot() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showNewQueryBtn, setShowNewQueryBtn] = useState(false);

  const chatBodyRef = useRef(null);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 How can I help you today?" }
  ]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    chatBody.scrollTop = chatBody.scrollHeight;
  }, [messages, loading]);

  const handleQuestionClick = (item) => {
    setShowSuggestions(false);
    setShowNewQueryBtn(false);

    // Add user question
    setMessages((prev) => [...prev, { sender: "user", text: item.question }]);

    setLoading(true);

    // Simulate bot thinking
    setTimeout(() => {
      setLoading(false);

      // Add bot answer
      setMessages((prev) => [...prev, { sender: "bot", text: item.answer }]);

      // Show New Query button after answer
      setShowNewQueryBtn(true);
    }, 2000);
  };

  const handleNewQuery = () => {
    setShowSuggestions(true);
    setShowNewQueryBtn(false);
  };

  // Hide chatbot if not logged in
  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button className="chatbot-btn" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? "open" : "closed"}`}>
        <div className="chatbot-header">
          <h4>Help Assistant</h4>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>
        </div>

        {/* Chat Body */}
        <div className="chatbot-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-msg ${msg.sender === "bot" ? "bot" : "user"}`}
            >
              {msg.text}
            </div>
          ))}

          {/* Loader */}
          {loading && (
            <div className="typing">
              Bot is typing <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && !loading && (
            <div className="faq-buttons">
              {faqData.map((item, index) => (
                <button
                  key={index}
                  className="faq-btn"
                  onClick={() => handleQuestionClick(item)}
                >
                  {item.question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Fixed Button */}
        <div className="chatbot-footer">
          {showNewQueryBtn && !loading && (
            <button className="new-query-btn" onClick={handleNewQuery}>
              New Query ?
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatBot;
