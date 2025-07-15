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
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
 const { setToggled } = useContext(ToggledContext); // Access setToggled
  const [showDropdown, setShowDropdown] = useState(false);

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

   const navigate = useNavigate(); 
  const handleLogout = () => {
   Cookies.remove("She_Launch"); // Remove the cookie
   navigate('/');
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
    </>
  );
};
