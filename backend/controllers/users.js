const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Entrepreneur = require("../models/userModel");
const Investor = require("../models/investorModel");
const Admin = require("../models/adminModel");

exports.RegisterUser = async (req, res) => {
  try {
    
    const {
      name,
      email,
      password,
      contactno,
      education,
      linkdinurl,
      experience,
      bio,
      startupname,
      industry,
      vision,
      description,
      websiteurl,
      fundinggoal,
      raisedfunds,
      investmentTypes,
      useoffunds,
      pitchdeckurl,
      videourl,
    } = req.body;

    const existingUser = await User.findOne({ email });
if(existingUser) {
  return res.status(400).json({ message: "User already exists with this email" });
}


    // Validate required fields...

    // Prepare file data
    const files = req.files;

    const newUser = new User({
      name,
      email,
      password,
      contactno,
      education,
      linkdinurl,
      experience,
      bio,
      startupname,
      industry,
      vision,
      description,
      websiteurl,
      fundinggoal,
      raisedfunds: raisedfunds || 0,
      investmentTypes: JSON.parse(investmentTypes || "[]"),
      useoffunds,
      pitchdeckurl,
      videourl: videourl || "",

      // Convert files to schema format
      businessLicense: files.businessLicense
        ? {
            data: files.businessLicense[0].buffer,
            contentType: files.businessLicense[0].mimetype,
          }
        : undefined,

      aadhaarPan: files.aadhaarPan
        ? {
            data: files.aadhaarPan[0].buffer,
            contentType: files.aadhaarPan[0].mimetype,
          }
        : undefined,

      startupCertificate: files.startupCertificate
        ? {
            data: files.startupCertificate[0].buffer,
            contentType: files.startupCertificate[0].mimetype,
          }
        : undefined,

      otherDocs: files.otherDocs
        ? files.otherDocs.map((file) => ({
            data: file.buffer,
            contentType: file.mimetype,
          }))
        : [],
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Error in RegisterUser:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};




const JWT_SECRET = process.env.JWT_SECRET;

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
        $or: [{ email: identifier }, { contact: identifier }],
      });

      if (user) {
        role = entry.role;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email/contact or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/contact or password" });
    }

    if (role !== "admin" && user.status !== "Approved") {
      return res.status(403).json({ message: "Your account is not approved by admin yet." });
    }

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

    const entrepreneur = await User.findById(entrepreneurId).select("-password");
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

