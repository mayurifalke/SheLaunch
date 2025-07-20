import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
// import axios from "axios"; // Install if integrating backend
import "./Investor.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import axios from "axios"; // Ensure axios is installed in your project
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BrowsePitches = () => {
  const [pitches, setPitches] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Equity");
  const [period, setPeriod] = useState("");
  const [notes, setNotes] = useState("");

  const handleSavePitch = async (entrepreneurId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `/api/investors/save-entrepreneur`,
        { entrepreneurId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Pitch saved!");
    } catch (err) {
      console.error("Error saving pitch:", err);
      toast.error(err.response?.data?.message || "Failed to save pitch");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchPitches = async () => {
      try {
        const res = await axios.get("/api/investors/browse-pitches", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mappedPitches = res.data.entrepreneurs.map((item) => ({
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

        setPitches(mappedPitches);
      } catch (err) {
        console.error("Failed to fetch pitches:", err);
      }
    };

    fetchPitches();
  }, []);

  const handleViewDetails = (pitch) => {
    setSelectedPitch(pitch);
    setShowModal(true);

    //for Invest Modal
    const openInvestModal = (pitch) => {
      setSelectedPitch(pitch);
      setShowInvestModal(true);
    };
  };

  const handleInterested = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/investors/mark-interested",
        { entrepreneurId: selectedPitch.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "Interest marked successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error marking interest:", err);
      toast.error(err.response?.data?.message || "Failed to mark interest");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer
        stacked
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <h2 className="mb-4">💼 Explore Business Pitches For Investment</h2>

      {/* Filters Section */}
      <div className="card p-3 mb-4">
        <div className="row">
          <div className="col-md-3 mb-2">
            <label>Category</label>
            <select className="form-select">
              <option value="">All</option>
              <option value="Tech">Technology</option>
              <option value="Fashion">Fashion</option>
              <option value="Handicrafts">Handicrafts</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <label>Funding Needed (₹)</label>
            <input type="number" className="form-control" placeholder="Min" />
          </div>
          <div className="col-md-3 mb-2">
            <label>Location</label>
            <select className="form-select">
              <option value="">All</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end mb-2">
            <button className="btn  w-90 fliter-btn">Apply Filters</button>
          </div>
        </div>
      </div>

      {/* Pitches Grid */}
      {/* Pitches Grid */}
      <div className="row">
        {pitches.map((pitch) => (
          <div className="col-md-6 mb-4" key={pitch.id}>
            <div className="card pitch-card h-100">
              <div className="card-body">
                <div className="d-flex card-head justify-content-between align-items-center mb-2">
                  <h5 className="card-title fw-bold">{pitch.name}</h5>
                  <span className="badge pitch-category p-2">
                    {pitch.category}
                  </span>
                </div>
                <hr />
                <h6 className="card-subtitle mb-4 text-muted mt-4 card-text">
                  <FaUserAlt /> {pitch.owner} | <FaLocationDot />{" "}
                  {pitch.location}
                </h6>
                <p className="card-text">
                  {/* <FaMoneyBillWave />  */} <strong>Funding Need : </strong>{" "}
                  ₹{pitch.fundingNeed}
                </p>
                <p className="card-text">{pitch.description.slice(0, 80)}...</p>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    className="btn btn-secondary btn-sm px-3"
                    onClick={() => handleViewDetails(pitch)}
                  >
                    🔍 View Details
                  </button>
                  <button
                    className="btn save-btn  btn-sm px-3"
                    onClick={() => handleSavePitch(pitch.id)}
                  >
                    ⭐ Save
                  </button>
                  <button
                    onClick={() => setShowInvestModal(true)}
                    className="btn invest-btn btn-sm px-3"
                  >
                    Invest Now
                  </button>
                  <button className="btn deck-btn btn-sm px-3">📎 Deck</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Pitch Details */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedPitch?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPitch && (
            <>
              <p>
                <strong>Owner:</strong> {selectedPitch.owner}
              </p>
              <p>
                <strong>Email:</strong> {selectedPitch.email}
              </p>
              <p>
                <strong>Contact:</strong> {selectedPitch.contact}
              </p>
              <p>
                <strong>Education:</strong> {selectedPitch.education}
              </p>
              <p>
                <strong>Category:</strong> {selectedPitch.category}
              </p>
              <p>
                <strong>Vision:</strong> {selectedPitch.vision}
              </p>
              <p>
                <strong>Bio:</strong> {selectedPitch.bio}
              </p>
              <p>
                <strong>Location:</strong> {selectedPitch.location}
              </p>
              <p>
                <strong>Funding Needed:</strong> ₹{selectedPitch.fundingNeed}
              </p>
              <p>
                <strong>Description:</strong> {selectedPitch.description}
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex flex-wrap gap-2 mt-3">
            <Button
              variant="primary"
              onClick={() => window.open(selectedPitch.linkdinurl, "_blank")}
            >
              🔗 View LinkedIn
            </Button>
            <Button
              variant="dark"
              onClick={() => window.open(selectedPitch.website, "_blank")}
            >
              🌐 Visit Website
            </Button>
            <Button variant="success" onClick={handleInterested}>
              ✅ I'm Interested
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Invest Now Modal */}
      <Modal
        show={showInvestModal}
        onHide={() => setShowInvestModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Invest in {selectedPitch?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter investment amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Investment Type</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Equity">Equity</option>
                <option value="Loan">Loan</option>
                <option value="Donation">Donation</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Period (if applicable)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 6 months"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes / Terms</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any additional notes or terms"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvestModal(false)}>
            Cancel
          </Button>
          <Button variant="success">✅ Submit Investment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BrowsePitches;
