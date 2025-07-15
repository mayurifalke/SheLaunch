const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { isUserLoggedIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// api to register the user
router.post(
  "/register-user",
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "aadhaarPan", maxCount: 1 },
    { name: "startupCertificate", maxCount: 1 },
    { name: "otherDocs" }, // multiple allowed
  ]),
  usersController.RegisterUser
);

// api to login the user
router.post("/login", usersController.login);

//api to get interested investors
router.get("/interested-investors", isUserLoggedIn, usersController.getInterestedInvestors);

// Route to get Entrepreneur Profile
router.get("/entrepreneur-profile", isUserLoggedIn, usersController.getEntrepreneurProfile);

// api to get all Approved investors
router.get("/all-investors", usersController.getAllInvestors);

// api to save Investor in enterprenur's savedInvestors array on save button
router.post("/save-investor", isUserLoggedIn, usersController.saveInvestor);

//to get saved Investors 
router.get("/get-saved-investors", isUserLoggedIn, usersController.getSavedInvestors);

//to delete the investor from savedInvestors array
router.post("/remove-saved-investor", isUserLoggedIn, usersController.removeSavedInvestor);
module.exports = router;