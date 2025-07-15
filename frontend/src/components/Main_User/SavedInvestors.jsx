import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { IoIosBusiness } from "react-icons/io";

const SavedInvestors = () => {
  const [investors, setInvestors] = useState([]);

   // Dummy data for now
    useEffect(() => {
      const dummyInvestors = [
        {
          id: 1,
          name: "EcoCrafts by Meena",
          comapny: "xyz pvt. ltd.",
          location: "Nashik, Maharashtra",
          category: "Handicrafts",
          investmentrange: 50000,
          bio: "Handmade eco-friendly home décor items crafted by rural artisans.",
          linkdenurl:"sakdsdks",
          website:"xyz.com",
          contactno:"9933226789"
        },
        {
          id: 2,
          name: "EcoCrafts by Laxman",
          comapny: "xyz pvt. ltd.",
          location: "Pune, Maharashtra",
          category: "Handicrafts",
          investmentrange: 50000,
          bio: "Handmade eco-friendly home décor items crafted by rural artisans.",
          linkdenurl:"sakdsdks",
          website:"xyz.com",
          contactno:"9933226789"
        },
        // Add more dummy pitches as needed
      ];
      setInvestors(dummyInvestors);
    }, []);
  return (
    <div className='m-4'>
      <h2 className="mb-4">Saved Investors</h2>
        <div className="row">
        {investors.map((data) => (
          <div className="col-md-6 mb-4" key={data.id}>
            <div className="card pitch-card h-100">
              <div className="card-body">
                <div className="d-flex card-head justify-content-between align-items-center mb-2">
                  <h5 className="card-title fw-bold">{data.name}</h5>
                  <span className="badge pitch-category p-2">{data.category}</span>
                </div>
                <hr />
                <h6 className="card-subtitle mb-4 text-muted mt-4 card-text">
                  <IoIosBusiness />  {data.comapny} | <FaLocationDot /> {data.location}
                </h6>
                <p className="card-text">
                  {/* <FaMoneyBillWave />  */}  <strong>Investment Range :  </strong> ₹{data.investmentrange}
                </p>
                   <p className="card-text">
                 <strong>Contact No. :  </strong> ₹{data.contactno}
                </p>
        
               <p className="card-text">
  <strong>Website:</strong>{" "}
  <a
    href={data.website}
    target="_blank"
    rel="noreferrer"
    style={{ color: "black", textDecoration: "none" }}
  >
    {data.website}
  </a>
</p>
<p className="card-text">
  <strong>LinkedIn:</strong>{" "}
  <a
    href={data.linkdenurl}
    target="_blank"
    rel="noreferrer"
    style={{ color: "black", textDecoration: "none" }}
  >
    View Profile
  </a>
</p>

                <p className="card-text">{data.bio.slice(0, 80)}...</p>
      
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button
                    className="btn btn-secondary btn-sm px-3"
                    // onClick={() => handleViewDetails(pitch)}
                  >
                    Chat
                  </button>
                  {/* <button className="btn save-btn  btn-sm px-3">⭐ Save</button>
                  <button onClick={() => setShowInvestModal (true)} className="btn invest-btn btn-sm px-3">Invest Now</button>
                  <button className="btn deck-btn btn-sm px-3">📎 Deck</button> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SavedInvestors
