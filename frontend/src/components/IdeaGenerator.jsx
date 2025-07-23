import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Modal } from "react-bootstrap";
import { FcIdea } from "react-icons/fc";
import "./IdeaGenerator.css"; // Import custom styles

const IdeaGenerator = () => {
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [followupInput, setFollowupInput] = useState("");
  const [messages, setMessages] = useState([]); // 🆕 array of messages

  const handleGenerate = async () => {
    if (!skills || !budget || !location || !education || !interest) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setMessages([]);
    setShowModal(true);

    try {
      const res = await fetch("/api/users/generate-business-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest, skills, budget, location, education }),
      });

      const data = await res.json();
      // 🆕 Add initial idea as first message
      setMessages([{ type: "idea", text: data.idea }]);
    } catch (error) {
      console.error("Error generating idea:", error);
      setMessages([{ type: "idea", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowupAsk = async () => {
    if (!followupInput.trim()) return;

    setLoading(true);
    const userQuestion = followupInput;

    // Append user's question immediately
    setMessages((prev) => [...prev, { type: "user", text: userQuestion }]);
    setFollowupInput("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/ask-followup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();
      // Append bot's answer
      setMessages((prev) => [...prev, { type: "bot", text: data.answer }]);
    } catch (error) {
      console.error("Error fetching follow-up idea:", error);
      setMessages((prev) => [...prev, { type: "bot", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mb-4">
      {/* Hero Section */}
     <Row className="text-center mb-2">
  <Col>
    <div className="d-flex justify-content-center align-items-center gap-4">
      <div>
        <h2 style={{ fontWeight: "bold", color: "#a754e6" }}>AI-Powered Idea Generator</h2>
        <p className="text-muted">Get personalized startup ideas tailored to your education, skills, budget, and location.</p>
      </div>
      <div>
        <img
          src="/images/chatbot2.png"
          alt=""
          style={{ width: "10rem" }}
          className="float-animation"
        /> 
        {/* add this class */}
      </div>
    </div>
  </Col>
</Row>


      {/* Input Form */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><strong>Education</strong></Form.Label>
                <Form.Control type="text" placeholder="e.g. B.E., M.E, MBA, etc" value={education} onChange={(e) => setEducation(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Skills</strong></Form.Label>
                <Form.Control type="text" placeholder="e.g. sewing, teaching, coding" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label><strong>Area Of Interest</strong></Form.Label>
                <Form.Select value={interest} onChange={(e) => setInterest(e.target.value)}>
                  <option value="">Select</option>
                  <option value="tech">Technology</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Investment Budget (INR)</strong></Form.Label>
                <Form.Control type="number" placeholder="e.g. 50000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label><strong>Location</strong></Form.Label>
                <Form.Select value={location} onChange={(e) => setLocation(e.target.value)}>
                  <option value="">Select</option>
                  <option value="urban">Urban</option>
                  <option value="rural">Rural</option>
                </Form.Select>
              </Form.Group>

              <Button variant="primary" className="mb-4" onClick={handleGenerate} disabled={loading} style={{ backgroundColor: "#a754e6", border: "none" }}>
                {loading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Generating...</>) : ("Generate Idea")}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal for displaying idea + chatbot */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: "#a754e6", color: "white" }}>
          <Modal.Title><FcIdea />Recommended Business Idea</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto", backgroundColor: "#f7f7f7" }}>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Processing...</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "15px" }}>
              <div
                style={{
                  backgroundColor: msg.type === "user" ? "#e1bee7" : msg.type === "bot" ? "#d0d0cfff" : "#d0d0cfff",
                  padding: "15px",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }}
                dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
              />
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
       <div className="d-flex gap-2" style={{ width: "100%" }}>
          <Form.Control
            type="text"
            placeholder="Ask another query..."
            value={followupInput}
            onChange={(e) => setFollowupInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFollowupAsk()}
          />
          <Button variant="primary" onClick={handleFollowupAsk} disabled={loading} style={{ backgroundColor: "#a754e6", border: "none" }}>
            {loading ? "Please wait..." : "Ask"}
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default IdeaGenerator;
