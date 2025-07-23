import React, { useEffect, useState } from "react";
import { Button, ListGroup, Image } from "react-bootstrap";
import axios from "axios";

function MyConnections() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);

  const token = localStorage.getItem("token");

  const fetchConnections = async () => {
    try {
      const response = await axios.get("/api/users/get-connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allConnections = response.data.connections;

      // Split connections by status
      const pending = allConnections.filter(c => c.status === "Pending");
      const accepted = allConnections.filter(c => c.status === "Accepted");

      setPendingRequests(pending);
      setAcceptedConnections(accepted);

    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await axios.post(
        `/api/users/accept-connection`,
        { connectionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConnections(); // refresh both lists
    } catch (error) {
      console.error("Error accepting connection:", error);
    }
  };

  const handleIgnore = async (connectionId) => {
    try {
      await axios.post(
        `/api/users/reject-connection`,
        { connectionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchConnections(); // refresh
    } catch (error) {
      console.error("Error rejecting connection:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="container py-4">
      {/* Pending Requests */}
      <h2 className="fw-bold mb-3">Received Invitations ({pendingRequests.length})</h2>
      <ListGroup variant="flush" className="mb-4">
        {pendingRequests.map((req, idx) => {
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
                  <small className="text-muted">
                    {investor.categories?.join(", ") || "Investor"}
                  </small>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>
                    {/* Replace with actual mutual connections if you have */}
                    3 mutual connections
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button size="sm" variant="primary" onClick={() => handleAccept(req._id)}>
                  Accept
                </Button>
                <Button size="sm" variant="outline-secondary" onClick={() => handleIgnore(req._id)}>
                  Ignore
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {/* Accepted Connections */}
      <h2 className="fw-bold mb-3">My Connections</h2>
      <ListGroup variant="flush">
        {acceptedConnections.map((conn, idx) => {
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
              <div className="d-flex align-items-center">
                <Button size="sm" variant="outline-primary">
                  Message
                </Button>
                <div className="ms-2 text-muted" style={{ cursor: "pointer" }}>
                  ⋯
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}

export default MyConnections;
