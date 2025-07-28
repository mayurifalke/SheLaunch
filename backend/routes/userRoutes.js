const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { isUserLoggedIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { authorizeRole } = require("../middleware/authenticateRole");
const Entrepreneur = require("../models/userModel");
const checkEntrepreneurApproval = require("../middleware/checkEntrepreneurApproval");
console.log("✅ userRoutes.js loaded");

router.get("/test", (req, res) => res.send("Test route works!"));

// api to register the user
router.post(
  "/register-user",
  upload.single("profileImage"), // field name must match frontend FormData key
  usersController.RegisterUser
);

// api to login the user
router.post("/login", usersController.login);

//api to get interested investors
router.get(
  "/interested-investors",
  isUserLoggedIn,
  usersController.getInterestedInvestors
);

// Route to get Entrepreneur Profile
router.get(
  "/entrepreneur-profile",
  isUserLoggedIn,
  usersController.getEntrepreneurProfile
);

// api to get all Approved investors
router.get("/all-investors", usersController.getAllInvestors);

// api to save Investor in enterprenur's savedInvestors array on save button
router.post(
  "/save-investor",
  isUserLoggedIn,
  checkEntrepreneurApproval,
  authorizeRole("entrepreneur"),
  usersController.saveInvestor
);

//to get saved Investors
router.get(
  "/get-saved-investors",
  isUserLoggedIn,
  usersController.getSavedInvestors
);

//to delete the investor from savedInvestors array
router.post(
  "/remove-saved-investor",
  isUserLoggedIn,
  checkEntrepreneurApproval,
  authorizeRole("entrepreneur"),
  usersController.removeSavedInvestor
);

// update profile route
router.put(
  "/update-profile",
  isUserLoggedIn,
  checkEntrepreneurApproval,
  authorizeRole("entrepreneur"),
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "aadharPan", maxCount: 1 },
    { name: "startupCertificate", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "otherDocs" },
  ]),
  usersController.updateProfile
);

router.post(
  "/chatbot",
  isUserLoggedIn,
  checkEntrepreneurApproval,
  authorizeRole("entrepreneur"),
  usersController.chatbotAskQuery
);

router.post(
  "/make-connection",
  isUserLoggedIn,
  checkEntrepreneurApproval,
  authorizeRole("entrepreneur"),
  usersController.sendConnectionRequest
);

router.get(
  "/get-connections",
  isUserLoggedIn,
  authorizeRole("entrepreneur"),
  usersController.getEntrepreneurConnections
);

router.put(
  "/update-connection-status",
  isUserLoggedIn,
  checkEntrepreneurApproval,
  authorizeRole("entrepreneur"),
  usersController.updateConnectionStatus
);

router.post("/generate-business-idea", usersController.generateBusinessIdea);
router.post("/ask-followup", usersController.chatbotAskQuery);

module.exports = router;
