import ChatBot from "../components/ChatBot";

function Chatbot() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)", padding: "16px 20px", paddingTop: "28px", color: "white" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>Career AI Chatbot</h1>
      </div>

      <div style={{ padding: "24px 16px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" }}>
          <ChatBot />
        </div>
      </div>
    </div>
  );
}

export default Chatbot;