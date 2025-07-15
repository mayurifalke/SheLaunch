const Entrepreneur = require("../models/userModel");
const Investor = require("../models/investorModel");

exports.RegisterInvestor = async (req, res) => {
  try{
    const {name,email,password,contactno,company,categories,investmentRange,location,bio,website,linkedin} = req.body;

    if(!name || !email || !password || !contactno || !company || !categories || !investmentRange || !location || !bio || !website || !linkedin) {
      return res.status(400).json({message: "Please fill all the required fields"});
    }

    //check if user already exists
    const existingInvestor = await Investor.find({ email });
    if(existingInvestor.length > 0) {
      return res.status(400).json({message: "Investor already exists"});
    }

    //create new user
    const newInvestor = new Investor({
      name,
      email,
      password,
      contactno,
      company,
      categories,
      investmentRange,
      location,
      bio,
      website,
      linkedin,
      status: "Pending", // default status
      role: "investor", // default role
    });
      await newInvestor.save();

    res.status(201).json({ message: "User registered successfully", user: newInvestor });
  }
  catch (err) {
    console.error(err);
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




