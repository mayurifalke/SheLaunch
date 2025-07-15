import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import "./Home.css"; // Custom styles
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Swal from "sweetalert2";


const EntrepreneurLogin = () => {

  // const [signinData, setSigninData] = useState({
  //   email: "",
  //   password: "",
  // });
  // const handleSigninChange = (e) => {
  //   setSigninData({ ...signinData, [e.target.name]: e.target.value });
  // };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const VITE_ENCRYPTION_KEY = "SheLaunch";
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
 try {
      const response = await axios.post("/api/users/login", {
        identifier: email, // sending email as identifier
        password: password,
      });

      console.log("Response", response.data);
      const { message, role, token, user } = response.data;

      localStorage.setItem("token", token);

      const encryptedRole = CryptoJS.AES.encrypt(
        role,
        VITE_ENCRYPTION_KEY
      ).toString();

      let cookieValue = {
        token: token,
        role: encryptedRole,
        mobile: user.contact,
        email: user.email,
        id: user.id,
        name: user.name || "Unknown",
      };

      if ([ "admin","investor", "enterpreneur"].includes(role)) {
        cookieValue.name = user.name;
      } else {
        cookieValue.name = "Unknown";
      }

      Cookies.set("She_Launch", JSON.stringify(cookieValue), { expires: 7 });

      // Navigate based on role
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "investor":
          navigate("/investors");
          break;
        case "entrepreneur":
          navigate("/entrepreneur");
          break;
        default:
          Swal.fire({
            title: "Error",
            text: "Unauthorized role!",
            icon: "error",
            confirmButtonText: "OK",
          });
      }
    } catch (error) {
      console.error("Caught Error:", error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Failed to login. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="auth-background d-flex justify-content-center align-items-center">
      <Card className="auth-card glass-card shadow">
        <h3 className="text-center text-white mb-4">
              Login for Entrepreneur, Investor or Admin
        </h3>

     
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
               value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
               value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="btn-purple w-100">
              Sign In
            </Button>
          </Form>
       
        <div className="text-center mt-3">
         <Link to="/enterpreneurRegister" style={{ textDecoration: "none", color: "white",fontSize:"1.2rem" }}>
              New Entrepreneur ? <span style={{ fontWeight: "bold", color: "#0d6efd" }}>Register Here</span>
           </Link>
        </div>
      </Card>
    </div>
  );
};

export default EntrepreneurLogin;
