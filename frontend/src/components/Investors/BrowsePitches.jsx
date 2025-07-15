import React, { useState, useEffect } from "react";
import { Modal, Button,Form  } from "react-bootstrap";
// import axios from "axios"; // Install if integrating backend
import "./Investor.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";

const BrowsePitches = () => {
  const [pitches, setPitches] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);

     const [amount, setAmount] = useState("");
  const [type, setType] = useState("Equity");
  const [period, setPeriod] = useState("");
  const [notes, setNotes] = useState("");


  // Dummy data for now
  useEffect(() => {
    const dummyPitches = [
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
      // Add more dummy pitches as needed
    ];
    setPitches(dummyPitches);
  }, []);

    const handleViewDetails = (pitch) => {
    setSelectedPitch(pitch);
    setShowModal(true);

    //for Invest Modal
    const openInvestModal = (pitch) => {
    setSelectedPitch(pitch);
    setShowInvestModal(true);
  };

  // const handleInvestSubmit = () => {
  //   const investmentData = {
  //     pitchId: selectedPitch.id,
  //     amount,
  //     type,
  //     period,
  //     notes,
  //   };
  //   console.log("Investment Submitted:", investmentData);
  //   // TODO: Integrate with backend API here

  //   // Reset form and close modal
  //   setAmount("");
  //   setType("Equity");
  //   setPeriod("");
  //   setNotes("");
  //   setShowInvestModal(false);
  // };

  };

  return (
    <div className="container mt-4">
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
            <span className="badge pitch-category p-2">{pitch.category}</span>
          </div>
          <hr />
          <h6 className="card-subtitle mb-4 text-muted mt-4 card-text">
            <FaUserAlt />  {pitch.owner} | <FaLocationDot /> {pitch.location}
          </h6>
          <p className="card-text">
            {/* <FaMoneyBillWave />  */}  <strong>Funding Need :  </strong> ₹{pitch.fundingNeed}
          </p>
          <p className="card-text">{pitch.description.slice(0, 80)}...</p>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              className="btn btn-secondary btn-sm px-3"
              onClick={() => handleViewDetails(pitch)}
            >
              🔍 View Details
            </button>
            <button className="btn save-btn  btn-sm px-3">⭐ Save</button>
            <button onClick={() => setShowInvestModal (true)} className="btn invest-btn btn-sm px-3">Invest Now</button>
            <button className="btn deck-btn btn-sm px-3">📎 Deck</button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Modal for Pitch Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPitch?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPitch && (
            <>
              <p><strong>Owner:</strong> {selectedPitch.owner}</p>
              <p><strong>Category:</strong> {selectedPitch.category}</p>
              <p><strong>Location:</strong> {selectedPitch.location}</p>
              <p><strong>Funding Needed:</strong> ₹{selectedPitch.fundingNeed}</p>
              <p><strong>Description:</strong> {selectedPitch.description}</p>
              {/* Additional fields like website, team, impact can be shown here */}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success">✅ I'm Interested</Button>
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
          <Button variant="success">
            ✅ Submit Investment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BrowsePitches;
