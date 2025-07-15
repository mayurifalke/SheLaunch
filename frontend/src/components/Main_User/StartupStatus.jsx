import React, { useEffect, useState } from "react";
import { Card, Badge } from "react-bootstrap";

const StartupStatus = () => {
  const [startup, setStartup] = useState(null);

  useEffect(() => {
    // TODO: Fetch startup data from backend API
    // For now, using dummy data
    const dummyStartup = {
      name: "EcoCrafts by Meena",
      category: "Handicrafts",
      status: "Pending", // Possible values: Pending, Approved, Rejected
    };
    setStartup(dummyStartup);
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow p-3">
        <h4 className="mb-3">🚀 Startup Status</h4>

        {startup ? (
          <>
            <p>
              <strong>Name:</strong> {startup.name}
            </p>
            <p>
              <strong>Category:</strong> {startup.category}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge bg={getStatusVariant(startup.status)}>
                {startup.status}
              </Badge>
            </p>
          </>
        ) : (
          <p>Loading startup details...</p>
        )}
      </Card>
    </div>
  );
};

export default StartupStatus;
