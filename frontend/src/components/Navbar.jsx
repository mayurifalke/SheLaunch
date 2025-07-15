import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "./Navbar.css";
import InvestorAuthModal from "./Investors/InvestorAuth";
import InvestorAuth from "./Investors/InvestorAuth";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deepDropdownOpen, setDeepDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

 

  return (
    <header className="sticky-top">
      <Navbar expand="lg" className="bg-white shadow-sm py-3">
        <Container fluid="xl">
          <img src="/logo2.jpg" alt="Site Logo" className="logo-img me-1" />

          <Navbar.Brand
            href="index.html"
            className="d-flex align-items-center me-auto"
          >
            {/* <img src="assets/img/logo.png" alt="Logo" height="36" className="me-2" /> */}
            <h2 className="fs-3 m-0 fw-bold ">SheLaunch</h2>
          </Navbar.Brand>

          {/* Toggle for mobile */}
          <Navbar.Toggle aria-controls="main-navbar" />

          {/* Nav Links */}
          <Navbar.Collapse id="main-navbar" className="justify-content-end">
            <Nav className="align-items-center">
              <Nav.Link href="/homepage" className="nav-item-link">
                Home
              </Nav.Link>
              <Nav.Link href="/fundings" className="nav-item-link">
                Funding
              </Nav.Link>
              <Nav.Link
                href="#"
               
                 onClick={(e) => {
          e.preventDefault(); // prevent link default behavior
          setShowModal(true);
        }}
                className="nav-item-link"
              >
                Investors
              </Nav.Link>
               {/* Show the modal conditionally */}
      <InvestorAuth show={showModal} handleClose={() => setShowModal(false)} />
              {/* <InvestorAuthModal
                show={showModal}
                handleClose={() => setShowModal(false)}
              /> */}
             
              <Nav.Link href="#portfolio" className="nav-item-link">
                Idea Generator
              </Nav.Link>
              <Nav.Link href="#team" className="nav-item-link">
                Mentors
              </Nav.Link>

              {/* Dropdown */}
              {/* <NavDropdown
                title="Dropdown"
                id="main-nav-dropdown"
                className="hover-dropdown"
                show={dropdownOpen}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <NavDropdown.Item href="#">Dropdown 1</NavDropdown.Item>

                <NavDropdown
                  title="Deep Dropdown"
                  id="nested-dropdown"
                  drop="end"
                  show={deepDropdownOpen}
                  onMouseEnter={() => setDeepDropdownOpen(true)}
                  onMouseLeave={() => setDeepDropdownOpen(false)}
                  className="hover-dropdown"
                >
                  <NavDropdown.Item href="#">Deep Dropdown 1</NavDropdown.Item>
                  <NavDropdown.Item href="#">Deep Dropdown 2</NavDropdown.Item>
                  <NavDropdown.Item href="#">Deep Dropdown 3</NavDropdown.Item>
                  <NavDropdown.Item href="#">Deep Dropdown 4</NavDropdown.Item>
                  <NavDropdown.Item href="#">Deep Dropdown 5</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown.Item href="#">Dropdown 2</NavDropdown.Item>
                <NavDropdown.Item href="#">Dropdown 3</NavDropdown.Item>
                <NavDropdown.Item href="#">Dropdown 4</NavDropdown.Item>
              </NavDropdown> */}

              <Nav.Link href="#contact" className="nav-item-link">
                Leaning Hub
              </Nav.Link>
              <Nav.Link href="#contact" className="nav-item-link">
                Schems
              </Nav.Link>

              <Nav.Link href="/login" className="navbtn ms-3 px-4 py-2 rounded-pill">
                  Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
