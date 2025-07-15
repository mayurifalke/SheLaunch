import React, { useEffect, useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";

const MainUserDashboard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // TODO: Fetch notifications from backend API
    // For now, using dummy notifications data
    const dummyNotifications = [
      {
        id: 1,
        investorName: "Ramesh Kumar",
        message: "Interested in investing ₹50,000 in EcoCrafts. Please review and approve.",
        status: "Pending",
      },
      {
        id: 2,
        investorName: "Anita Shah",
        message: "Would like to discuss funding your Tech4Rural project with ₹2,00,000.",
        status: "Pending",
      },
    ];
    setNotifications(dummyNotifications);
  }, []);

  const handleApprove = (id) => {
    console.log("Approved notification ID:", id);
    // TODO: Call backend API to update status to Approved
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, status: "Approved" } : notif
      )
    );
  };

  const handleCancel = (id) => {
    console.log("Cancelled notification ID:", id);
    // TODO: Call backend API to update status to Cancelled
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, status: "Cancelled" } : notif
      )
    );
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Notifications from Investors</h3>

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((notif) => (
          <Card key={notif.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">{notif.investorName}</h5>
                <Badge bg={
                  notif.status === "Pending"
                    ? "warning"
                    : notif.status === "Approved"
                    ? "success"
                    : "danger"
                }>
                  {notif.status}
                </Badge>
              </div>
              <p className="card-text">{notif.message}</p>

              {notif.status === "Pending" && (
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(notif.id)}
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancel(notif.id)}
                  >
                    ❌ Cancel
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default MainUserDashboard;
