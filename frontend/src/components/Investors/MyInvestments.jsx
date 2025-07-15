import React, { useState, useEffect } from "react";
import "./Investor.css"

const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);

  // Dummy data for now
  useEffect(() => {
    const dummyInvestments = [
      {
        id: 1,
        name: "EcoCrafts by Meena",
        owner: "Meena Joshi",
        category: "Handicrafts",
        amountInvested: 50000,
        date: "2024-08-15",
        status: "Active",
        description: "Handmade eco-friendly home décor items crafted by rural artisans.",
      },
      {
        id: 2,
        name: "Tech4Rural",
        owner: "Priya Sharma",
        category: "Technology",
        amountInvested: 150000,
        date: "2024-09-10",
        status: "Completed",
        description: "Affordable tech solutions for rural schools to improve education access.",
      },
    ];
    setInvestments(dummyInvestments);
  }, []);

  return (
    <div className="container mt-4 my-investments-page">
      <h2 className="mb-4 text-center">💰 My Investments</h2>

      {investments.length === 0 ? (
        <p className="text-center">You have not invested in any startups yet.</p>
      ) : (
        <div className="row">
          {investments.map((inv) => (
            <div className="col-md-6 mb-4" key={inv.id}>
              <div className={`card h-100 shadow-sm border-0 investment-card ${inv.status === "Completed" ? "completed" : "active"}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title">{inv.name}</h5>
                    <span className={`badge ${inv.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}>
                      {inv.status}
                    </span>
                  </div>
                  <h6 className="card-subtitle mb-2 text-muted">
                    👩‍💼 {inv.owner} | 🗂️ {inv.category}
                  </h6>
                  <p className="card-text">
                    <strong>Amount Invested:</strong> ₹{inv.amountInvested}
                  </p>
                  <p className="card-text">
                    <strong>Date:</strong> {inv.date}
                  </p>
                  <p className="card-text">{inv.description.slice(0, 80)}...</p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button className="btn btn-outline-primary btn-sm">
                      🔍 View Details
                    </button>
                    <button className="btn btn-outline-secondary btn-sm">
                      📥 Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInvestments;

