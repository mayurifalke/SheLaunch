import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "./Investor.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const InvestorAuthModal = ({ show, handleClose }) => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    interestCategories: "",
    minInvestment: "",
    maxInvestment: "",
  });

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log("Investor SignUp Data:", signupData);
    // Add API call here if needed
    Swal.fire("Success", "Sign up completed!", "success");
    handleClose();
  };

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
              name="contact"
              placeholder="Contact Number"
              value={signupData.contact}
              onChange={handleSignupChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select
              name="interestCategories"
              value={signupData.interestCategories}
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
