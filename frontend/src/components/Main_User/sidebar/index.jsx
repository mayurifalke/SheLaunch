/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Tooltip, tooltipClasses, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { MenuOutlined, DashboardOutlined } from '@mui/icons-material';
import { FaBusinessTime } from "react-icons/fa6";
import { MdOutlineBusiness } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { ToggledContext } from "../../../layouts/EnterpreneurLayout";
import { Link } from "react-router-dom";

export const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    ) : content;
  };

  return (
    <Sidebar
      backgroundColor="#000" // black background
      rootStyles={{ border: 0, height: "100%" }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
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
                  color={colors.greenAccent[500]}
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
    path="/enterpreneur"
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
              fontSize:"1rem",
              ":hover": {
                color: "#a754e6",
                
              },
            },
          }}
        >
          <Item
            title="Profile"
            path="/entrepreneur/profile"
            icon={<MdOutlineBusiness />}
            collapsed={collapsed}
          />
          {/* <Item
            title="Startup Status"
            path="/enterpreneur/startupstatus"
            icon={<FaBusinessTime />}
            collapsed={collapsed}
          />   */}
          <Item
            title="Saved Investors"
            path="/entrepreneur/savedinvestors"
            icon={<AiFillEdit />}
            collapsed={collapsed}
          />
            <Item
            title="Saved Mentors"
            path="/entrepreneur/savedmentors"
            icon={<AiFillEdit />}
            collapsed={collapsed}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};
