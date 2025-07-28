const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investor");
const { isUserLoggedIn } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/authenticateRole");
const upload = require("../middleware/uploadMiddleware");
const checkInvestorApproval = require("../middleware/checkInvestorApproval");

router.post(
  "/register-investor",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "aadharPan", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  investorController.RegisterInvestor
);

// Browse all entrepreneurs
router.get(
  "/browse-pitches",
  isUserLoggedIn,
  
  investorController.getAllEntrepreneurPitches
);

// Save entrepreneur to investor's saved list array
router.post(
  "/save-entrepreneur",
  isUserLoggedIn,
  checkInvestorApproval,
  authorizeRole("investor"),
  investorController.saveEntrepreneur
);

// Mark interest in an entrepreneur
router.post(
  "/mark-interested",
  isUserLoggedIn,
  checkInvestorApproval,
  authorizeRole("investor"),
  investorController.markInterestedEntrepreneur
);

// Get all saved entrepreneurs for the investor
router.get(
  "/get-saved-entrepreneurs",
  isUserLoggedIn,
  investorController.getSavedEntrepreneurs
);

//to delete the enterprenuer from savedEntrepreneurs array
router.delete(
  "/remove-saved-entrepreneur/:entrepreneurId",
  isUserLoggedIn,
  checkInvestorApproval,
  authorizeRole("investor"),
  investorController.removeSavedEntrepreneur
);

// ✅ Route to get Investor Profile
router.get(
  "/investor-profile",
  isUserLoggedIn,
  investorController.getInvestorProfile
);

// ✅ Route to get all investors
router.get("/all-investors", investorController.getAllInvestors);

router.post(
  "/make-connection",
  isUserLoggedIn,
  checkInvestorApproval,
  authorizeRole("investor"),
  investorController.sendConnectionRequest
);

router.get(
  "/get-connections", 
  isUserLoggedIn,
  authorizeRole("investor"),
  investorController.getInvestorConnections
);


router.put(
  "/update-connection-status",
  isUserLoggedIn,
  checkInvestorApproval,
  authorizeRole("investor"),
  investorController.updateConnectionStatus
);

module.exports = router;
