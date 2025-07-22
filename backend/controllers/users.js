const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Entrepreneur = require("../models/userModel");
const Investor = require("../models/investorModel");
const Admin = require("../models/adminModel");
const JWT_SECRET = process.env.JWT_SECRET;

exports.RegisterUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactno,
      education,
      bio,
      startupname,
      fundinggoal,
    } = req.body;

    // check required fields
    if (
      !name ||
      !email ||
      !password ||
      !contactno ||
      !education ||
      !bio ||
      !startupname ||
      !fundinggoal
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // // check existing user by email
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ message: "User already exists with this email" });
    // }

    // // check existing user by contact number
    // const existingUserByContact = await User.findOne({ contactno });
    // if (existingUserByContact) {
    //   return res
    //     .status(400)
    //     .json({ message: "User already exists with this contact number" });
    // }

    const [adminEmail, userEmail, investorEmail] = await Promise.all([
      Admin.findOne({ email }),
      User.findOne({ email }),
      Investor.findOne({ email }),
    ]);

    if (adminEmail || userEmail || investorEmail) {
      return res
        .status(400)
        .json({ message: "Email already in use by another account." });
    }

    const [adminContact, userContact, investorContact] = await Promise.all([
      Admin.findOne({ contactno }),
      User.findOne({ contactno }),
      Investor.findOne({ contactno }),
    ]);

    if (adminContact || userContact || investorContact) {
      return res
        .status(400)
        .json({ message: "Contact number already in use by another account." });
    }

    // check for uploaded image
    let profileImage = undefined;
    if (req.file) {
      profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // create new user, default role = entrepreneur
    const newUser = new User({
      name,
      email,
      password, // make sure password is hashed with mongoose pre-save hook
      contactno,
      education,
      bio,
      startupname,
      fundinggoal,
      profileImage,
      role: "entrepreneur", // default role
    });

    // save user first
    await newUser.save();

    // create JWT token after saving
    const tokenPayload = {
      id: newUser._id,
      name: name,
      email: email,
      role: "entrepreneur",
      contactno: contactno,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        contactno: newUser.contactno,
      },
      token,
    });
  } catch (err) {
    console.error("Error in RegisterUser:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//Login function for users (Entrepreneur, Investor, Admin)
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Contact and password are required",
      });
    }

    let user = null;
    let role = "";

    const userRoles = [
      { model: Entrepreneur, role: "entrepreneur" },
      { model: Investor, role: "investor" },
      { model: Admin, role: "admin" },
    ];

    for (const entry of userRoles) {
      user = await entry.model.findOne({
        $or: [{ email: identifier }, { contactno: identifier }],
      });

      if (user) {
        role = entry.role;
        break;
      }
    }

    if (!user) {
      console.log("User not found");
      return res
        .status(400)
        .json({ message: "Invalid email/contact or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res
        .status(400)
        .json({ message: "Invalid email/contact or password" });
    }

    // if (role === "entrepreneur"  && user.status !== "Approved") {
    //   return res.status(403).json({ message: "Your account is not approved by admin yet." });
    // }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      contact: user.contact,
      role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    // Remove sensitive field
    user.password = undefined;

    res.status(200).json({
      message: `${user.name} login successful`,
      token,
      role,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// To get the Interested Investors list from interestedInvestors array
exports.getInterestedInvestors = async (req, res) => {
  try {
    const entrepreneurId = req.user.id;

    // Find entrepreneur and populate interestedInvestors
    const entrepreneur = await Entrepreneur.findById(entrepreneurId)
      .populate("interestedInvestors")
      .exec();

    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    res.status(200).json({
      message: "Interested investors fetched successfully",
      interestedInvestors: entrepreneur.interestedInvestors, // updated key name
    });
  } catch (error) {
    console.error("Error fetching interested investors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Entrepreneur Profile
exports.getEntrepreneurProfile = async (req, res) => {
  try {
    const entrepreneurId = req.user.id; // from JWT middleware

    const entrepreneur = await User.findById(entrepreneurId).select(
      "-password"
    );
    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    res.status(200).json({
      message: "Entrepreneur profile fetched successfully",
      entrepreneur,
    });
  } catch (error) {
    console.error("Error fetching entrepreneur profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//to get all approved investors
exports.getAllInvestors = async (req, res) => {
  try {
    // Fetch all investors where status is approved (optional filter)
    const investors = await Investor.find({ status: "Approved" });

    res.status(200).json({
      message: "Fetched all entrepreneur pitches successfully",
      count: investors.length,
      investors,
    });
  } catch (error) {
    console.error("Error fetching entrepreneur pitches:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Save Investor when entrepreneur clicks "Save" button
exports.saveInvestor = async (req, res) => {
  try {
    const entrepreneurId = req.user.id; // Logged-in entrepreneur's ID
    const { investorId } = req.body;

    if (!investorId) {
      return res.status(400).json({ message: "Investor ID is required" });
    }

    // Check if investor exists
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    // Fetch entrepreneur
    const entrepreneur = await Entrepreneur.findById(entrepreneurId);
    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    // Ensure savedInvestors array exists
    if (!entrepreneur.savedInvestors) {
      entrepreneur.savedInvestors = [];
    }

    // Check for duplicates
    if (entrepreneur.savedInvestors.includes(investorId)) {
      return res.status(400).json({ message: "Investor already saved" });
    }

    // Save investor
    entrepreneur.savedInvestors.push(investorId);
    await entrepreneur.save();

    res.status(200).json({
      message: "Investor saved successfully",
      savedInvestors: entrepreneur.savedInvestors,
    });
  } catch (error) {
    console.error("Error saving investor:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  Get all saved investors for an entrepreneur
exports.getSavedInvestors = async (req, res) => {
  try {
    const entrepreneurId = req.user.id;

    // Fetch entrepreneur and populate saved investors
    const entrepreneur = await Entrepreneur.findById(entrepreneurId)
      .populate("savedInvestors") // populate with investor details
      .exec();

    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    res.status(200).json({
      message: "Saved investors fetched successfully",
      savedInvestors: entrepreneur.savedInvestors,
    });
  } catch (error) {
    console.error("Error fetching saved investors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Remove saved investor
exports.removeSavedInvestor = async (req, res) => {
  try {
    const entrepreneurId = req.user.id;
    const { investorId } = req.body;

    if (!investorId) {
      return res.status(400).json({ message: "Investor ID is required" });
    }

    // Find entrepreneur
    const entrepreneur = await Entrepreneur.findById(entrepreneurId);

    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    // Remove investorId from savedInvestors array
    //Keeps only those IDs that do not match the investorId you want to remove.
    entrepreneur.savedInvestors = entrepreneur.savedInvestors.filter(
      (id) => id.toString() !== investorId
    );

    await entrepreneur.save();

    res.status(200).json({
      message: "Investor removed from saved investors successfully",
      savedInvestors: entrepreneur.savedInvestors,
    });
  } catch (error) {
    console.error("Error removing saved investor:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    const entrepreneur = await Entrepreneur.findById(userId);
    if (!entrepreneur) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    const updatedData = { ...req.body };
    const progress = Number(req.body.progress);
    updatedData.progress = isNaN(progress) ? 0 : progress;

    if (updatedData.investmentTypes) {
      updatedData.investmentTypes = JSON.parse(updatedData.investmentTypes);
    }

    if (updatedData.otherDocs) {
      updatedData.otherDocs = JSON.parse(updatedData.otherDocs);
    }

    const [adminEmail, userEmail, investorEmail] = await Promise.all([
      Admin.findOne({ email: updatedData.email }),
      User.findOne({ email: updatedData.email, _id: { $ne: userId } }),
      Investor.findOne({ email: updatedData.email }),
    ]);

    if (adminEmail || userEmail || investorEmail) {
      return res
        .status(400)
        .json({ message: "Email already in use by another account." });
    }

    const [adminContact, userContact, investorContact] = await Promise.all([
      Admin.findOne({ contactno: updatedData.contactno }),
      User.findOne({ contactno: updatedData.contactno, _id: { $ne: userId } }),
      Investor.findOne({ contactno: updatedData.contactno }),
    ]);

    if (adminContact || userContact || investorContact) {
      return res
        .status(400)
        .json({ message: "Contact number already in use by another account." });
    }

    // Validate required fields
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

    // Handle uploaded files (keep previous if no new file)
    if (req.files.businessLicense?.[0]) {
      updatedData.businessLicense = {
        data: req.files.businessLicense[0].buffer,
        contentType: req.files.businessLicense[0].mimetype,
      };
    } else {
      updatedData.businessLicense = entrepreneur.businessLicense;
    }

    if (req.files.aadharPan?.[0]) {
      updatedData.aadharPan = {
        data: req.files.aadharPan[0].buffer,
        contentType: req.files.aadharPan[0].mimetype,
      };
    } else {
      updatedData.aadharPan = entrepreneur.aadharPan;
    }

    if (req.files.startupCertificate?.[0]) {
      updatedData.startupCertificate = {
        data: req.files.startupCertificate[0].buffer,
        contentType: req.files.startupCertificate[0].mimetype,
      };
    } else {
      updatedData.startupCertificate = entrepreneur.startupCertificate;
    }

    // Handle uploaded files (keep previous if no new file)
    if (req.files.profileImage?.[0]) {
      updatedData.profileImage = {
        data: req.files.profileImage[0].buffer,
        contentType: req.files.profileImage[0].mimetype,
      };
    } else {
      updatedData.profileImage = entrepreneur.profileImage;
    }

    // For otherDocs: merge previous with new
    if (req.files.otherDocs?.length) {
      const newDocs = req.files.otherDocs.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));
      updatedData.otherDocs = [...(entrepreneur.otherDocs || []), ...newDocs];
    } else {
      updatedData.otherDocs = entrepreneur.otherDocs;
    }

    // Update
    const updated = await Entrepreneur.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

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
};
