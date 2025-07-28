import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  FaStar,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGooglePlusG,
  FaBars,
  FaArrowLeft,
  FaLocationDot,
} from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import "./Investor.css";

const BrowsePitches = () => {
  const [pitches, setPitches] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Equity");
  const [period, setPeriod] = useState("");
  const [notes, setNotes] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const [savedEntrepreneurs, setSavedEntrepreneurs] = useState([]);

const fetchPitches = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get("/api/investors/browse-pitches", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resSaved = await axios.get("/api/investors/get-saved-entrepreneurs", {
      headers: { Authorization: `Bearer ${token}` },
    });

   const resConnections = await axios.get(`/api/investors/get-connections`, {
  headers: { Authorization: `Bearer ${token}` },
});

// Build map of entrepreneurId => status
const entrepreneurStatusMap = {};
console.log("Connections Data:", resConnections.data.connections);
resConnections.data.connections.forEach(conn => {
  entrepreneurStatusMap[conn.entrepreneur._id] = conn.status;
});
    const savedIds = resSaved.data.savedEntrepreneurs.map(e => e._id);
    setSavedEntrepreneurs(savedIds);

    const mappedPitches = res.data.entrepreneurs.map((item) => {
      let image = null;
      if (
        item.profileImage &&
        item.profileImage.data &&
        item.profileImage.data.data
      ) {
        const base64String = btoa(
          new Uint8Array(item.profileImage.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        image = `data:${item.profileImage.contentType};base64,${base64String}`;
      }

      return {
        id: item._id,
        name: item.startupname || "Untitled Startup",
        owner: item.name,
        location: "India",
        category: item.industry,
        categories: item.industry ? [item.industry] : [],
        education: item.education || "Not provided",
        fundingNeed: item.fundinggoal,
        startupStage: item.startupStage || "Not specified",
        teamSize: item.teamSize || "Not specified",
        description: item.description,
        email: item.email,
        contact: item.contactno,
        linkdinurl: item.linkdinurl?.startsWith("http")
          ? item.linkdinurl
          : `https://${item.linkdinurl}`,
        bio: item.bio || "No bio available",
        website: item.websiteurl?.startsWith("http")
          ? item.websiteurl
          : `https://${item.websiteurl}`,
        vision: item.vision || "No vision provided",
        image,
        minInvestment: 10000,
        maxInvestment: 500000,
        saved: savedIds.includes(item._id),
        connectionStatus: entrepreneurStatusMap[item._id] || "None",
      };
    });

    setPitches(mappedPitches);
  } catch (err) {
    console.error("Failed to fetch pitches:", err);
  }
};

useEffect(() => {
  fetchPitches();
}, []);



  const handleSaveToggle = async (entrepreneurId) => {
    const token = localStorage.getItem("token");
    try {
      if (savedEntrepreneurs.includes(entrepreneurId)) {
        // Call remove API
        await axios.delete(
          `/api/investors/remove-saved-entrepreneur/${entrepreneurId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedEntrepreneurs(savedEntrepreneurs.filter(id => id !== entrepreneurId));
        toast.success("Entrepreneur removed from saved list");
      } else {
        // Call save API
        await axios.post(
          `/api/investors/save-entrepreneur`,
          { entrepreneurId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedEntrepreneurs([...savedEntrepreneurs, entrepreneurId]);
        toast.success("Entrepreneur saved");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update saved status");
    }
  };


  const handleInvestmentSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/api/investors/invest",
        {
          entrepreneurId: selectedPitch.id,
          amount,
          type,
          period,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Investment submitted successfully!");
      setShowInvestModal(false);
    } catch (err) {
      toast.error("Failed to submit investment");
    }
  };

    const handleConnect = async (entrepreneurId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `/api/investors/make-connection`, // ✅ updated route
      { entrepreneurId }, // ✅ updated payload key
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message || "Connection request sent!");
    fetchPitches(); // Optional: if you want to refresh list
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to send connection request"
    );
  }
};


  return (
    <div className="container py-4">
      <div className="row">
        <h3>Browse Pitches</h3>
        {pitches.map((inv) => (
          <div
            key={inv.id}
            className="col-md-4 mb-4"
            style={{ perspective: "1000px" }}
          >
            <div
              className="card-container position-relative"
              style={{
                width: "100%",
                height: "450px",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform: flippedCards[inv.id]
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
                borderRadius: "20px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              }}
            >
              {/* Front */}
              <div
                className="card position-absolute w-100"
                style={{
                  height: "100%",
                  borderRadius: "20px",
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="d-flex align-items-center p-3 border-bottom"
                  style={{ background: "#fff" }}
                >
                  <img
                    src={inv.image}
                    alt="Entrepreneur"
                    className="rounded-circle"
                    style={{
                      height: "50px",
                      width: "50px",
                      objectFit: "cover",
                      border: "2px solid #eee",
                    }}
                  />
                  <div className="ms-3">
                    <h6 className="mb-0">{inv.name}</h6>
                    <small className="text-muted">{inv.contact}</small>
                  </div>
                  <div className="ms-auto">
                    <button
                      className="btn btn-light rounded-circle"
                      onClick={() =>
                        setFlippedCards((prev) => ({ ...prev, [inv.id]: true }))
                      }
                    >
                      <FaBars />
                    </button>
                  </div>
                </div>

                <div className="card-body p-3">
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Name
                    </Form.Label>
                    <Form.Control type="text" value={inv.owner} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Email
                    </Form.Label>
                    <Form.Control type="text" value={inv.email} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Contact
                    </Form.Label>
                    <Form.Control type="text" value={inv.contact} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Categories
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={inv.categories.join(", ") || "N/A"}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Education
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={inv.education || "N/A"}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Funding Needed
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={`₹${inv.fundingNeed}`}
                      disabled
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-center gap-4">
       <Button
  size="sm"
  variant={
    inv.connectionStatus === "Pending"
      ? "secondary"
      : inv.connectionStatus === "Accepted"
      ? "primary"
      : inv.connectionStatus === "Rejected"
      ? "dark"
      : "outline-primary"
  }
  onClick={() => handleConnect(inv.id)}
  disabled={
    inv.connectionStatus === "Pending" || inv.connectionStatus === "Rejected"
  }
>
  {inv.connectionStatus === "Pending"
    ? "Pending"
    : inv.connectionStatus === "Accepted"
    ? "Connected"
    : inv.connectionStatus === "Rejected"
    ? "Rejected"
    : "Connect"}
</Button>

                    <Button
                      size="sm"
                      variant={"outline-dark"}
                      onClick={() => toast("Investment logic goes here")}
                    >
                      Invest Now
                    </Button>
                    <Button
            size="sm"
            variant={savedEntrepreneurs.includes(inv.id) ? "success" : "outline-success"}
            onClick={() => handleSaveToggle(inv.id)}

          >
            {savedEntrepreneurs.includes(inv.id) ? "✓ Saved" : "Save"}
          </Button>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="card bg-white text-dark position-absolute w-100"
                style={{
                  height: "100%",
                  borderRadius: "20px",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{
                    background: "#f8f8f8",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <h6 className="mb-0">{inv.name}</h6>
                    <small className="text-muted">
                      <FaLocationDot /> India
                    </small>
                  </div>
                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() =>
                      setFlippedCards((prev) => ({ ...prev, [inv.id]: false }))
                    }
                  >
                    <FaArrowLeft />
                  </button>
                </div>
                <div className="card-body">
                   <p>
                    <strong>Bio:</strong> {inv.bio}
                  </p>
                  <p>
                    <strong>Startup Stage:</strong> {inv.startupStage}
                  </p>
                  <p>
                    <strong>Team Size</strong> {inv.teamSize}
                  </p>
                  
                  <p>
                    <strong>Vision:</strong> {inv.vision}
                  </p>
                 
                  <p>
                    <strong>Funding Needed:</strong> ₹{inv.fundingNeed}
                  </p>
                  <p>
                    <strong>Description:</strong> {inv.description}
                  </p>

                  <div className="d-flex justify-content-center gap-4">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => window.open(inv.linkdinurl, "_blank")}
                    >
                      🔗 LinkedIn
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => window.open(inv.website, "_blank")}
                    >
                      🌐 Website
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BrowsePitches;
