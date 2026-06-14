import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/api";
import { getAuthSession } from "../services/authSession";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    const userMsg = {
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prevMessages) => [...prevMessages, userMsg]);
    setMessage("");
    setIsSending(true);

    try {
      const session = getAuthSession();
      const data = await sendChatMessage({
        message: trimmedMessage,
        user_id: session?.userId,
        email: session?.email
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: data.reply || "I did not receive a reply from the assistant.",
        },
      ]);
    } catch {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "I can help with career guidance, skill choices, and assessment results. Try asking: Which career is suitable for me?",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
      <div
        style={{
          borderRadius: 18,
          padding: 16,
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 4 }}>Career AI Assistant</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Ask career questions and get guidance</div>
      </div>

      <div style={{ flex: 1, minHeight: 220, borderRadius: 18, border: "1px solid #e5e7eb", background: "#ffffff", padding: 16, overflowY: "auto" }}>
        {messages.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, index) => (
              <div
                key={`${msg.sender}-${index}`}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  borderRadius: 14,
                  padding: "10px 12px",
                  background: msg.sender === "user" ? "#dbeafe" : "#f8fafc",
                  color: "#111827",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: "capitalize", color: "#6b7280" }}>
                  {msg.sender}
                </div>
                <div style={{ lineHeight: 1.5 }}>{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Ask things like:
            <br />
            Which career is suitable for me?
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask Career Question"
          rows={3}
          style={{
            width: "100%",
            borderRadius: 14,
            border: "1px solid #d1d5db",
            padding: 14,
            fontSize: 16,
            outline: "none",
            resize: "vertical",
          }}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={isSending}
          style={{
            width: "100%",
            border: "none",
            borderRadius: 14,
            padding: "14px 18px",
            background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 60%)",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            opacity: isSending ? 0.75 : 1,
          }}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;