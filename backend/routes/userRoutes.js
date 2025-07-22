const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { isUserLoggedIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { authorizeRole } = require("../middleware/authenticateRole");
const Entrepreneur = require("../models/userModel");
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
  authorizeRole("entrepreneur"),
  usersController.removeSavedInvestor
);

// update profile route
router.put(
  "/update-profile",
  isUserLoggedIn,
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
  authorizeRole("entrepreneur"),
  usersController.chatbotAskQuery
);

module.exports = router;
