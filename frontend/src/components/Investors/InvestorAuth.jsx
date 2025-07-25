import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "./Investor.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";

const InvestorAuthModal = ({ show, handleClose }) => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    contactno: "",
    categories: "",
    minInvestment: "",
    maxInvestment: "",
    aadharPan: null,
    certificate: null,
  });

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

const handleSignupSubmit = async (e) => {
  e.preventDefault();
  console.log("Investor SignUp Data:", signupData);

  try {
    const formData = new FormData();

    for (const key in signupData) {
      if (key !== "aadharPan" && key !== "certificate") {
        formData.append(key, signupData[key]);
      }
    }

    if (signupData.aadharPan) {
      formData.append('aadharPan', signupData.aadharPan);
    }
    if (signupData.certificate) {
      formData.append('certificate', signupData.certificate);
    }

    const res = await axios.post("/api/investors/register-investor", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("API Response:", res.data);

    Swal.fire("Success", "Sign up completed!", "success");
    setSignupData({
      name: "",
      email: "",
      password: "",
      contactno: "",
      categories: "",
      minInvestment: "",
      maxInvestment: "",
      aadharPan: null,
      certificate: null,
    });
    handleClose();

  } catch (error) {
    console.error("API Error:", error);
    Swal.fire("Error", error.response?.data?.message || "Registration failed", "error");
  }
};



  const handleChange = (e) => {
    const { name, files } = e.target;   
    if (files && files.length > 0) {
      setSignupData({ ...signupData, [name]: files[0] });
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="md"
      className="auth-background"
    >
      <Modal.Body className="glass-card p-4">
        <Modal.Header closeButton closeVariant="white" className="border-0" />
        <h3 className="text-center text-white mb-4">Investor Sign Up</h3>

        <Form onSubmit={handleSignupSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupData.name}
              onChange={handleSignupChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="contactno"
              placeholder="Contact Number"
              value={signupData.contactno}
              onChange={handleSignupChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select
              name="categories"
              value={signupData.categories}
              onChange={handleSignupChange}
              required
            >
              <option value="">Select Interest Category</option>
              <option value="Technology">Technology</option>
              <option value="Fashion">Fashion</option>
              <option value="Education">Education</option>
              <option value="Rural Business">Rural Business</option>
              <option value="Services">Services</option>
              <option value="Healthcare">Healthcare</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="minInvestment"
              placeholder="Min Investment (₹)"
              value={signupData.minInvestment}
              onChange={handleSignupChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              name="maxInvestment"
              placeholder="Max Investment (₹)"
              value={signupData.maxInvestment}
              onChange={handleSignupChange}
            />
          </Form.Group>

           <Form.Group className="mb-3">
            <label htmlFor="">Adhar Card / Pan card</label>
            <Form.Control
                               type="file"
                               name="aadharPan"
                               onChange={handleChange}
                             />
          </Form.Group>

          <Form.Group className="mb-3">
            <label htmlFor="">Company Certificate / Proof of funds</label>
            <Form.Control
              type="file"
              name="certificate"
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" className="btn-purple w-100 mt-2">
            Sign Up
          </Button>

        <div className="text-center mt-3">
          <Link to="/login" style={{ textDecoration: "none",  color: "white",fontSize:"1.2rem" }}>
    Already have an account? <span onClick={handleClose} style={{ fontWeight: "bold", color: "#0d6efd" }}>Log in</span>
  </Link></div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InvestorAuthModal;
