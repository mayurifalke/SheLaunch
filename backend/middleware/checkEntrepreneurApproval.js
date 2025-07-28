const Entrepreneur = require("../models/userModel");

const checkEntrepreneurApproval = async (req, res, next) => {
  try {
    const entrepreneurId = req.user.id; // from isUserLoggedIn middleware
    const entrepreneur = await Entrepreneur.findById(entrepreneurId);

    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    if (entrepreneur.status !== "Approved") {
      return res.status(403).json({ message: "Access denied. Entrepreneur not approved yet.Complete Your Profile" });
    }

    next(); // ✅ Proceed to controller
  } catch (err) {
    console.error("Error checking entrepreneur status:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = checkEntrepreneurApproval;
