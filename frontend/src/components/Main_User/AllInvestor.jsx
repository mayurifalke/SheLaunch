import React, { useState, useEffect, use, useInsertionEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaBars, FaArrowLeft, FaLocationDot } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";

const AllInvestor = () => {
  const [pitches, setPitches] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  // Move fetchData out of useEffect so it's accessible everywhere
const fetchData = async () => {
  const token = localStorage.getItem("token");
  try {
    const resInvestors = await axios.get("/api/users/all-investors", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resSaved = await axios.get("/api/users/get-saved-investors", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resConnections = await axios.get("/api/users/get-connections", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const savedIds = resSaved.data.savedInvestors.map((s) => s._id);

    const investorStatusMap = {};
    resConnections.data.connections.forEach((conn) => {
      investorStatusMap[conn.investor._id] = conn.status;
    });
    console.log("Investor Status Map:", investorStatusMap);


    const mapped = resInvestors.data.investors.map((inv) => ({
      id: inv._id,
      name: inv.name,
      email: inv.email,
      contact: inv.contactno,
      categories: inv.categories || [],
      minInvestment: inv.minInvestment,
      maxInvestment: inv.maxInvestment,
      status: inv.status,
      image: "/images/person1.png",
      saved: savedIds.includes(inv._id),
      connectionStatus: investorStatusMap[inv._id] || null,
    }));

    setPitches(mapped);
  } catch (err) {
    console.error("Failed to fetch investors or saved investors:", err);
  }
};

// useEffect only runs fetchData once
useEffect(() => {
  fetchData();
}, []);



 const handleConnect = async (investorId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `/api/users/make-connection`,
      { investorId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "Connection request sent!");
    fetchData(); // ✅ now this will actually work
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to send connection request"
    );
  }
};


  const handleSaveInvestor = async (investorId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `/api/users/save-investor`,
        { investorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Action successful!");

      // Update local state: toggle saved based on updated savedInvestors list
      setPitches((prev) =>
        prev.map((inv) =>
          inv.id === investorId
            ? { ...inv, saved: res.data.savedInvestors.includes(investorId) }
            : inv
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save/unsave investor"
      );
    }
  };

  return (
    <div className="container py-4">
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
        All Investors
      </h1>
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

                <Form>
                  <div className="card-body p-3">
                    <Form>
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
                        <Form.Control
                          type="text"
                          value={inv.contact}
                          disabled
                        />
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
                    </Form>

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
    inv.connectionStatus === "Pending" ||
    inv.connectionStatus === "Accepted" ||
    inv.connectionStatus === "Rejected"
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
                        variant={inv.saved ? "success" : "outline-success"}
                        onClick={() => handleSaveInvestor(inv.id)}
                      >
                        {inv.saved ? "✓ Saved" : "Save"}
                      </Button>
                    </div>
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
                    <h6 className="mb-0">{inv.name}</h6>
                    <small className="text-muted">
                      <FaLocationDot /> India
                    </small>
                  </div>
                  <button
                    className="btn btn-light rounded-circle"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setFlippedCards((prev) => ({ ...prev, [inv.id]: false }))
                    }
                  >
                    <FaArrowLeft />
                  </button>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Email:</strong> {inv.email}
                  </p>
                  <p>
                    <strong>Contact:</strong> {inv.contact}
                  </p>
                  <p>
                    <strong>Categories:</strong>{" "}
                    {inv.categories.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Min Investment:</strong> ₹{inv.minInvestment}
                  </p>
                  <p>
                    <strong>Max Investment:</strong> ₹{inv.maxInvestment}
                  </p>
                  <p>
                    <strong>Status:</strong> {inv.status}
                  </p>
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

export default AllInvestor;
