import React, { useEffect, useState } from "react";
import { Button, ListGroup, Image } from "react-bootstrap";
import axios from "axios";
import { MdDelete } from "react-icons/md";

function MyConnections() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchConnections = async () => {
    try {
      const response = await axios.get("/api/users/get-connections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allConnections = response.data.connections || [];
      setPendingRequests(allConnections.filter((c) => c.status === "Pending"));
      setAcceptedConnections(
        allConnections.filter((c) => c.status === "Accepted")
      );
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const handleAccept = async (connectionId, status) => {
    try {
      await axios.put(
        "/api/users/update-connection-status",
        { connectionId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConnections();
    } catch (error) {
      console.error("Error updating connection:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="container py-4">
      {/* Pending Invitations Heading */}
      <div className="d-flex align-items-center mb-3">
        <h4 className="fw-semibold text-primary m-0">
          🔔 Pending Invitations{" "}
          <span className="badge bg-secondary">{pendingRequests.length}</span>
        </h4>
        <div className="flex-grow-1 border-bottom ms-2"></div>
      </div>

      <ListGroup variant="flush" className="mb-4">
        {pendingRequests.map((req) => {
          const investor = req.investor;
          return (
            <ListGroup.Item
              key={req._id}
              className="d-flex align-items-start justify-content-between py-3"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <div className="d-flex">
                <Image
                  src="/logo1.jpg"
                  roundedCircle
                  style={{ width: "48px", height: "48px", marginRight: "12px" }}
                />
                <div>
                  <div className="fw-semibold">{investor.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {investor.categories?.join(", ") || "Investor"}
                  </div>
                  {/* <small className="text-muted">3 mutual connections</small> */}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAccept(req._id, true)}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleAccept(req._id, false)}
                >
                  Reject
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {/* Accepted Connections Heading */}
      <div className="d-flex align-items-center mb-3 mt-4">
        <h4 className="fw-semibold text-success m-0">
          🤝 Connected Investors{" "}
          <span className="badge bg-secondary">{acceptedConnections.length}</span>
        </h4>
        <div className="flex-grow-1 border-bottom ms-2"></div>
      </div>

      <ListGroup variant="flush">
        {acceptedConnections.map((conn) => {
          const investor = conn.investor;
          return (
            <ListGroup.Item
              key={conn._id}
              className="d-flex align-items-start justify-content-between py-3"
              style={{ borderBottom: "1px solid #eee" }}
            >
              <div className="d-flex">
                <Image
                  src="/logo1.jpg"
                  roundedCircle
                  style={{ width: "48px", height: "48px", marginRight: "12px" }}
                />
                <div>
                  <div className="fw-semibold">{investor.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#555" }}>
                    {investor.categories?.join(", ") || "Investor"}
                  </div>
                  <small className="text-muted">
                    Connected on {new Date(conn.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div className="d-flex align-items-center position-relative">
                <Button size="sm" variant="outline-primary">
                  Message
                </Button>
                <button
                  className="btn btn-link mt-2 text-muted"
                  style={{
                    fontSize: "20px",
                    lineHeight: "1",
                    textDecoration: "none",
                  }}
                  onClick={() =>
                    setOpenMenuId(openMenuId === conn._id ? null : conn._id)
                  }
                >
                  ⋯
                </button>
                {openMenuId === conn._id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      zIndex: 10,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <button
                      className="btn btn-link text-danger p-0"
                      style={{ textDecoration: "none", fontSize: "0.9rem" }}
                      onClick={() => {
                        setOpenMenuId(null);
                        handleAccept(conn._id, false);
                      }}
                    >
                      <MdDelete /> Remove connection
                    </button>
                  </div>
                )}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}

export default MyConnections;
