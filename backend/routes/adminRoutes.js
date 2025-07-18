const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const usersController = require("../controllers/users");
const {isAdminLoggedIn} =  require("../middleware/adminAuthMiddleware");
const {authorizeRole} = require("../middleware/authenticateRole");
// api to register the user
router.post("/register-admin",adminController.RegisterUser);

// api to login the user
// router.post("/login", usersController.login);

// api to get all pending entrepreneurs
router.get("/pending-entrepreneurs", isAdminLoggedIn, adminController.getPendingEntrepreneurs);

// api to get all pending investors
router.get("/pending-investors", isAdminLoggedIn, adminController.getPendingInvestors);

// api to get investor by id
router.get("/investor/:id", isAdminLoggedIn, adminController.getInvestorById);

// api to get entrepreneur by id
router.get("/entrepreneur/:id", isAdminLoggedIn, adminController.getEntrepreneurById);

// api to approve entrepreneur  
router.put("/verify-entrepreneur/:id", isAdminLoggedIn, authorizeRole("admin"), adminController.verifyEntrepreneur);

// api to approve investor
router.put("/verify-investor/:id", isAdminLoggedIn, authorizeRole("admin"), adminController.verifyInvestor);



module.exports = router;