import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Label, } from 'recharts';
import { Card, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { BsClock } from "react-icons/bs";


const investmentData = [
  { month: 'Jan', amount: 40000 },
  { month: 'Feb', amount: 30000 },
  { month: 'Mar', amount: 20000 },
  { month: 'Apr', amount: 27000 },
  { month: 'May', amount: 18000 },
  { month: 'Jun', amount: 35000 },
];

const suggestedStartups = [
  { name: 'EcoTiffin', sector: 'Sustainability', founder: 'Anjali Rao' },
  { name: 'SkillSathi', sector: 'EdTech', founder: 'Ritika Jain' },
  { name: 'MedMate', sector: 'Healthcare', founder: 'Aarti Patil' },
];

const messages = [
  { from: 'Anjali (EcoTiffin)', msg: 'Thank you for reviewing our pitch. Would love to connect!' },
  { from: 'Ritika (SkillSathi)', msg: 'Can we schedule a quick call this weekend?' },
];

const events = [
  { title: 'Investor-Startup Meet', date: 'Aug 5, 2025', time: '5 PM' },
  { title: 'Pitch Fest - Health Startups', date: 'Aug 10, 2025', time: '11 AM' },
];

const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


const StatCard = ({ title, value, bgGradient, icon }) => (
  <Card className={`text-white mb-3 ${bgGradient} shadow rounded-4`}>
    <Card.Body className="d-flex flex-column justify-content-between" style={{ height: '130px' }}>
      <div>
        <h5 className="fw-semibold mb-1">{value}</h5>
        <p className="mb-2">{title}</p>
      </div>
      <div className="d-flex justify-content-between align-items-center">
       <small className="d-flex align-items-center">
  <BsClock className="me-1" /> update: {currentTime}
</small>

        {/* Placeholder for mini chart or bars */}
        <div className="d-flex gap-1">
          <div style={{ width: 5, height: 15 }} className="bg-white rounded"></div>
          <div style={{ width: 5, height: 10 }} className="bg-white rounded opacity-75"></div>
          <div style={{ width: 5, height: 20 }} className="bg-white rounded"></div>
          <div style={{ width: 5, height: 12 }} className="bg-white rounded opacity-75"></div>
        </div>
      </div>
    </Card.Body>
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-light p-2 border rounded shadow-sm">
        <strong>{label}</strong>
        <br />
        Investment: ₹{payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

const InvestorDashboard = () => {
   const [acceptedConnections, setAcceptedConnections] = useState([]);
   const [savedIdeasCount,setSavedIdeasCount] = useState(0);

    const fetchConnections = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/investors/get-connections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allConnections = response.data.connections || [];
      // console.log("Fetched Connections:", allConnections);
      setAcceptedConnections(allConnections.filter(c => c.status === "Accepted"));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

   const fetchSavedIdeas = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/investors/get-saved-entrepreneurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allSavedIdeas = response.data.savedEntrepreneurs || [];
      console.log("Fetched Saved:", allSavedIdeas);
      setSavedIdeasCount(allSavedIdeas);
    } catch (error) {
      console.error("Error fetching Ideas:", error);
    }
  };

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

    const [suggestedStartups, setSuggestedStartups] = useState([]);

  const fetchSuggestedStartups = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/investors/suggestStartups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched suggestStartups:", response.data.data);
      setSuggestedStartups(response.data.data); // ✅ Update state
    } catch (error) {
      console.error("Error fetching Ideas:", error);
    }
  };

  useEffect(() => {
    fetchSuggestedStartups();
  }, []);

  const bufferToBase64 = (buffer) => {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
};


  // console.log("Accepted Connections:", savedIdeasCount.length);


  return (
    <div className="container mt-4">
      <h2
  className="text-center mb-4 fw-bold"
  style={{
    color: "#6f42c1",
    textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    fontSize: "2.2rem",
    position: "relative",
  }}
>
  Investor Dashboard
  <div
    style={{
      height: "4px",
      width: "120px",
      background: "#a754e6",
      margin: "8px auto 0",
      borderRadius: "5px",
    }}
  ></div>
</h2>


      {/* Overview Stats */}
      <Row className="mb-4 mt-4">
  <Col md={3}>
    <StatCard
      title="Total Invested"
      value="₹1.5 Cr"
      bgGradient="bg-gradient bg-warning"
    />
  </Col>
  <Col md={3}>
    <StatCard
      title="Connections Made"
      value={acceptedConnections.length}
      bgGradient="bg-gradient bg-success"
    />
  </Col>
  <Col md={3}>
    <StatCard
      title="Saved Startups"
      value={savedIdeasCount.length} 
      bgGradient="bg-gradient bg-danger"
    />
  </Col>
  <Col md={3}>
    <StatCard
      title="Invested Startups"
      value="500"
      bgGradient="bg-gradient bg-info"
    />
  </Col>
</Row>

      {/* Investment Chart */}
    <Card className="mb-4 shadow-sm border-0">
  <Card.Body>
    <Card.Title className="text-primary mb-3">
      Monthly Investment Overview
    </Card.Title>

    {/* ✅ Graph container with reduced width */}
    <div className="w-75 mx-auto">
      <ResponsiveContainer width="70%" height={300}>
        <BarChart data={investmentData} radius={[10, 10, 0, 0]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month">
            <Label value="Month" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label
              value="Amount (₹)"
              angle={-90}
              position="insideLeft"
              offset={-10}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="url(#colorUv)" radius={[10, 10, 0, 0]} />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#83a6ed" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card.Body>
</Card>

      {/* Suggested Startups */}
    <Card className="mb-4 shadow-sm border-0">
  <Card.Body>
    <Card.Title className="text-primary fs-4 mb-3">🚀 Suggested Startups for You</Card.Title>

    {suggestedStartups.length === 0 ? (
      <p className="text-muted">No suggested startups found.</p>
    ) : (
      suggestedStartups.map((s, idx) => (
        <div
          key={s._id}
          className="d-flex align-items-center justify-content-between border rounded p-3 my-3 bg-light shadow-sm"
        >
          <div className="d-flex align-items-start">
            {/* Profile Image */}
            {s.profileImage?.data?.data ? (
              <img
                src={`data:${s.profileImage.contentType};base64,${bufferToBase64(s.profileImage.data.data)}`}
                alt="Startup"
                width="60"
                height="60"
                className="rounded-circle me-3 border"
              />
            ) : (
              <div className="rounded-circle bg-secondary me-3" style={{ width: 60, height: 60 }} />
            )}

            <div>
              <h6 className="mb-1 text-dark">
                {s.name} <span className="text-muted">({s.startupname})</span>
              </h6>
              <p className="mb-1 text-muted small">
                <strong>Stage:</strong> {s.startupStage} &nbsp; | &nbsp; <strong>Industry:</strong> {s.industry}
              </p>
              <p className="mb-0 small text-secondary">{s.description}</p>
            </div>
          </div>

        <Button
  href="/investors/browsepitches"
  size="sm"
  className="ms-3 fw-semibold px-3 py-2"
  style={{
    backgroundColor: "#a754e6",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    boxShadow: "0 4px 10px rgba(167, 84, 230, 0.4)",
    transition: "all 0.3s ease-in-out",
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 6px 15px rgba(167, 84, 230, 0.6)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 10px rgba(167, 84, 230, 0.4)";
  }}
>
   View Pitch
</Button>

        </div>
      ))
    )}
  </Card.Body>
</Card>



      {/* Events */}
      {/* <Card className="mb-5">
        <Card.Body>
          <Card.Title>Upcoming Events</Card.Title>
          {events.map((e, idx) => (
            <div key={idx} className="my-2">
              <strong>{e.title}</strong><br />
              {e.date} at {e.time}
            </div>
          ))}
        </Card.Body>
      </Card> */}
    </div>
  );
};

export default InvestorDashboard;
