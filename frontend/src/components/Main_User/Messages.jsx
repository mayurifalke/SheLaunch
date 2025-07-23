import React from 'react';
import { FaLinkedin, FaUserCircle } from "react-icons/fa";
import { ListGroup, Image, Form } from "react-bootstrap";

function Messages() {
  return (
    <div className="d-flex" style={{ height: "90vh", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <div className="border-end bg-white" style={{ width: "300px", overflowY: "auto" }}>
        <div className="p-3 border-bottom">
          <h5 className="fw-bold mb-0">Messages</h5>
        </div>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex align-items-center">
            <FaUserCircle size={40} className="text-secondary me-2" />
            <div>
              <div className="fw-bold">Amruta Thikole</div>
              <small className="text-muted">You: Kontya role sathi</small>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-center">
            <FaLinkedin size={40} className="text-primary me-2" />
            <div>
              <div className="fw-bold">LinkedIn Offer</div>
              <small className="text-muted">Hi there, Ashwini! Thank...</small>
            </div>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex align-items-center">
            <FaUserCircle size={40} className="text-secondary me-2" />
            <div>
              <div className="fw-bold">Saurav Tupe</div>
              <small className="text-muted">You: Yes but I want an wor...</small>
            </div>
          </ListGroup.Item>
          {/* Add more list items similarly */}
        </ListGroup>
      </div>

      {/* Chat area */}
      <div className="flex-grow-1 d-flex flex-column">
        <div className="p-3 border-bottom bg-white d-flex align-items-center">
          <FaUserCircle size={40} className="text-secondary me-2" />
          <div>
            <div className="fw-bold">Amruta Thikole</div>
            <small className="text-muted">Available on mobile</small>
          </div>
        </div>
        <div className="flex-grow-1 p-3 overflow-auto">
          <div className="mb-2">
            <div className="fw-bold">Ashwini Thikole <small className="text-muted">9:28 PM</small></div>
            <div>Tumchi company ahe ka hi</div>
          </div>
          <div className="mb-2">
            <div className="fw-bold">Amruta Thikole <small className="text-muted">9:37 PM</small></div>
            <div>Ho</div>
          </div>
          <div className="mb-2">
            <div className="fw-bold">Ashwini Thikole <small className="text-muted">9:38 PM</small></div>
            <div>Recruitment ahe ka</div>
            <div>Kontya role sathi</div>
          </div>
          {/* Add more messages as needed */}
        </div>
        <div className="p-3 border-top bg-white">
          <Form.Control placeholder="Write a message..." />
        </div>
      </div>
    </div>
  );
}

export default Messages;
