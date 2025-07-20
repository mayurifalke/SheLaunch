import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  MenuOutlined,
  PersonOutlined,
  ArrowDropDown,
} from "@mui/icons-material";
import { ColorModeContext } from "../../../theme";
import { FaEye } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { ToggledContext } from "../../../layouts/EnterpreneurLayout";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";

export const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const { setToggled } = useContext(ToggledContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("She_Launch");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch profile data when modal is opened
  useEffect(() => {
    const token = localStorage.getItem("token"); // use correct key
    if (showModal && token) {
      axios
        .get("/api/users/entrepreneur-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setProfileData(response.data.entrepreneur); // your actual data
        })
        .catch((error) => {
          console.error("Failed to load profile:", error);
        });
    }
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let profileImageSrc = "/logo1.jpg"; // fallback image
  if (profileData?.profileImage?.data?.data) {
    const byteArray = new Uint8Array(profileData.profileImage.data.data);
    const base64String = btoa(
      byteArray.reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    profileImageSrc = `data:${profileData.profileImage.contentType};base64,${base64String}`;
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            sx={{
              display: `${isMdDevices ? "flex" : "none"}`,
              color: "#a754e6",
            }}
            onClick={() => setToggled(true)}
          >
            <MenuOutlined />
          </IconButton>
        </Box>

        <Box position="relative" className="profile-dropdown">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: "4px",
            }}
          >
            <span
              style={{
                marginRight: "4px",
                fontWeight: "500",
                color: "#333",
                fontSize: "1rem",
              }}
            >
              Profile
            </span>
            <PersonOutlined sx={{ color: "#a754e6" }} />
            <ArrowDropDown sx={{ color: "#a754e6" }} />
          </div>

          {showDropdown && (
            <Box
              sx={{
                position: "absolute",
                top: "150%",
                right: 0,
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                overflow: "hidden",
                minWidth: "160px",
                zIndex: 999,
              }}
            >
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#a754e6";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#333";
                }}
              >
                <FaEye /> &nbsp; View Profile
              </button>

              <a
                href="#"
                style={{
                  display: "block",
                  padding: "10px 16px",
                  textDecoration: "none",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#a754e6";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#333";
                }}
                onClick={handleLogout}
              >
                <AiOutlineLogout /> &nbsp; Logout
              </a>
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Body style={{ padding: "0", background: "transparent" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "80px 30px 30px",
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <img
              src={profileImageSrc}
              alt="Profile"
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid #fff",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                position: "absolute",
                top: "-70px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff",
              }}
            />

            <h3
              style={{
                marginTop: "20px",
                fontWeight: "600",
                fontSize: "1.6rem",
                color: "#333",
              }}
            >
              {profileData?.name || "Name"}
            </h3>
            <p style={{ fontSize: "1rem", color: "#777", marginBottom: "8px" }}>
              {profileData?.email || "Email"}
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "8px",
              }}
            >
              Contact: {profileData?.contactno || "N/A"}
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "8px",
              }}
            >
              Education: {profileData?.education || "N/A"}
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "16px",
                padding: "0 20px",
              }}
            >
              {profileData?.bio || "Short bio about the founder or startup."}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                borderTop: "1px solid #eee",
                paddingTop: "16px",
                marginTop: "18px",
              }}
            >
              <div style={{ flex: 1 }}>
                <strong style={{ color: "#4b4b4b", fontSize: "1.05rem" }}>
                  ₹{profileData?.fundinggoal || "N/A"}
                </strong>
                <div style={{ fontSize: "0.8rem", color: "#999" }}>
                  Funding Goal
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: "#4b4b4b", fontSize: "1.05rem" }}>
                  {profileData?.startupname || "N/A"}
                </strong>
                <div style={{ fontSize: "0.8rem", color: "#999" }}>
                  Startup Name
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button className="btn btn-primary btn-md">Update Profile</button>
              <button
                className="btn btn-outline-secondary btn-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
