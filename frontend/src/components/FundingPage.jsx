import React, { useEffect, useState } from "react";
import { Card, Button, Form, Modal, Image, Row, Col } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import "./FundingPage.css";
import { FaUserAlt } from "react-icons/fa";

const FundingPage = () => {
  const [investors, setInvestors] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);

  const [filters, setFilters] = useState({
    fundingRange: [0, 5000000],
    location: "",
    investmentType: [],
    verifiedOnly: false,
  });

  // Dummy data
  useEffect(() => {
    const dummyInvestors = [
      {
        id: 1,
        name: "Anil Mehta",
        verified: true,
        company: "SeedSpark Ventures",
        categories: ["Tech", "Education", "Agri"],
        investmentRange: [50000, 1000000],
        location: "Pan India",
        bio: "Angel investor focused on women-led startups with high impact solutions.",
        linkedin: "https://linkedin.com/in/anilmehta",
        website: "https://seedspark.com",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        contactno :"9865324185",
        email:"xyz@gmail.com"
      },
      {
        id: 2,
        name: "Rina Shah",
        verified: false,
        company: "Empower Capital",
        categories: ["Fashion", "Health"],
        investmentRange: [100000, 2000000],
        location: "Maharashtra",
        bio: "Passionate about empowering women entrepreneurs in health and fashion sectors.",
        linkedin: "https://linkedin.com/in/rinashah",
        website: "https://empowercapital.com",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
         contactno :"9865324185",
        email:"xyz@gmail.com"
      },
    ];
    setInvestors(dummyInvestors);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleViewProfile = (investor) => {
    setSelectedInvestor(investor);
    setShowProfileModal(true);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Find Your Ideal Investor</h2>
      <p>Connect with investors aligned with your business category and funding needs.</p>

      {/* Filters Section */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5>Filters</h5>
          <Form>
           <div className="row align-items-end">
  <div className="col-md-3 mb-3">
    <Form.Label>Funding Range (Min ₹)</Form.Label>
    <Form.Control
      type="number"
      name="fundingRangeMin"
      placeholder="e.g. 10000"
      onChange={handleFilterChange}
    />
  </div>

  <div className="col-md-3 mb-3">
    <Form.Label>Funding Range (Max ₹)</Form.Label>
    <Form.Control
      type="number"
      name="fundingRangeMax"
      placeholder="e.g. 5000000"
      onChange={handleFilterChange}
    />
  </div>

  <div className="col-md-3 mb-3">
    <Form.Label>Location Preference</Form.Label>
    <Form.Select name="location" onChange={handleFilterChange}>
      <option value="">All</option>
      <option value="Pan India">Pan India</option>
      <option value="Maharashtra">Maharashtra</option>
      <option value="Gujarat">Gujarat</option>
      <option value="Delhi">Delhi</option>
    </Form.Select>
  </div>

  <div className="col-md-3 mb-3">
    <Button className="w-100 fliter-btn">Apply Filters</Button>
  </div>
</div>

          </Form>
        </Card.Body>
      </Card>

      {/* Investors Grid */}
      <div className="row">
        {investors.map((inv) => (
          <div className="col-md-6 mb-4" key={inv.id}>
            <Card className="h-100 shadow investor-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0">
                     <FaUserAlt />  {inv.name}{" "}
                    {inv.verified && (
                      <FaCheckCircle className="text-success" title="Verified" />
                    )}
                  </h5>
                </div>
                <h6 className="text-muted">{inv.company}</h6>
                          <hr />
                <p className="mb-2">
                  <strong>Interested Categories:</strong>{" "}
                  {inv.categories.join(", ")}
                </p>
                <p className="mb-2">
                  <strong>Investment Range:</strong> ₹{inv.investmentRange[0]} – ₹{inv.investmentRange[1]}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {inv.location}
                </p>
                <p className="mb-2">{inv.bio.slice(0, 100)}...</p>

                <div className="d-flex flex-wrap gap-2">
                  <Button variant="primary" size="sm">💬 Connect</Button>
                  <Button variant="secondary" size="sm">⭐ Save</Button>
                  <Button variant="outline-dark" size="sm" onClick={() => handleViewProfile(inv)}>
                    🔍 View Profile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* View Profile Modal */}
  <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered size="lg" className="investor-modal">
  <Modal.Header closeButton className="border-0 py-3 modal-gradient">
    <Modal.Title className="text-white">👤 Investor Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedInvestor && (
      <div className="text-center">
        <div className="profile-circle mx-auto mb-3">
          <Image
            src={selectedInvestor.image}
            roundedCircle
            width="130"
            height="130"
            className="border border-light shadow"
          />
        </div>
        <h4 className="fw-bold">
          {selectedInvestor.name}{" "}
          {selectedInvestor.verified && (
            <FaCheckCircle className="text-success" title="Verified" />
          )}
        </h4>
        <h6 className="text-muted mb-3">{selectedInvestor.company}</h6>

        <Row className="mb-3 text-start">
          <Col md={6}>
           <p><strong>Categories:</strong> {selectedInvestor.categories.join(", ")}</p>
            <p><strong>Investment Range:</strong> ₹{selectedInvestor.investmentRange[0]} – ₹{selectedInvestor.investmentRange[1]}</p>
            <p><strong>Contact No.</strong>: {selectedInvestor.contactno}</p>
            <p><strong>Email : </strong>{selectedInvestor.email}</p>
          </Col>
          <Col md={6}>
            <p><strong>Location:</strong> {selectedInvestor.location}</p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a href={selectedInvestor.linkedin} target="_blank" rel="noreferrer" className="text-decoration-none" style={{color:"black" }}>
                View Profile
              </a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a href={selectedInvestor.website} target="_blank" rel="noreferrer" className="text-decoration-none" style={{color:"black"}}>
                {selectedInvestor.website}
              </a>
            </p>
          </Col>
        </Row>

        <p className="text-start">
          <strong>Bio:</strong><br />
          {selectedInvestor.bio}
        </p>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer className="border-0 d-flex justify-content-between px-4 pb-4">
    <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
      Close
    </Button>
    <Button className="btn-purple">💬 Connect</Button>
  </Modal.Footer>
</Modal>


      {/* Optional CSS */}
      <style jsx="true">{`
        .investor-card:hover {
          transform: translateY(-3px);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default FundingPage;
