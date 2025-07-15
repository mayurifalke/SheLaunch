import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import "./Investor.css";

const SavedIdeas = () => {
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Dummy data for now
  useEffect(() => {
    const dummySavedIdeas = [
      {
        id: 1,
        name: "EcoCrafts by Meena",
        owner: "Meena Joshi",
        location: "Nashik, Maharashtra",
        category: "Handicrafts",
        fundingNeed: 50000,
        description: "Handmade eco-friendly home décor items crafted by rural artisans.",
      },
      {
        id: 2,
        name: "Tech4Rural",
        owner: "Priya Sharma",
        location: "Nagpur, Maharashtra",
        category: "Technology",
        fundingNeed: 200000,
        description: "Affordable tech solutions for rural schools to improve education access.",
      },
    ];
    setSavedIdeas(dummySavedIdeas);
  }, []);

  const handleViewDetails = (idea) => {
    setSelectedIdea(idea);
    setShowModal(true);
  };

  const handleRemove = (id) => {
    const updatedIdeas = savedIdeas.filter((idea) => idea.id !== id);
    setSavedIdeas(updatedIdeas);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Saved Ideas</h2>

      {savedIdeas.length === 0 ? (
        <p>No saved ideas yet. Browse pitches and save your favorites!</p>
      ) : (
        <div className="row">
          {savedIdeas.map((idea) => (
            <div className="col-md-6 mb-4" key={idea.id}>
              <div className="card h-100 pitch-card  border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4 card-text">
                    <h5 className="card-title">{idea.name}</h5>
                    <span className="badge pitch-category  p-2">{idea.category}</span>
                  </div>
                  <hr />
                  <h6 className=" card-text card-subtitle mb-4 mt-2 text-muted">
                     <FaUserAlt /> {idea.owner} |  <FaLocationDot /> {idea.location}
                  </h6>
                  <p className="card-text">
                    <strong>Funding Need:</strong> ₹{idea.fundingNeed}
                  </p>
                  <p className="card-text">{idea.description.slice(0, 80)}...</p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewDetails(idea)}
                    >
                      🔍 View Details
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(idea.id)}
                    >
                      ❌ Remove
                    </button>
                    <button className="btn btn-success btn-sm">💬 Contact Founder</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Idea Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedIdea?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIdea && (
            <>
              <p><strong>Owner:</strong> {selectedIdea.owner}</p>
              <p><strong>Category:</strong> {selectedIdea.category}</p>
              <p><strong>Location:</strong> {selectedIdea.location}</p>
              <p><strong>Funding Needed:</strong> ₹{selectedIdea.fundingNeed}</p>
              <p><strong>Description:</strong> {selectedIdea.description}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success">💬 Contact Founder</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SavedIdeas;
