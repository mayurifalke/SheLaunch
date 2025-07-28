const Entrepreneur = require("../models/userModel");
const Investor = require("../models/investorModel");
const Connection = require("../models/connectionModel");


exports.RegisterInvestor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactno,
      categories,
      minInvestment,
      maxInvestment,
    } = req.body;

    // ✅ Check required fields based on schema
    if (
      !name || !email || !password || !contactno || !categories ||
      !minInvestment || !maxInvestment
    ) {
      return res.status(400).json({ message: "Please fill all the required fields" });
    }

    // ✅ Check if user already exists
    const existingInvestor = await Investor.findOne({ email });
    if (existingInvestor) {
      return res.status(400).json({ message: "Investor already exists" });
    }

    // ✅ Get files from request
    const files = req.files;
    // console.log("Uploaded files:", files);

    // Validate files exist
    if (!files.aadharPan || !files.certificate || !files.profileImage) {
      return res.status(400).json({ message: "Please upload Aadhar/PAN and Certificate files" });
    }

    // ✅ Create new investor user
    const newInvestor = new Investor({
      name,
      email,
      password,
      contactno,
      categories,
      minInvestment,
      maxInvestment,
      status: "Pending", // default status
      role: "investor", // default role

      // ✅ Store files as Buffer and mimetype for retrieval or later upload to S3
      aadharPan: {
        data: files.aadharPan[0].buffer,
        contentType: files.aadharPan[0].mimetype,
        filename: files.aadharPan[0].originalname
      },
      certificate: {
        data: files.certificate[0].buffer,
        contentType: files.certificate[0].mimetype,
        filename: files.certificate[0].originalname
      },
       profileImage: {
        data: files.profileImage[0].buffer,
        contentType: files.profileImage[0].mimetype,
        filename: files.profileImage[0].originalname
      },
    });

    await newInvestor.save();

    res.status(201).json({ message: "Investor registered successfully", user: newInvestor });
  }
  catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllEntrepreneurPitches = async (req, res) => {
  try {
    // Fetch all entrepreneurs where status is approved (optional filter)
    const entrepreneurs = await Entrepreneur.find({ status: "Approved" }); 

    res.status(200).json({
      message: "Fetched all entrepreneur pitches successfully",
      count: entrepreneurs.length,
      entrepreneurs,
    });
  } catch (error) {
    console.error("Error fetching entrepreneur pitches:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//to save entrepreneur's ideas
exports.saveEntrepreneur = async (req, res) => {
  try {
    // console.log("Request body:", req.body); // 👈 Add this to debug

    const investorId = req.user.id;
    // console.log("Investor ID from token:", investorId);

    const { entrepreneurId } = req.body;

    if (!entrepreneurId) {
      return res.status(400).json({ message: "Entrepreneur ID is required" });
    }

    const entrepreneur = await Entrepreneur.findById(entrepreneurId);
    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    if (investor.savedEntrepreneurs.includes(entrepreneurId)) {
      return res.status(400).json({ message: "Entrepreneur already saved" });
    }

    investor.savedEntrepreneurs.push(entrepreneurId);
    await investor.save();

    res.status(200).json({
      message: "Entrepreneur saved successfully",
      savedEntrepreneurs: investor.savedEntrepreneurs,
    });
  } catch (error) {
    console.error("Error saving entrepreneur:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//When click on I'm Interested then that particular investor id should get add into interestedInvestors array for that particular enterpreur user
exports.markInterestedEntrepreneur = async (req, res) => {
  try {
    const investorId = req.user.id; // from token middleware
    const { entrepreneurId } = req.body;

    if (!entrepreneurId) {
      return res.status(400).json({ message: "Entrepreneur ID is required" });
    }

    // Find entrepreneur
    const entrepreneur = await Entrepreneur.findById(entrepreneurId);

    if (!entrepreneur) {
      return res.status(404).json({ message: "Entrepreneur not found" });
    }

    // Check if already interested
    if (entrepreneur.interestedInvestors.includes(investorId)) {
      return res.status(400).json({ message: "Already marked as interested" });
    }

    // Add investor to interestedInvestors array
    entrepreneur.interestedInvestors.push(investorId);
    await entrepreneur.save();

    res.status(200).json({
      message: "Marked as interested successfully",
      entrepreneur,
    });
  } catch (error) {
    console.error("Error marking as interested:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//to get the saved entrepreneurs/ideas from savedEntrepreneurs array
exports.getSavedEntrepreneurs = async (req, res) => {
  try {
    const investorId = req.user.id;

    // Find investor and populate saved entrepreneurs
    const investor = await Investor.findById(investorId)
      .populate("savedEntrepreneurs")
      .exec();

    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({
      message: "Saved entrepreneurs fetched successfully",
      savedEntrepreneurs: investor.savedEntrepreneurs,
    });
  } catch (error) {
    console.error("Error fetching saved entrepreneurs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//to delete the enterprenuer from savedEntrepreneurs array
exports.removeSavedEntrepreneur = async (req, res) => {
  try {
    const investorId = req.user.id; // authenticated investor ID from token
    const { entrepreneurId } = req.params; // entrepreneur ID to remove

    if (!entrepreneurId) {
      return res.status(400).json({ message: "Entrepreneur ID is required" });
    }

    // Find investor by ID and update their savedEntrepreneurs array
    const updatedInvestor = await Investor.findByIdAndUpdate(
      investorId,
      { $pull: { savedEntrepreneurs: entrepreneurId } }, // removes the entrepreneurId from array
      { new: true }
    ).populate("savedEntrepreneurs");

    if (!updatedInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({
      message: "Entrepreneur removed from saved list successfully",
      savedEntrepreneurs: updatedInvestor.savedEntrepreneurs, // updated array after deletion
    });
  } catch (error) {
    console.error("Error removing saved entrepreneur:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Investor Profile
exports.getInvestorProfile = async (req, res) => {
  try {
    const investorId = req.user.id; // from JWT middleware

    const investor = await Investor.findById(investorId).select("-password");
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({
      message: "Investor profile fetched successfully",
      investor,
    });
  } catch (error) {
    console.error("Error fetching investor profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Investors
exports.getAllInvestors = async (req, res) => {
  try {
    const investors = await Investor.find().select("-password");

    res.status(200).json({
      message: "Investors fetched successfully",
      investors,
    });
  } catch (error) {
    console.error("Error fetching investors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateConnectionStatus = async (req, res) => {
  try {
    const { connectionId, status } = req.body;  // status = "Accepted" or "Rejected"

    const updated = await Connection.findByIdAndUpdate(
      connectionId,
      { status },
      { new: true }
    );

    res.status(200).json({ message: `Connection ${status}.`, connection: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getInvestorConnections = async (req, res) => {
  try {
    const investorId = req.user.id; // or req.user.id if using auth

    const connections = await Connection.find({ investor: investorId})
      .populate('entrepreneur'); // get full entrepreneur details

    res.status(200).json({ connections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.sendConnectionRequest = async (req, res) => {
  try {
    const investorId = req.user.id; // from JWT middleware
    if (!investorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { entrepreneurId } = req.body;
    if (!entrepreneurId) {
      return res.status(400).json({ message: "Entrepreneur ID is required" });
    }

    // Check if connection already exists
    const existing = await Connection.findOne({ entrepreneur: entrepreneurId, investor: investorId });
    if (existing) {
      return res.status(400).json({ message: "Connection already exists or is pending." });
    }

    const newConnection = new Connection({
      entrepreneur: entrepreneurId,
      investor: investorId,
      status: "Pending"
    });

    await newConnection.save();
    res.status(201).json({ message: "Connection request sent.", connection: newConnection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateInvestorProfile = async (req, res) => {
  try {
    const investorId = req.user._id; // assuming req.user is set via middleware (auth)
    const {
      name,
      email,
      company,
      contactno,
      password,
      categories,
      maxInvestment,
      minInvestment,
      location,
      bio,
    } = req.body;

    const updateFields = {
      name,
      email,
      company,
      contactno,
      categories,
      maxInvestment,
      minInvestment,
      location,
      bio,
    };

    // handle password change if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // handle file uploads
    if (req.files) {
      if (req.files.profileImage && req.files.profileImage[0]) {
        updateFields.profileImage = {
          data: req.files.profileImage[0].buffer,
          contentType: req.files.profileImage[0].mimetype,
          filename: req.files.profileImage[0].originalname,
        };
      }
      if (req.files.aadharPan && req.files.aadharPan[0]) {
        updateFields.aadharPan = {
          data: req.files.aadharPan[0].buffer,
          contentType: req.files.aadharPan[0].mimetype,
          filename: req.files.aadharPan[0].originalname,
        };
      }
      if (req.files.certificate && req.files.certificate[0]) {
        updateFields.certificate = {
          data: req.files.certificate[0].buffer,
          contentType: req.files.certificate[0].mimetype,
          filename: req.files.certificate[0].originalname,
        };
      }
    }

    const updatedInvestor = await Investor.findByIdAndUpdate(
      investorId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedInvestor,
    });
  } catch (error) {
    console.error("Error updating investor profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSuggestedStartups = async (req, res) => {
  try {
    const investorId = req.user._id;


    // Fetch investor details
    const investor = await Investor.findById(investorId);
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    const { categories } = investor;

    // Match entrepreneurs with same industry as investor categories
    const suggestedStartups = await Entrepreneur.find({
  role: "entrepreneur",
  industry: { $in: categories },
  status: "Approved",
})
  .sort({ createdAt: -1 })
  .limit(3)
  .select(
    "name startupname industry startupStage description fundinggoal raisedfunds progress profileImage"
  );


    res.status(200).json({ success: true, data: suggestedStartups });
  } catch (error) {
    console.error("Error fetching suggested startups:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};