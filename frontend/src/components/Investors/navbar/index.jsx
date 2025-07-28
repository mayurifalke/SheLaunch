import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MenuOutlined, PersonOutlined, ArrowDropDown } from '@mui/icons-material';
import { ColorModeContext } from "../../../theme";
import { FaEye } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { ToggledContext } from "../../../layouts/InvestorLayout"; // Import your context
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";

export const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
 const { setToggled } = useContext(ToggledContext); // Access setToggled
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();
  const [acceptedConnections, setAcceptedConnections] = useState([]);

  // Close dropdown when clicking outside
  // Close dropdown when clicking outside
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

  const handleLogout = () => {
    Cookies.remove("She_Launch");
    navigate("/");
  };

  const fetchConnections = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/investors/get-connections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allConnections = response.data.connections || [];
      setAcceptedConnections(allConnections.filter(c => c.status === "Accepted"));
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // Fetch profile data when modal is opened
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (showModal && token) {
      axios
        .get("/api/investors/investor-profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfileData(response.data.investor);
        })
        .catch((error) => {
          console.error("Failed to load profile:", error);
        });
    }
  }, [showModal]);

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
          // zIndex: 1000,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            sx={{ display: `${isMdDevices ? "flex" : "none"}`, color: "#a754e6" }}
             onClick={() => setToggled(true)} // Updated here to open sidebar
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
                transition: "all 0.3s ease-in-out",
                minWidth: "160px",
                zIndex: 999,
              }}
            >
              <a
              onClick={() => setShowModal(true)}
                // href="#"
                style={{
                  display: "block",
                  padding: "10px 16px",
                  textDecoration: "none",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
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
                <FaEye />  &nbsp;  View Profile
              </a>

              <a
                href="#"
                style={{
                  display: "block",
                  padding: "10px 16px",
                  textDecoration: "none",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
          e.target.style.background = "#a754e6";
          e.target.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#333";
        }}

                onClick={handleLogout} // Call handleLogout on click
              >
                <AiOutlineLogout />  &nbsp;  Logout
              </a>


              {/* <button
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  background: "#a754e6",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#944ed0")}
                onMouseLeave={(e) => (e.target.style.background = "#a754e6")}
              >
                Logout
              </button> */}
            </Box>
          )}
        </Box>
      </Box>

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
            <h5
              style={{
                marginTop: "20px",
                fontWeight: "600",
                fontSize: "1rem",
                color: "#333",
              }}
            >
              Connections: {acceptedConnections.length || "0"}
            </h5>
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
                  ₹{profileData?.maxInvestment || "N/A"}
                </strong>
                <div style={{ fontSize: "0.8rem", color: "#999" }}>
                  Max Investment
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: "#4b4b4b", fontSize: "1.05rem" }}>
                  {profileData?.categories || "N/A"}
                </strong>
                <div style={{ fontSize: "0.8rem", color: "#999" }}>
                  Category
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
              <Link
                to="/entrepreneur/update-profile"
                className="btn btn-primary btn-md"
                onClick={() => setShowModal(false)}
              >
                Update Profile
              </Link>
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
