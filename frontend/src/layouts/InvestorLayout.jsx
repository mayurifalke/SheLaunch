import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme"; // adjust path if needed
import { SideBar } from "../components/Investors/sidebar"; // adjust path if needed
import { Navbar } from "../components/Investors/navbar";
import { Outlet } from "react-router-dom";

export const ToggledContext = createContext(null);

const InvestorLayout = () => {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };
   const [collapsed, setCollapsed] = useState(false); // ✅ ADD THIS

  return (
    <ColorModeContext.Provider value={colorMode} position="relative">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
           <SideBar
  backgroundColor="#000"
  rootStyles={{ border: 0, height: "100%", zIndex: 1200 }}
  collapsed={collapsed}
  onBackdropClick={() => setToggled(false)}
  toggled={toggled}
  breakPoint="md"
/>

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default InvestorLayout;
