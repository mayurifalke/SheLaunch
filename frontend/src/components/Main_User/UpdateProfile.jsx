import React, { useEffect, useState } from "react";
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
  ProgressBar,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Entrepreneur.css";
import axios from "axios";

const UpdateProfile = () => {
  const [key, setKey] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactno: "",
    linkdinurl: "",
    education: "",
    experience: "",
    bio: "",
    startupname: "",
    industry: "",
    startupStage: "",
    description: "",
    vision: "",
    websiteurl: "",
    teamSize: "",
    fundinggoal: "",
    investmentTypes: [],
    raisedfunds: "",
    useoffunds: "",
    pitchdeckurl: "",
    videourl: "",
    businessLicense: null,
    aadharPan: null,
    startupCertificate: null,
    otherDocs: [],
  });
  const [preview, setPreview] = useState({
    profileImage: "",
    businessLicense: "",
    aadharPan: "",
    startupCertificate: "",
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
      if (name === "otherDocs") {
        const filesArray = Array.from(files);
        setFormData((prev) => ({
          ...prev,
          [name]: filesArray,
        }));
        const urls = filesArray.map((file) => URL.createObjectURL(file));
        setPreview((prev) => ({
          ...prev,
          [name]: urls,
        }));
      } else {
        const file = files[0];
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
        if (file) {
          const url = URL.createObjectURL(file);
          setPreview((prev) => ({
            ...prev,
            [name]: url,
          }));
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (Array.isArray(value)) {
          fd.append(key, JSON.stringify(value));
        } else if (value instanceof File || value instanceof Blob) {
          fd.append(key, value);
        } else if (
          Array.isArray(value) &&
          value.every((item) => item instanceof File)
        ) {
          value.forEach((file) => fd.append(key, file));
        } else {
          fd.append(key, value);
        }
      });

      await axios.put("/api/users/update-profile", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/users/entrepreneur-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data.entrepreneur;

          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            contactno: data.contactno || "",
            linkdinurl: data.linkdinurl || "",
            education: data.education || "",
            experience: data.experience || "",
            bio: data.bio || "",
            startupname: data.startupname || "",
            industry: data.industry || "",
            startupStage: data.startupStage || "",
            vision: data.vision || "",
            description: data.description || "",
            websiteurl: data.websiteurl || "",
            fundinggoal: data.fundinggoal || "",
            raisedfunds: data.raisedfunds || "",
            teamSize: data.teamSize || "",
            investmentTypes: data.investmentTypes || [],
            useoffunds: data.useoffunds || "",
            pitchdeckurl: data.pitchdeckurl || "",
            videourl: data.videourl || "",
            otherDocs: [],
            businessLicense: data.businessLicense || null,
            aadharPan: data.aadharPan || null,
            startupCertificate: data.startupCertificate || null,
          }));

          const makeBase64 = (fileObj) => {
            try {
              if (fileObj && fileObj.data && fileObj.contentType) {
                const binary = new Uint8Array(fileObj.data.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                );
                return `data:${fileObj.contentType};base64,${btoa(binary)}`;
              }
            } catch (e) {
              console.error("Failed to convert file to base64:", e);
            }
            return "";
          };

          setPreview({
            businessLicense: makeBase64(data.businessLicense),
            aadharPan: makeBase64(data.aadharPan),
            startupCertificate: makeBase64(data.startupCertificate),
            profileImage: makeBase64(data.profileImage), // <-- new
            otherDocs: Array.isArray(data.otherDocs)
              ? data.otherDocs.map(makeBase64).filter(Boolean)
              : [],
          });
        })
        .catch((error) => {
          console.error("Failed to load profile:", error);
        });
    }
  }, []);

  const calculateProfileCompletion = () => {
    const requiredFields = [
      "name",
      "email",
      "contactno",
      "linkdinurl",
      "education",
      "experience",
      "bio",
      "startupname",
      "industry",
      "startupStage",
      "description",
      "vision",
      "websiteurl",
      "teamSize",
      "fundinggoal",
      "investmentTypes",
      "raisedfunds",
      "useoffunds",
      "pitchdeckurl",
      "videourl",
      "businessLicense",
      "aadharPan",
      "startupCertificate",
    ];

    let filled = 0;

    requiredFields.forEach((field) => {
      if (field === "investmentTypes") {
        if (
          formData[field] &&
          Array.isArray(formData[field]) &&
          formData[field].length > 0
        ) {
          filled += 1;
        }
      } else if (
        ["businessLicense", "aadharPan", "startupCertificate"].includes(field)
      ) {
        if (
          formData[field] &&
          (formData[field] instanceof File ||
            (typeof formData[field] === "object" &&
              formData[field].data &&
              formData[field].contentType))
        ) {
          filled += 1;
        }
      } else {
        if (formData[field] && formData[field].toString().trim() !== "") {
          filled += 1;
        }
      }
    });

    return Math.round((filled / requiredFields.length) * 100);
  };

  return (
    <div className="entrepreneur-profile mt-4">
      <h1
        className="text-center mb-4 fw-bold"
        style={{
          fontSize: "2.2rem",
          color: "#0d6efd",
          textTransform: "uppercase",
          letterSpacing: "1px",
          borderBottom: "3px solid #0d6efd",
          paddingBottom: "6px",
          marginTop: "10px",
        }}
      >
        Update Profile
      </h1>

      <div className="container mb-3">
        <ProgressBar
          now={calculateProfileCompletion()}
          label={`${calculateProfileCompletion()}% Complete`}
          variant={
            calculateProfileCompletion() < 40
              ? "danger"
              : calculateProfileCompletion() < 80
              ? "warning"
              : "success"
          }
          striped
          animated
          style={{
            height: "20px", // Increased height
            borderRadius: "10px", // Rounded corners
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)", // Soft shadow
            fontWeight: "bold", // Bold text
            fontSize: "1rem", // Bigger text
            backgroundColor: "#e9ecef", // Light grey track
            overflow: "hidden", // For rounded corners effect
          }}
        />
      </div>

      <div className="container mb-6">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
        />
        <Card className="shadow-lg p-4">
          <Form>
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
                  <Form.Label>Profile Image*</Form.Label>
                  {preview.profileImage && (
                    <div className="mb-2">
                      <Image
                        src={preview.profileImage}
                        alt="Profile"
                        thumbnail
                        width={200}
                      />
                    </div>
                  )}
                  <Form.Control
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
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
                  <Form.Label>Contact No*</Form.Label>
                  <Form.Control
                    name="contactno"
                    value={formData.contactno}
                    maxLength={10}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn Profile</Form.Label>
                  <Form.Control
                    type="url"
                    name="linkdinurl"
                    value={formData.linkdinurl}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Education*</Form.Label>
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
                  <Form.Label>Short Bio*</Form.Label>
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
                    name="startupname"
                    value={formData.startupname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Industry Category</Form.Label>
                  <Form.Select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
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
                  <Form.Label>Startup Stage</Form.Label>
                  <Form.Select
                    name="startupStage"
                    value={formData.startupStage}
                    onChange={handleChange}
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
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vision & Mission</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="websiteurl"
                    value={formData.websiteurl}
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
                    name="fundinggoal"
                    value={formData.fundinggoal}
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
                      checked={formData.investmentTypes.includes(type)}
                      onChange={handleChange}
                    />
                  ))}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Raised So Far (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="raisedfunds"
                    value={formData.raisedfunds}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Use of Funds</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="useoffunds"
                    value={formData.useoffunds}
                    onChange={handleChange}
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Pitch Deck Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="pitchdeckurl"
                    value={formData.pitchdeckurl}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Video Pitch (link or upload)</Form.Label>
                  <Form.Control
                    type="text"
                    name="videourl"
                    value={formData.videourl}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Tab>

              {/* Documents Tab */}
              <Tab
                eventKey="documents"
                title={<span className="documents-tab">Documents</span>}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Business License</Form.Label>
                  {preview.businessLicense && (
                    <div className="mb-2">
                      <Image
                        src={preview.businessLicense}
                        alt="Business License"
                        thumbnail
                        width={200}
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="businessLicense"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Aadhaar/PAN</Form.Label>
                  {preview.aadharPan && (
                    <div className="mb-2">
                      <Image
                        src={preview.aadharPan}
                        alt="Aadhaar/PAN"
                        thumbnail
                        width={200}
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="aadharPan"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Startup Certificate</Form.Label>
                  {preview.startupCertificate && (
                    <div className="mb-2">
                      <Image
                        src={preview.startupCertificate}
                        alt="Startup Certificate"
                        thumbnail
                        width={200}
                      />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name="startupCertificate"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Tab>
            </Tabs>

            <Row className="mt-3">
              <Col className="d-flex justify-content-between">
                {key !== "personal" && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePrev}
                  >
                    Previous
                  </Button>
                )}
                {key !== "documents" ? (
                  <Button type="button" variant="primary" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="entrepreneur-btn"
                    onClick={handleSubmit}
                  >
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

export default UpdateProfile;
