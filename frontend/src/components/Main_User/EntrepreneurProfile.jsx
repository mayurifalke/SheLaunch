import React, { useState } from "react";
import {
  Accordion,
  Card,
  Form,
  Button,
  Image,
  Row,
  Col,
  Badge,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Entrepreneur.css";

const EntrepreneurProfile = () => {
  const [key, setKey] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    linkedin: "",
    education: "",
    experience: "",
    bio: "",
    startupName: "",
    industryCategory: "",
    startupStage: "",
    businessDescription: "",
    visionMission: "",
    website: "",
    teamSize: "",
    fundingGoal: "",
    investmentTypes: [],
    raisedSoFar: "",
    useOfFunds: "",
    pitchDeck: "",
    videoPitch: "",
    businessLicense: null,
    aadharPan: null,
    startupCertificate: null,
    otherDocs: [],
  });
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const newTypes = checked
          ? [...prev.investmentTypes, value]
          : prev.investmentTypes.filter((v) => v !== value);
        return { ...prev, investmentTypes: newTypes };
      });
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files.length > 1 ? Array.from(files) : files[0],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate required fields here if needed
    // show a toast
    toast.success("Registration submitted successfully!");
    console.log(formData);
  };

  const handleNext = () => {
    if (key === "personal") setKey("startup");
    else if (key === "startup") setKey("funding");
    else if (key === "funding") setKey("documents");
  };

  const handlePrev = () => {
    if (key === "documents") setKey("funding");
    else if (key === "funding") setKey("startup");
    else if (key === "startup") setKey("personal");
  };

  return (
    <div className="entrepreneur-profile mt-4">
      <h1
        className="text-center mb-4 fw-bold"
        style={{
          fontSize: "2.2rem",
          color: "#0d6efd", // Bootstrap primary blue
          textTransform: "uppercase",
          letterSpacing: "1px",
          borderBottom: "3px solid #0d6efd",
          // display: "inline-block",
          paddingBottom: "6px",
          marginTop: "10px",
        }}
      >
        Update Profile
      </h1>

      <div className="container mb-6">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
        <Card className="shadow-lg p-4">
          <Form onSubmit={handleSubmit}>
            <Tabs
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 mt-4"
              fill
              variant="pills"
            >
              {/* Personal Info Tab */}
              <Tab
                eventKey="personal"
                title={<span className="documents-tab">Personal Info</span>}
              >
                {errors && <Alert variant="danger">{errors}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Name*</Form.Label>
                  <Form.Control
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email*</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password*</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone*</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Education</Form.Label>
                  <Form.Control
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Experience</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Short Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
              </Tab>

              {/* Startup Info Tab */}
              <Tab
                eventKey="startup"
                title={<span className="documents-tab">Startup Info</span>}
              >
                {errors && <Alert variant="danger">{errors}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Startup Name*</Form.Label>
                  <Form.Control
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Industry Category*</Form.Label>
                  <Form.Select
                    name="industryCategory"
                    value={formData.industryCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Tech">Tech</option>
                    <option value="Health">Health</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Education">Education</option>
                    <option value="Agri">Agri</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Startup Stage*</Form.Label>
                  <Form.Select
                    name="startupStage"
                    value={formData.startupStage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Revenue-generating">
                      Revenue-generating
                    </option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Business Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vision & Mission</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="visionMission"
                    value={formData.visionMission}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Team Size</Form.Label>
                  <Form.Control
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Tab>

              {/* Funding Info Tab */}
              <Tab
                eventKey="funding"
                title={<span className="documents-tab">Funding Info</span>}
              >
                {errors && <Alert variant="danger">{errors}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Funding Goal (₹)*</Form.Label>
                  <Form.Control
                    type="number"
                    name="fundingGoal"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Investment Type</Form.Label>
                  <br />
                  {["Equity", "Grant", "Loan", "Mentorship"].map((type) => (
                    <Form.Check
                      inline
                      key={type}
                      type="checkbox"
                      label={type}
                      value={type}
                      name="investmentTypes"
                      onChange={handleChange}
                    />
                  ))}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Raised So Far (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="raisedSoFar"
                    value={formData.raisedSoFar}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Use of Funds</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="useOfFunds"
                    value={formData.useOfFunds}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Pitch Deck Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="pitchDeck"
                    value={formData.pitchDeck}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Video Pitch (link or upload)</Form.Label>
                  <Form.Control
                    type="text"
                    name="videoPitch"
                    value={formData.videoPitch}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Tab>

              {/* Documents Tab */}
              <Tab
                eventKey="documents"
                title={<span className="documents-tab">Documents</span>}
              >
                {errors && <Alert variant="danger">{errors}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Business License*</Form.Label>
                  <Form.Control
                    type="file"
                    name="businessLicense"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhaar/PAN*</Form.Label>
                  <Form.Control
                    type="file"
                    name="aadharPan"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Startup Certificate*</Form.Label>
                  <Form.Control
                    type="file"
                    name="startupCertificate"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Other Docs</Form.Label>
                  <Form.Control
                    type="file"
                    name="otherDocs"
                    onChange={handleChange}
                    multiple
                  />
                </Form.Group>
              </Tab>
            </Tabs>

            <Row className="mt-3">
              <Col className="d-flex justify-content-between">
                {key !== "personal" && (
                  <Button variant="secondary" onClick={handlePrev}>
                    Previous
                  </Button>
                )}
                {key !== "documents" ? (
                  <Button variant="primary" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="entrepreneur-btn">
                    Update Profile
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EntrepreneurProfile;
