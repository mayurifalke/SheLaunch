/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  tooltipClasses,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { MenuOutlined, DashboardOutlined } from "@mui/icons-material";
import { FaBusinessTime } from "react-icons/fa6";
import { MdOutlineBusiness } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { ToggledContext } from "../../../layouts/InvestorLayout";
import { Link } from "react-router-dom";
import axios from "axios";

export const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const [pendingRequests, setPendingRequests] = useState([]);
  
    const fetchConnections = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/investors/get-connections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allConnections = response.data.connections || [];
        setPendingRequests(allConnections.filter((c) => c.status === "Pending"));
        // console.log("Pending Requests:", pendingRequests.length);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
  
    useEffect(() => {
      fetchConnections();
    }, []);

  const Item = ({ title, path, icon, collapsed }) => {
    const content = (
      <MenuItem
        component={<Link to={path} />}
        icon={icon}
        style={{ color: "#fff", fontWeight: 500 }}
      >
        {!collapsed && title}
      </MenuItem>
    );

    return collapsed ? (
      <Tooltip
        title={title}
        placement="right"
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: "#a754e6", // green accent
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              [`& .${tooltipClasses.arrow}`]: {
                color: "#a754e6",
              },
            },
          },
        }}
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  return (
    <Sidebar
      backgroundColor="rgba(18, 18, 18, 0.8)" // black background
      rootStyles={{ border: 0, height: "100%" }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      {/* <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              color: "#a754e6", // green accent on hover
              background: "transparent",
              transition: ".4s ease",
            },
          },
          icon: {
            color: "#fff",
            ":hover": {
              color: "#a754e6",
            },
          },
          label: {
            color: "#fff",
            ":hover": {
              color: "#a754e6",
            },
          },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "40px 0 20px 0",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src="/logo2.jpg"
                  alt="She Launch"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color="#a754e6" // green accent brand color
                >
                  She Launch
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#fff" }}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu> */}
      <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              color: "#a754e6", // green accent on hover
              background: "transparent",
              transition: ".4s ease",
            },
          },
          icon: {
            color: "#fff",
            ":hover": {
              color: "#a754e6",
            },
          },
          label: {
            color: "#fff",
            ":hover": {
              color: "#a754e6",
            },
          },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src="/logo2.jpg"
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color="#a754e6"
                >
                  She Launch
                </Typography>
              </Box>
            )}
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{ color: "#fff" }}
            >
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      <Box mb={6} mt={4} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#a754e6",
                background: "transparent",
                transition: ".4s ease",
              },
              marginBottom: "0.5rem", // spacing here
            },
            icon: {
              color: "#fff",
              ":hover": {
                color: "#a754e6",
              },
            },
            label: {
              color: "#fff",
              fontSize: "1rem",
              ":hover": {
                color: "#a754e6",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/investors"
            icon={<DashboardOutlined />}
            collapsed={collapsed}
          />
        </Menu>

        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#a754e6",
                background: "transparent",
                transition: ".4s ease",
              },
              marginBottom: "0.5rem", // spacing here
            },
            icon: {
              color: "#fff",
              ":hover": {
                color: "#a754e60",
              },
            },
            label: {
              color: "#fff",
              fontSize: "1rem",
              ":hover": {
                color: "#a754e6",
              },
            },
          }}
        >
          <Item
            title="Update Profile"
            path="/investors/updateprofile"
            icon={<MdOutlineBusiness />}
            collapsed={collapsed}
          />
          <Item
            title="Browse Pitches"
            path="/investors/browsepitches"
            icon={<MdOutlineBusiness />}
            collapsed={collapsed}
          />
                <Item
                      title="My Connections"
                      path="/investors/myconnections"
                      icon={
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <FaBusinessTime />
                          {pendingRequests.length > 0 && (
                            <span
                              style={{
                                position: "absolute",
                                top: "2px",
                                right: "-3px",
                                background: "red",
                                color: "white",
                                fontSize: "10px",
                                borderRadius: "50%",
                                padding: "2px 4px",
                                lineHeight: "1",
                              }}
                            >
                              {pendingRequests.length}
                            </span>
                          )}
                        </div>
                      }
                      collapsed={collapsed}
                    />
                    <Item
            title="Messages"
            path="/investors/messages"
            icon={<MdOutlineBusiness />}
            collapsed={collapsed}
          />
          <Item
            title="Saved Ideas"
            path="/investors/savedideas"
            icon={<FaBusinessTime />}
            collapsed={collapsed}
          />
          <Item
            title="My Investments"
            path="/investors/myinvestments"
            icon={<AiFillEdit />}
            collapsed={collapsed}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};
