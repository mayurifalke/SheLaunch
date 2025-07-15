import React from 'react';
import { FaTwitter } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6"; 

const Footer = () => {
  return (
    <div>
       {/* Footer */}
  <footer className="footer text-white shadow-lg" style={{ backgroundColor: "#232947", fontSize: "14px",color:"white" }}>
      {/* Newsletter Section */}
      {/* <div style={{ backgroundColor: "#fceff1", padding: "50px 0" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6">
              <h4 style={{ fontSize: "24px", color: "#000" }}>Join Our Newsletter</h4>
              <p style={{ color: "#333" }}>
                Subscribe to our newsletter and receive the latest news about our products and services!
              </p>
              <form action="forms/newsletter.php" method="post">
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    marginTop: "30px",
                    marginBottom: "15px",
                    padding: "6px 8px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "50px",
                    boxShadow: "0px 2px 25px rgba(0, 0, 0, 0.1)",
                    transition: "0.3s",
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    style={{
                      border: "0",
                      padding: "4px",
                      width: "100%",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#000",
                      borderRadius: "50px",
                    }}
                  />
                  <input
                    type="submit"
                    value="Subscribe"
                    style={{
                      border: "0",
                      fontSize: "16px",
                      padding: "8px 20px",
                      background: "#e84545",
                      color: "#fff",
                      borderRadius: "50px",
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div className="loading">Loading</div>
                <div className="error-message text-danger"></div>
                <div className="sent-message text-success">Your subscription request has been sent. Thank you!</div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      {/* Footer Top Content */}
      <div className="container pt-5 text-white">
        <div className="row gy-4">
          {/* About */}
          <div className="col-lg-4 col-md-6">
            <a href="/" className="d-flex align-items-center text-white text-decoration-none mb-2">
              <span className="fs-4 fw-bold">SheLaunch</span>
            </a>
            <div>
              <p className="mb-1 text-white"> A platform empowering women to launch <br />their dreams.</p>
              {/* <p className="mb-1 text-dark">Shraddh</p>
              <p className="mb-1 text-dark">New York, NY 535022</p>
              <p className="mb-1 text-dark">
                <strong>Phone:</strong> +1 5589 55488 55
              </p> */}
              <p className="text-white">
                <strong>Email:</strong> info@example.com
              </p>
            </div>
          </div>

          {/* Useful Links */}
          <div className="col-lg-2 col-md-3">
            <h4 className="text-white">Useful Links</h4>
            <ul className="list-unstyled">
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Home</a></li>
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">About us</a></li>
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Services</a></li>
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Terms of service</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-3">
            <h4 className="text-white">Our Services</h4>
            <ul className="list-unstyled">
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Web Design</a></li>
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Web Development</a></li>
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Product Management</a></li>
              <li><i className="bi bi-chevron-right"></i> <a href="#" className="text-white text-decoration-none">Marketing</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-lg-4 col-md-12">
            <h4 className="text-white">Follow Us</h4>
            <p className="text-white">
              Cras fermentum odio eu feugiat lide par naso tierra videa magna derita valies
            </p>
          <div className="d-flex">
  {[FaTwitter, FaFacebookSquare, SiInstagram, FaLinkedin].map((Icon, i) => (
    <a
      href="#"
      key={i}
      className="d-flex align-items-center justify-content-center me-2 text-white"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid #999",
        fontSize: "20px",
        // color: "#555",
        transition: "0.3s",
      }}
      // onMouseEnter={(e) => (e.target.style.color = "#e84545")}
      // onMouseLeave={(e) => (e.target.style.color = "#555")}
    >
      <Icon />
    </a>
  ))}
</div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container text-center mt-4 pt-4 border-top">
        <p className="mb-1 text-white">
          © <strong className="px-1">SheLaunch</strong> All Rights Reserved
        </p>
        <div className="credits text-white" style={{ fontSize: "13px" }}>
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a> &nbsp;|&nbsp;
          Distributed by <a href="https://themewagon.com">ThemeWagon</a>
        </div><br />
      </div>
    </footer>
    </div>
  )
}

export default Footer
