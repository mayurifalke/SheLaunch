import React from "react";
import Navbar from "../components/Navbar"; // Adjust the path as per your project
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
