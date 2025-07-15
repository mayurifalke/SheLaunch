import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Tabs,
  Tab,
  Col,
  Row,
  Alert,
} from "react-bootstrap";
import "./Home.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


const EntrepreneurRegistration = () => {
  const [key, setKey] = useState("personal");
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    otherDocs: null,
    password: "",
  });

  const tabOrder = ["personal", "startup", "funding", "documents"];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files });
    } else if (type === "checkbox") {
      let updated = [...formData.investmentTypes];
      if (checked) updated.push(value);
      else updated = updated.filter((v) => v !== value);
      setFormData({ ...formData, investmentTypes: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateCurrentTab = () => {
    let requiredFields = [];
    if (key === "personal") requiredFields = ["name", "email", "phone"];
    if (key === "startup")
      requiredFields = ["startupName", "industryCategory", "startupStage"];
    if (key === "funding") requiredFields = ["fundingGoal"];
    if (key === "documents")
      requiredFields = ["businessLicense", "aadharPan", "startupCertificate"];

    for (let field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        setErrors("Please fill all required fields before proceeding.");
        return false;
      }
    }
    setErrors("");
    return true;
  };

  const handleNext = () => {
    if (validateCurrentTab()) {
      const currentIndex = tabOrder.indexOf(key);
      if (currentIndex < tabOrder.length - 1) {
        setKey(tabOrder[currentIndex + 1]);
      }
    }
  };

  const handlePrev = () => {
    const currentIndex = tabOrder.indexOf(key);
    if (currentIndex > 0) {
      setKey(tabOrder[currentIndex - 1]);
    }
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();

  // Append text fields
  form.append("name", formData.name);
  form.append("email", formData.email);
  form.append("password", formData.password);
  form.append("contactno", formData.phone);
  form.append("education", formData.education);
  form.append("linkdinurl", formData.linkedin);
  form.append("experience", formData.experience);
  form.append("bio", formData.bio);
  form.append("startupname", formData.startupName);
  form.append("industry", formData.industryCategory);
  form.append("vision", formData.visionMission);
  form.append("description", formData.businessDescription);
  form.append("websiteurl", formData.website);
  form.append("fundinggoal", formData.fundingGoal);
  form.append("raisedfunds", formData.raisedSoFar || 0);
  form.append("useoffunds", formData.useOfFunds);
  form.append("pitchdeckurl", formData.pitchDeck);
  form.append("videourl", formData.videoPitch || "");
  form.append("investmentTypes", JSON.stringify(formData.investmentTypes || []));

  // Append files if they exist
  if (formData.businessLicense?.[0]) {
    form.append("businessLicense", formData.businessLicense[0]);
  }

  if (formData.aadharPan?.[0]) {
    form.append("aadhaarPan", formData.aadharPan[0]);
  }

  if (formData.startupCertificate?.[0]) {
    form.append("startupCertificate", formData.startupCertificate[0]);
  }

  if (formData.otherDocs) {
  if (Array.isArray(formData.otherDocs) && formData.otherDocs.length > 0) {
    formData.otherDocs.forEach(file => form.append("otherDocs", file));
  } else if (formData.otherDocs instanceof File) {
    form.append("otherDocs", formData.otherDocs);
  }
}


  try {
    const res = await axios.post("/api/users/register-user", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("User registered:", res.data);
    toast.success("Registration successful!");
    // navigate("/login");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Registration failed");
  }
};



  return (
    <div className="container mt-4">
        <ToastContainer
              position="top-right"
              className="p-3"
              autoClose={5000} // Auto-close after 5 seconds
              hideProgressBar={false} // Hide the progress bar if you want
              closeButton={true} // Optional: hide close button
            />
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4  fw-bold">Entrepreneur Registration</h2>
        <Form onSubmit={handleSubmit}>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4 mt-4"
            fill
            variant="pills"
          >
            {/* Personal Info Tab */}
            <Tab eventKey="personal"   title={<span className="documents-tab">Personal Info</span>}>
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
                  placeholder="user@example.com"
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
                  placeholder="....."
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
            <Tab eventKey="startup"  title={<span className="documents-tab">Startup Info</span>}>
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
                  <option value="Revenue-generating">Revenue-generating</option>
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
                  Register
                </Button>
              )}
            </Col>
          </Row>
        </Form>
       <center>
  <Link to="/login" style={{ textDecoration: "none", color: "#555",fontSize:"1.2rem" }}>
    Already have an account? <span style={{ fontWeight: "bold", color: "#0d6efd" }}>Log in</span>
  </Link>
</center>

      </Card>
    </div>
  );
};

export default EntrepreneurRegistration;
