import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap"; // ✅ Needed for Form.Group and Form.Select
import { ToastContainer, toast } from "react-toastify";

const UpdateProfileInvestor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    contactno: "",
    categories: "", // Single category selected
    maxInvestment: "",
    minInvestment: "",
    bio: "",
  });

  const [aadharPan, setAadharPan] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please log in again.");
      return;
    }

    const data = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append files
    if (aadharPan) data.append("aadharPan", aadharPan);
    if (certificate) data.append("certificate", certificate);
    if (profileImage) data.append("profileImage", profileImage);

    const res = await axios.put("/api/investors/updateProfile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Profile updated successfully!");
    console.log("Updated Investor Data:", res.data.data);

    // ✅ Reset form after success
    setFormData({
      name: "",
      email: "",
      company: "",
      contactno: "",
      categories: "",
      maxInvestment: "",
      minInvestment: "",
      bio: "",
    });
    setAadharPan(null);
    setCertificate(null);
    setProfileImage(null);

    // Also clear file input elements manually (optional)
    document.querySelectorAll('input[type="file"]').forEach(input => input.value = "");
    
  } catch (error) {
    // console.error("Update failed:", error.response?.data || error.message);
    toast.success("Update failed. Please try again!");
  }
};

  return (
    <div className="container d-flex justify-content-center mt-5">
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
              />
      <div className="card shadow-lg p-4 rounded" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="mb-4 text-center text-primary">Update Investor Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input className="form-control" type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <input className="form-control" type="text" name="contactno" placeholder="Contact No" value={formData.contactno} onChange={handleChange} required />
          </div>
          
          {/* ✅ Category dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Industry Category</Form.Label>
            <Form.Select name="categories" value={formData.categories} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Tech">Tech</option>
              <option value="Health">Health</option>
              <option value="Fashion">Fashion</option>
              <option value="Education">Education</option>
              <option value="Agri">Agri</option>
            </Form.Select>
          </Form.Group>

          <div className="mb-3">
            <input className="form-control" type="number" name="minInvestment" placeholder="Minimum Investment" value={formData.minInvestment} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <input className="form-control" type="number" name="maxInvestment" placeholder="Maximum Investment" value={formData.maxInvestment} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <textarea className="form-control" name="bio" placeholder="Bio (max 500 characters)" value={formData.bio} onChange={handleChange} maxLength={500} rows={3} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Aadhar/PAN (PDF or Image):</label>
            <input className="form-control" type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, setAadharPan)} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Certificate (PDF or Image):</label>
            <input className="form-control" type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, setCertificate)} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Profile Image:</label>
            <input className="form-control" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfileImage)} />
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-5">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileInvestor;
