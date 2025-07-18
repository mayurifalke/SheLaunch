const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investor");
const { isUserLoggedIn } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/authenticateRole");

// Register a new investor
router.post("/register-investor", investorController.RegisterInvestor);

// Browse all entrepreneurs
router.get("/browse-pitches",isUserLoggedIn, investorController.getAllEntrepreneurPitches);

// Save entrepreneur to investor's saved list array
router.post("/save-entrepreneur", isUserLoggedIn, authorizeRole("investor"), investorController.saveEntrepreneur);

// Mark interest in an entrepreneur
router.post("/mark-interested", isUserLoggedIn, authorizeRole("investor"), investorController.markInterestedEntrepreneur);

// Get all saved entrepreneurs for the investor
router.get("/get-saved-entrepreneurs", isUserLoggedIn, investorController.getSavedEntrepreneurs);

//to delete the enterprenuer from savedEntrepreneurs array
router.delete(
  "/remove-saved-entrepreneur/:entrepreneurId",
  isUserLoggedIn,
  authorizeRole("investor"),
  investorController.removeSavedEntrepreneur
);

// ✅ Route to get Investor Profile
router.get("/investor-profile", isUserLoggedIn, investorController.getInvestorProfile);

// ✅ Route to get all investors
router.get("/all-investors", investorController.getAllInvestors);



module.exports = router;