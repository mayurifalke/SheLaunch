import React from "react";
import "./Home.css"; // Optional, for animation or minor tweaks
// import heroImg from '/public/assets/img/hero-img.png'; // adjust path if needed
// import './StatsCards.css';
// import icon from '../assets/leaf-icon.png';
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
// import cloudBg from "./cloud-bg.png"; // Your purple cloud image
import womanImg from "/images/womenbg.png"; // The uploaded illustration

function FlippableCard({ item }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
      <div style={{ perspective: "1000px", width: "100%" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.6s ease-in-out",
            transformStyle: "preserve-3d",
            borderRadius: "1rem",
          }}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          {/* Front */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              backgroundColor: "#fdebed",
              padding: "1.5rem",
              textAlign: "center",
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid white",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                marginBottom: "1rem",
              }}
            />
            <h5 className="fw-semibold mb-1">{item.name}</h5>
            <p className="text-primary mb-0">{item.company}</p>
          </div>

          {/* Back */}
     {/* Back */}
<div
  style={{
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    backgroundColor: "#fdebed",
    transform: "rotateY(180deg)",
    borderRadius: "1rem",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }}
>
  <img
    src={item.image}
    alt={item.name}
    onError={(e) => (e.target.src = "https://via.placeholder.com/120")}
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid white",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      marginBottom: "1rem",
    }}
  />
  <p className="text-muted small mb-0">{item.feedback}</p>
</div>

        </div>
      </div>
    </div>
  );
}

const Home = () => {
  const stats = [
  { count: '632+', label: 'Mentors' },
  { count: '835+', label: 'Government Initiatives' },
  { count: '576+', label: 'Incubators & Accelerators' },
  { isCTA: true }, // This one will be replaced with a call to action
  { count: '44+', label: 'Partners' },
];

const flipStats = [
  {
    isFlippable: true,
    count: '632+',
    label: 'Mentors',
    backText:
      'Build your network by connecting with industry experts, peers',
  },
  {
    isFlippable: true,
    count: '835+',
    label: 'Government Initiatives',
    backText:
      'Build your network by connecting with industry experts, peers',
  },
  {
    isFlippable: true,
    count: '576+',
    label: 'Incubators & Accelerators',
    backText:
      'Build your network by connecting with industry experts, peers',
  },
  {
    isFlippable: true, // special card to flip on hover
    label: 'WEP Family',
    count: '65736+',
    backText:
      'Build your network by connecting with industry experts, peers',
  },
  {
    count: '44+',
    label: 'Partners',
  },
];
const statCards = [
  { count: "632+", label: "Mentors" },
  { count: "835+", label: "Government Initiatives" },
  { count: "576+", label: "Incubators & Accelerators" },
  { count: "65736+", label: "WEP Family" },
  { count: "44+", label: "Partners" },
];

const testimonialData = [
  {
    name: "Harshika Sharma",
    company: "Umla Technologies Pvt Ltd",
    image: "/images/person1.png",
    feedback:
      "Each and every session, whether on Finance, Market Strategy, or Legal Compliance Services, was very insightful and helpful.",
  },
  {
    name: "Ms. Sayanika Deka",
    company: "Svastha Samriddhi Private Limited",
    image: "/images/person1.png",
    feedback:
      "WEP and AIC-GIM helped us refine our pitch deck and connect with valuable investors.",
  },
  {
    name: "Swati Maini",
    company: "Maini Renewables Pvt Ltd",
    image: "/images/person1.png",
    feedback:
      "Amazing support for market research and business strategy discussions.",
  },
  {
    name: "Extra Person 1",
    company: "Company Name",
    image: "/images/person1.png",
    feedback: "The sessions were engaging and beneficial for early-stage startups.",
  },
  {
    name: "Extra Person 2",
    company: "Company Name",
    image: "/images/person1.png",
    feedback: "Great networking and mentorship opportunities!",
  },
  // ...repeat for others
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
};

  return (
    <>
    <div>
      <section id="hero" className="py-4 hero-section">
        <div className="container">
          <div className="row align-items-center gy-4">
            {/* Text Content */}
            <div className="col-lg-6 order-2 order-lg-1 text-center text-lg-start">
              <h1 className="fw-bold display-5 mb-3">
                Build Your Dream. Empower the Future
              </h1>
              <p className="lead text-secondary mb-4">
                Your journey starts here — where guidance meets opportunity.{" "}
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start align-items-center">
                <a
                  href="#about"
                  className="btn entrepreneur-btn rounded-pill px-4 py-2"
                >
                  For Entrepreneurs
                </a>
                <Link
                  to="investorauth"
                  className="btn investor-btn rounded-pill px-4 py-2 ms-4"
                >
                  For Investors
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="col-lg-6 order-1 order-lg-2 text-center">
              <img
                src="./public/images/gif1.gif"
                alt="Hero"
                className="img-fluid animated"
                style={{ maxHeight: "400px" }}
              />
            </div>
          </div>
        </div>
      </section>


 

{/* information */}
<center>
 <div className="container women-section position-relative">
      <div className="container py-2">
       <div className="row align-items-center no-gutters">

          {/* Left Content */}
          <div className="col-md-7">
            <h2 className="section-title">Women Entrepreneurship in India</h2>
            <p className="section-text">
              The increasing presence of women as entrepreneurs has led to significant business and economic growth in the country. Women-owned business enterprises are playing a prominent role in society by generating employment opportunities in the country, bringing in demographic shifts and inspiring the next generation of women founders.
            </p>
            {/* <p className="section-text">
              With a vision to promote the sustainable development of women entrepreneurs for balanced growth in the country, Startup India is committed towards strengthening women entrepreneurship in India through initiatives, schemes, creation of enabling networks and communities and activating partnerships among diverse stakeholders in the startup ecosystem.
            </p> */}
          </div>

          {/* Right Image */}
          <div className="col-md-5 text-center ps-0">
            <img src={womanImg} alt="Woman Entrepreneur" className="img-fluid woman-img" />
          </div>
        </div>
      </div>

      {/* Background cloud image at bottom */}
      {/* <img src={cloudBg} alt="cloud" className="cloud-bg" /> */}
    </div>
</center>

 <motion.div
  className="container py-4"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <div className="row g-4 justify-content-center">
    {statCards.map((item, index) => (
      <motion.div
        className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex"
        key={index}
        variants={cardVariants}
        whileHover={{ scale: 1.05 }}
      >
        <div className="stat-card w-100 text-center p-4 rounded-4 shadow-sm">
          <h5 className="fw-bold mb-2 ">{item.count}</h5>
          <p className="mb-0  small text-uppercase">{item.label}</p>
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>

{/* cards of Enterprenurs */}
<div style={{ margin: "2rem" }}>
      <section className="py-5">
        <div className="container text-center mb-4">
          <h3 className="fw-bold">Leading Ladies: Stories of Women Entrepreneurs</h3>
          <p className="text-muted">
            Hear from inspiring women entrepreneurs who are shaping the future.
          </p>
        </div>

        <div className="container testimonial-scroll-container">
          <div className="row gy-4">
           {testimonialData?.map((item, index) => (
  <FlippableCard item={item} key={index} />
))}

          </div>
        </div>
      </section>
    </div>
  </div>

 
    </>
    
  );

 
};

export default Home;
