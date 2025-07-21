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
  authorizeRole("user"),
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
    { name: "aadhaarPan", maxCount: 1 },
    { name: "startupCertificate", maxCount: 1 },
    { name: "otherDocs" },
  ]),
  async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).json({ message: "User ID missing" });
      }

      // get fields from req.body
      const updatedData = { ...req.body };
      if (updatedData.investmentTypes) {
        updatedData.investmentTypes = JSON.parse(updatedData.investmentTypes);
      }
      if (updatedData.otherDocs) {
        updatedData.otherDocs = JSON.parse(updatedData.otherDocs);
      }

      // Validate required fields only
      const requiredFields = [
        "name",
        "email",
        "contactno",
        "education",
        "bio",
        "startupname",
        "fundinggoal",
      ];

      for (const field of requiredFields) {
        if (!updatedData[field]) {
          return res
            .status(400)
            .json({ message: `Field '${field}' is required` });
        }
      }

      // handle optional uploaded files
      if (req.files.businessLicense?.[0]) {
        updatedData.businessLicense = {
          data: req.files.businessLicense[0].buffer,
          contentType: req.files.businessLicense[0].mimetype,
        };
      }
      if (req.files.aadharPan?.[0]) {
        updatedData.aadhaarPan = {
          data: req.files.aadharPan[0].buffer,
          contentType: req.files.aadharPan[0].mimetype,
        };
      }
      if (req.files.startupCertificate?.[0]) {
        updatedData.startupCertificate = {
          data: req.files.startupCertificate[0].buffer,
          contentType: req.files.startupCertificate[0].mimetype,
        };
      }
      if (req.files.otherDocs?.length) {
        updatedData.otherDocs = req.files.otherDocs.map((file) => ({
          data: file.buffer,
          contentType: file.mimetype,
        }));
      }

      const updated = await Entrepreneur.findByIdAndUpdate(
        userId,
        updatedData,
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        entrepreneur: updated,
      });
    } catch (err) {
      console.error("Update error:", err);
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res
          .status(400)
          .json({ message: "Validation error", errors: messages });
      }
      res.status(500).json({ message: "Server error while updating profile" });
    }
  }
);
module.exports = router;
