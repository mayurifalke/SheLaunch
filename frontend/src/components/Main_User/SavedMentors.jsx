import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { IoIosBusiness } from "react-icons/io";

const SavedMentors = () => {
  const [mentors, setMentors] = useState([]);

  // Dummy data for now
  useEffect(() => {
    const dummyMentors = [
      {
        id: 1,
        name: "Meena Joshi",
        company: "EcoMentors Pvt. Ltd.",
        location: "Nashik, Maharashtra",
        category: "Business Strategy",
        bio: "Expert in rural women entrepreneurship with 10+ years of mentoring experience.",
        contactno: "9933226789",
        linkedinurl: "https://linkedin.com/in/meenajoshi",
        website: "https://ecomentors.com",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        id: 2,
        name: "Laxman Patil",
        company: "Startup Guide",
        location: "Pune, Maharashtra",
        category: "Finance & Funding",
        bio: "Financial advisor helping startups achieve funding goals and manage investments.",
        contactno: "9823456789",
        linkedinurl: "https://linkedin.com/in/laxmanpatil",
        website: "https://startupguide.com",
        image: "https://randomuser.me/api/portraits/men/46.jpg"
      },
    ];
    setMentors(dummyMentors);
  }, []);

  return (
    <div className='m-4'>
      <h2 className="mb-4">Saved Mentors</h2>
      <div className="row">
        {mentors.map((mentor) => (
          <div className="col-md-6 mb-4" key={mentor.id}>
            <div className="card h-100 shadow mentor-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="rounded-circle mentor-avatar me-3"
                    width="70"
                    height="70"
                  />
                  <div>
                    <h5 className="card-title fw-bold mb-0">{mentor.name}</h5>
                    <span className="badge bg-secondary mt-2">{mentor.category}</span>
                  </div>
                </div>
                <hr />
                <h6 className="card-subtitle mb-4 mt-2 text-muted">
                  <IoIosBusiness /> {mentor.company} | <FaLocationDot /> {mentor.location}
                </h6>
                <p className="card-text mb-3">
                  <strong>Contact:</strong> {mentor.contactno}
                </p>
                <p className="card-text mb-3">
                  <strong>Website:</strong>{" "}
                  <a href={mentor.website} target="_blank" rel="noreferrer"   style={{ color: "black", textDecoration: "none" }}>
                    {mentor.website}
                  </a>  
                </p>
                <p className="card-text mb-3">
                  <strong>LinkedIn:</strong>{" "}
                  <a href={mentor.linkedinurl} target="_blank" rel="noreferrer"   style={{ color: "black", textDecoration: "none" }}>
                    View Profile
                  </a>
                </p>
                <p className="card-text">{mentor.bio.slice(0, 100)}...</p>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button className="btn btn-primary btn-sm px-3">
                    Chat
                  </button>
                  <button className="btn btn-success btn-sm px-3">
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inline CSS for mentor avatar and card */}
      <style jsx="true">{`
        .mentor-avatar {
          object-fit: cover;
          border: 2px solid #ddd;
        }
        .mentor-card:hover {
          transform: translateY(-3px);
          transition: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default SavedMentors;
