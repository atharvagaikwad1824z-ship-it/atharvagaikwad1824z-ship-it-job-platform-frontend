import { useEffect, useState } from "react";
import { getMyConversations } from "../../services/conversationService";
import { getMessages, sendMessage } from "../../services/messageService";
import socket from "../../socket";
import { useAuth } from "../../context/AuthContext";
import "./Messenger.css";

function Messenger() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await getMyConversations();
        setConversations(res.data);
      } catch (err) {
        console.log("Conversation fetch error:", err.message);
      }
    };

    fetchConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await getMessages(selectedConversation._id);
        setMessages(res.data);

        socket.emit("joinConversation", selectedConversation._id);
      } catch (err) {
        console.log("Message fetch error:", err.message);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Receive real-time message
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      if (data.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedConversation]);

  const handleSend = async () => {
    if (!text.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation._id,
      sender: user.id,
      text
    };

    try {
      // Save in DB
      await sendMessage({
        conversationId: selectedConversation._id,
        text
      });

      // Emit socket message
      socket.emit("sendMessage", messageData);

      setMessages((prev) => [...prev, messageData]);
      setText("");
    } catch (err) {
      console.log("Send message error:", err.message);
    }
  };

  const getOtherUser = (conversation) => {
    return conversation.participants.find((p) => p._id !== user.id);
  };

  return (
    <div className="messenger-container">
      {/* Left panel */}
      <div className="conversation-list">
        <h3>Messages</h3>

        {conversations.map((conv) => {
          const other = getOtherUser(conv);

          return (
            <div
              key={conv._id}
              className={`conversation-item ${selectedConversation?._id === conv._id ? "active" : ""
                }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <img
                src={
                  other?.profilePic ||
                  other?.companyLogo ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt="user"
                className="conversation-avatar"
              />
              <div>
                <h4>{other?.name}</h4>
                <p>{conv.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right panel */}
      <div className="chat-window">
        {!selectedConversation ? (
          <div className="no-chat">
            <h2>Select a conversation</h2>
            <p>Start chatting with employers or candidates.</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3>
                {getOtherUser(selectedConversation)?.name}
                <span className="job-label">
                  ({selectedConversation.job?.title})
                </span>
              </h3>

            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${msg.sender === user.id ? "me" : "them"
                    }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Messenger;
