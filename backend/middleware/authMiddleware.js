const jwt = require("jsonwebtoken");
const Entrepreneur = require("../models/userModel");
const Investor = require("../models/investorModel");

const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    if (decoded.role === "entrepreneur") {
      user = await Entrepreneur.findById(decoded.id);
    } else if (decoded.role === "investor") {
      user = await Investor.findById(decoded.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = decoded; // Attach user data to request object
    next();

  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = { isUserLoggedIn };
