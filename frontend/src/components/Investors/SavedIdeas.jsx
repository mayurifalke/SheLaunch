import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import "./Investor.css";

const SavedIdeas = () => {
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSavedEntrepreneurs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/investors/get-saved-entrepreneurs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      if (data.savedEntrepreneurs && Array.isArray(data.savedEntrepreneurs)) {
        const mappedIdeas = data.savedEntrepreneurs.map((item) => ({
          id: item._id,
          name: item.startupname || "Untitled Startup",
          owner: item.name,
          location: "India",
          category: item.industry,
          fundingNeed: item.fundinggoal,
          description: item.description,
          email: item.email,
          contact: item.contactno,
          education: item.education,
          linkdinurl: item.linkdinurl?.startsWith("http")
            ? item.linkdinurl
            : `https://${item.linkdinurl}`,
          bio: item.bio || "No bio available",
          website: item.websiteurl?.startsWith("http")
            ? item.websiteurl
            : `https://${item.websiteurl}`,
          vision: item.vision || "No vision provided",
        }));
        setSavedIdeas(mappedIdeas);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching saved entrepreneurs:", error);
    }
  };

  useEffect(() => {
    fetchSavedEntrepreneurs();
  }, []);

  const handleViewDetails = (idea) => {
    setSelectedIdea(idea);
    setShowModal(true);
  };
const handleRemove = async (id) => {
  try {
    // Immediately remove from UI
    setSavedIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));

    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `/api/investors/remove-saved-entrepreneur/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message || "Idea removed successfully!");
  } catch (error) {
    console.error("Error removing saved entrepreneur:", error);
    toast.error(error.response?.data?.message || "Failed to remove idea");

    // Optional: refetch list if there was an error to keep UI in sync
    fetchSavedEntrepreneurs();
  }
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
              <div className="card h-100 pitch-card border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4 card-text">
                    <h5 className="card-title">{idea.name}</h5>
                    <span className="badge pitch-category p-2">
                      {idea.category}
                    </span>
                  </div>
                  <hr />
                  <h6 className="card-text card-subtitle mb-4 mt-2 text-muted">
                    <FaUserAlt /> {idea.owner} | <FaLocationDot />{" "}
                    {idea.location}
                  </h6>
                  <p className="card-text">
                    <strong>Funding Need:</strong> ₹{idea.fundingNeed}
                  </p>
                  <p className="card-text">
                    {idea.description?.slice(0, 80)}...
                  </p>

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
                    <button className="btn btn-success btn-sm">
                      💬 Contact Founder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Idea Details */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedIdea?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedIdea && (
            <>
              <p>
                <strong>Owner:</strong> {selectedIdea.owner}
              </p>
              <p>
                <strong>Email:</strong> {selectedIdea.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedIdea.contact}
              </p>
              <p>
                <strong>Education:</strong> {selectedIdea.education}
              </p>
              <p>
                <strong>Category:</strong> {selectedIdea.category}
              </p>
              <p>
                <strong>Vision:</strong> {selectedIdea.vision}
              </p>
              <p>
                <strong>Bio:</strong> {selectedIdea.bio}
              </p>
              <p>
                <strong>Location:</strong> {selectedIdea.location}
              </p>
              <p>
                <strong>Funding Needed:</strong> ₹{selectedIdea.fundingNeed}
              </p>
              <p>
                <strong>Description:</strong> {selectedIdea.description}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button
              variant="primary"
              onClick={() => window.open(selectedIdea.linkdinurl, "_blank")}
            >
              🔗 View LinkedIn
            </Button>
            <Button
              variant="dark"
              onClick={() => window.open(selectedIdea.website, "_blank")}
            >
              🌐 Visit Website
            </Button>
            <Button variant="success">💬 Contact Founder</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SavedIdeas;
