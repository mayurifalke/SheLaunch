import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const FloatingChatbot = () => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState([]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleAsk = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to use the chatbot."); 
    }
    if (!input.trim()) return;

    // Append user question
    setResponses((prev) => [...prev, { type: "user", text: input }]);

    try {
      const res = await fetch("/api/users/chatbot", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},

        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      // Append bot response
      setResponses((prev) => [...prev, { type: "bot", text: data.answer }]);
      setInput("");
    } catch (error) {
      console.error("Error fetching chatbot answer:", error);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={handleShow}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#a754e6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <img
          src="/images/chatbot.jpg"
          alt="Chatbot"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Header
          style={{
            backgroundColor: "#a754e6",
            color: "white",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/images/chatbot.jpg"
              alt="Niaa"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <strong>SheBot</strong>
          </div>
          <Button variant="light" onClick={handleClose}>
            ✕
          </Button>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px", maxHeight: "500px", overflowY: "auto" }}>
          <div>
            {responses.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.type === "user" ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "15px",
                    backgroundColor: msg.type === "user" ? "#d1c4e9" : "#e0e0e0",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
          <Button variant="primary" onClick={handleAsk}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FloatingChatbot;
