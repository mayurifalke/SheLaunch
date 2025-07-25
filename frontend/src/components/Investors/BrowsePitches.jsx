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

  const fetchPitches = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/investors/browse-pitches", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedPitches = res.data.entrepreneurs.map((item) => {
        let image = "/images/person1.png"; // fallback
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
          image: image,
          minInvestment: 10000,
          maxInvestment: 500000,
          saved: false,
          connectionStatus: "None",
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
      toast.error(err.response?.data?.message || "Failed to save pitch");
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

  return (
    <div className="container py-4">
      <div className="row">
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
                    alt="Investor"
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
                      Min Investment
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={`₹${inv.minInvestment}`}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label
                      className="text-muted mb-0 me-2"
                      style={{ width: "120px" }}
                    >
                      Max Investment
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={`₹${inv.maxInvestment}`}
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
                      onClick={() => toast("Connect logic here")}
                    >
                      Connect
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
                      variant={inv.saved ? "success" : "outline-success"}
                      onClick={() => handleSavePitch(inv.id)}
                    >
                      {inv.saved ? "✓ Saved" : "Save"}
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
                    <strong>Contact:</strong> {inv.contact}
                  </p>
                  <p>
                    <strong>Education:</strong> {inv.education}
                  </p>
                  <p>
                    <strong>Categories:</strong>{" "}
                    {inv.categories.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Vision:</strong> {inv.vision}
                  </p>
                  <p>
                    <strong>Bio:</strong> {inv.bio}
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
