import React, { useEffect, useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";

const MainAdminDashboard = () => {
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
      <h3 className="mb-4">Admin Dashboard</h3>
    </div>
  );
};

export default MainAdminDashboard;
