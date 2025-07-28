const Investor = require("../models/investorModel");

const checkInvestorApproval = async (req, res, next) => {
  try {
    const investorId = req.user.id; // from isUserLoggedIn
    const investor = await Investor.findById(investorId);

    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    if (investor.status !== "Approved") {
      return res.status(403).json({ message: "Access denied. Investor not approved yet. Complete Your Profile!" });
    }

    next(); // ✅ continue to controller
  } catch (err) {
    console.error("Error checking investor status:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = checkInvestorApproval;
