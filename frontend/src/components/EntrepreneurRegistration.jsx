import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EntrepreneurRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    startupName: "",
    email: "",
    address: "",
    bio: "",
    fundingNeed: "",
    education: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    file: null,
  });

  // Generic handler for text & number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Separate handler for file input
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match with Confirm Password!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("startupname", formData.startupName);
      data.append("email", formData.email);
      data.append("address", formData.address); // if backend expects this
      data.append("bio", formData.bio);
      data.append("fundinggoal", formData.fundingNeed); // backend expects fundinggoal
      data.append("education", formData.education);
      data.append("password", formData.password);
      data.append("contactno", formData.contactNumber);
      data.append("profileImage", formData.file);

      const response = await axios.post("/api/users/register-user", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Success",
        text: response?.data?.message || "Registration successful!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setFormData({
        name: "",
        startupName: "",
        email: "",
        address: "",
        bio: "",
        fundingNeed: "",
        education: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        file: null,
      });

      navigate("/"); // redirect to login or dashboard
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="auth-background d-flex justify-content-center align-items-center">
      <Card className="auth-card glass-card shadow">
        <h3 className="text-center text-white mb-4">Sign up as Entrepreneur</h3>

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control type="file" onChange={handleFileChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              maxLength={10}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              placeholder="Short Bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="fundingNeed"
              placeholder="Funding Need (e.g., 500000)"
              value={formData.fundingNeed}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="startupName"
              placeholder="Startup Name"
              value={formData.startupName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="education"
              placeholder="Education"
              value={formData.education}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="btn-purple w-100">
            Sign up
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "1.1rem",
            }}
          >
            Already have an account?{" "}
            <span style={{ fontWeight: "bold", color: "#0d6efd" }}>
              Sign In
            </span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default EntrepreneurRegistration;
