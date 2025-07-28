import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaBars, FaArrowLeft, FaLocationDot } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SavedIdeas = () => {
 const [entrepreneurs, setEntrepreneurs] = useState([]);
const [flippedCards, setFlippedCards] = useState({});

useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/investors/get-saved-entrepreneurs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedEntrepreneurs = res.data.savedEntrepreneurs;

      const mapped = savedEntrepreneurs.map((e) => {
        let image = null; // fallback

        if (
          e.profileImage &&
          e.profileImage.data &&
          e.profileImage.data.data
        ) {
          const base64String = btoa(
            new Uint8Array(e.profileImage.data.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          image = `data:${e.profileImage.contentType};base64,${base64String}`;
        }

        return {
          id: e._id,
          name: e.startupname || "Untitled Startup",
          owner: e.name,
          email: e.email,
          contact: e.contactno,
          category: e.industry,
        categories: e.industry ? [e.industry] : [],
        education: e.education || "Not provided",
        fundingNeed: e.fundinggoal,
        startupStage: e.startupStage || "Not specified",
        teamSize: e.teamSize || "Not specified",
        description: e.description,
          image: image,
          bio: e.bio || "No bio provided",
            linkdinurl: e.linkdinurl?.startsWith("http")
          ? e.linkdinurl
          : `https://${item.linkdinurl}`,

        website: e.websiteurl?.startsWith("http")
          ? e.websiteurl
          : `https://${item.websiteurl}`,
        vision: e.vision || "No vision provided",
        
          saved: true,
        };
      });

      setEntrepreneurs(mapped);
    } catch (err) {
      console.error("Failed to fetch saved entrepreneurs:", err);
    }
  };

  fetchData();
}, []);



 const handleSaveEntrepreneur = async (entrepreneurId) => {
  const token = localStorage.getItem("token");
  const entrepreneur = entrepreneurs.find((e) => e.id === entrepreneurId);

  if (!entrepreneur) return;

  try {
    if (entrepreneur.saved) {
      // If already saved, remove it
      const res = await axios.delete(
        `/api/investors/remove-saved-entrepreneur/${entrepreneurId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Removed from saved");

      // Update UI
      setEntrepreneurs((prev) =>
        prev.filter((e) => e.id !== entrepreneurId)
      );
    } else {
      // Save it
      const res = await axios.post(
        "/api/investors/save-entrepreneur",
        { entrepreneurId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message || "Saved successfully");

      // Mark as saved in state
      setEntrepreneurs((prev) =>
        prev.map((e) =>
          e.id === entrepreneurId ? { ...e, saved: true } : e
        )
      );
    }
  } catch (err) {
    console.error("Error in save/unsave:", err);
    toast.error(err.response?.data?.message || "Action failed");
  }
};


  const handleConnect = async (investorId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `/api/users/make-connection`,
        { investorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Connection request sent!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send connection request"
      );
    }
  };
    
  return (
    <div className="m-4">
      <h1
        className="text-center mb-4 fw-bold"
        style={{
          fontSize: "2.2rem",
          color: "#0d6efd",
          textTransform: "uppercase",
          letterSpacing: "1px",
          borderBottom: "3px solid #0d6efd",
          paddingBottom: "6px",
          marginTop: "10px",
        }}
      >
        Saved Entrepreneurs
      </h1>
      <div className="row">
       {entrepreneurs.map((e) => (
  <div
    key={e.id}
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
        transform: flippedCards[e.id]
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
            src={e.image}
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
            <h6 className="mb-0">{e.name}</h6>
            <small className="text-muted">{e.contact}</small>
          </div>
          <div className="ms-auto">
            <button
              className="btn btn-light rounded-circle"
              onClick={() =>
                setFlippedCards((prev) => ({ ...prev, [e.id]: true }))
              }
            >
              <FaBars />
            </button>
          </div>
        </div>

        <Form className="card-body p-3">
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label
              className="text-muted mb-0 me-2"
              style={{ width: "120px" }}
            >
              Email
            </Form.Label>
            <Form.Control type="text" value={e.email} disabled />
          </Form.Group>
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label
              className="text-muted mb-0 me-2"
              style={{ width: "120px" }}
            >
              Contact
            </Form.Label>
            <Form.Control type="text" value={e.contact} disabled />
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
              value={e.categories.join(", ") || "N/A"}
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
              value={`${e.education}`}
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
              value={`₹${e.fundingNeed}`}
              disabled
            />
          </Form.Group>

           <div className="d-flex justify-content-center gap-4 mt-3">
                              <Button
                                size="sm"
                                variant={
                                  e.connectionStatus === "Pending"
                                    ? "secondary"
                                    : e.connectionStatus === "Accepted"
                                    ? "primary"
                                    : e.connectionStatus === "Rejected"
                                    ? "dark"
                                    : "outline-primary"
                                }
                                onClick={() => handleConnect(e.id)}
                                disabled={
                                  e.connectionStatus === "Pending" ||
                                  e.connectionStatus === "Rejected"
                                }
                              >
                                {e.connectionStatus === "Pending"
                                  ? "Pending"
                                  : e.connectionStatus === "Accepted"
                                  ? "Connected"
                                  : e.connectionStatus === "Rejected"
                                  ? "Rejected"
                                  : "Connect"}
                              </Button>
                             <Button
  size="sm"
  variant={e.saved ? "success" : "outline-success"}
  onClick={() => handleSaveEntrepreneur(e.id)}
>
  {e.saved ? "✓ Saved" : "Save"}
</Button>

                            </div>
        </Form>
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
            <h6 className="mb-0">{e.name}</h6>
            <small className="text-muted">India</small>
          </div>
          <button
            className="btn btn-light rounded-circle"
            onClick={() =>
              setFlippedCards((prev) => ({ ...prev, [e.id]: false }))
            }
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="card-body">
           <p>
            <strong>Bio:</strong> {e.bio}
          </p>
          <p>
            <strong>Startup Stage:</strong> {e.startupStage}
          </p>
          <p>
            <strong>Team Size:</strong> {e.teamSize}
          </p>
          <p>
            <strong>Vision:</strong> {e.vision}
          </p>
            <p>
                    <strong>Funding Needed:</strong> ₹{e.fundingNeed}
                  </p>
          <p>
            <strong>Description:</strong> ₹{e.description}
          </p>

           <div className="d-flex justify-content-center gap-4">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => window.open(e.linkdinurl, "_blank")}
                              >
                                🔗 LinkedIn
                              </Button>
          
                              <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => window.open(e.website, "_blank")}
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

export default SavedIdeas;
