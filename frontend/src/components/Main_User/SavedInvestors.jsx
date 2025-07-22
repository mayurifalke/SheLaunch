import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from "react-bootstrap";
import { FaBars, FaArrowLeft, FaLocationDot } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SavedInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSavedInvestors = async () => {
      try {
        const res = await axios.get("/api/users/get-saved-investors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // backend returns savedInvestors array → map and mark as saved:true
        const mapped = res.data.savedInvestors.map(inv => ({
          id: inv._id,
          name: inv.name,
          email: inv.email,
          contact: inv.contactno,
          categories: inv.categories || [],
          minInvestment: inv.minInvestment,
          maxInvestment: inv.maxInvestment,
          status: inv.status,
          saved: true,
          image: "/images/person1.png",
        }));
        setInvestors(mapped);
      } catch (err) {
        console.error("Failed to fetch saved investors:", err);
        toast.error("Failed to fetch saved investors");
      }
    };
    fetchSavedInvestors();
  }, []);

const handleSaveInvestor = async (investorId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      "/api/users/save-investor",
      { investorId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(res.data.message || "Action successful!");

    // backend returns res.data.savedInvestors (array of saved investors)
    // check if the investorId is still there
    const isStillSaved = res.data.savedInvestors.some(saved => saved._id === investorId);

    if (isStillSaved) {
      // if still saved, keep it
      setInvestors((prev) =>
        prev.map((inv) =>
          inv.id === investorId ? { ...inv, saved: true } : inv
        )
      );
    } else {
      // if unsaved, remove from list
      setInvestors((prev) =>
        prev.filter((inv) => inv.id !== investorId)
      );
    }
  } catch (err) {
    console.error("Save/unsave failed:", err);
    toast.error(err.response?.data?.message || "Action failed");
  }
};

  return (
    <div className='m-4'>
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
        Saved Investors
      </h1>
      <div className="row">
        {investors.map((inv) => (
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
                <div className="d-flex align-items-center p-3 border-bottom" style={{ background: "#fff" }}>
                  <img
                    src={inv.image}
                    alt="Investor"
                    className="rounded-circle"
                    style={{ height: "50px", width: "50px", objectFit: "cover", border: "2px solid #eee" }}
                  />
                  <div className="ms-3">
                    <h6 className="mb-0">{inv.name}</h6>
                    <small className="text-muted">{inv.contact}</small>
                  </div>
                  <div className="ms-auto">
                    <button
                      className="btn btn-light rounded-circle"
                      onClick={() =>
                        setFlippedCards(prev => ({ ...prev, [inv.id]: true }))
                      }
                    >
                      <FaBars />
                    </button>
                  </div>
                </div>

                <Form className="card-body p-3">
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label className="text-muted mb-0 me-2" style={{ width: "120px" }}>Email</Form.Label>
                    <Form.Control type="text" value={inv.email} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label className="text-muted mb-0 me-2" style={{ width: "120px" }}>Contact</Form.Label>
                    <Form.Control type="text" value={inv.contact} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label className="text-muted mb-0 me-2" style={{ width: "120px" }}>Categories</Form.Label>
                    <Form.Control type="text" value={inv.categories.join(", ") || "N/A"} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label className="text-muted mb-0 me-2" style={{ width: "120px" }}>Min Investment</Form.Label>
                    <Form.Control type="text" value={`₹${inv.minInvestment}`} disabled />
                  </Form.Group>
                  <Form.Group className="mb-2 d-flex align-items-center">
                    <Form.Label className="text-muted mb-0 me-2" style={{ width: "120px" }}>Max Investment</Form.Label>
                    <Form.Control type="text" value={`₹${inv.maxInvestment}`} disabled />
                  </Form.Group>

                  <div className="d-flex justify-content-center gap-4 mt-3">
                    <Button size="sm" variant="outline-primary">Connect</Button>
                    <Button
                      size="sm"
                      variant={inv.saved ? "success" : "outline-success"}
                      onClick={() => handleSaveInvestor(inv.id)}
                    >
                      {inv.saved ? "✓ Saved" : "Save"}
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
                <div className="card-header d-flex justify-content-between align-items-center" style={{ background: "#f8f8f8", borderBottom: "1px solid #eee" }}>
                  <div>
                    <h6 className="mb-0">{inv.name}</h6>
                    <small className="text-muted"><FaLocationDot /> India</small>
                  </div>
                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() =>
                      setFlippedCards(prev => ({ ...prev, [inv.id]: false }))
                    }
                  >
                    <FaArrowLeft />
                  </button>
                </div>
                <div className="card-body">
                  <p><strong>Email:</strong> {inv.email}</p>
                  <p><strong>Contact:</strong> {inv.contact}</p>
                  <p><strong>Categories:</strong> {inv.categories.join(", ") || "N/A"}</p>
                  <p><strong>Min Investment:</strong> ₹{inv.minInvestment}</p>
                  <p><strong>Max Investment:</strong> ₹{inv.maxInvestment}</p>
                  <p><strong>Status:</strong> {inv.status}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default SavedInvestors;
