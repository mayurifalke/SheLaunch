const Admin = require("../models/adminModel");
const Entrepreneur = require("../models/userModel");
const Investor = require("../models/investorModel");

exports.RegisterUser = async (req, res) => {
  try {
    const { name, email, password, contactno } = req.body;

    if (!name || !email || !password || !contactno) {
      return res.status(400).json({ message: "Please fill all the required fields" });
    }

    // Check if admin already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new admin (password will be hashed by pre-save hook)
    const newUser = new Admin({
      name,
      email,
      password,
      contactno, // match your model field name if it's 'contact' not 'contactno'
    });

    await newUser.save();

    // Prepare user data without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "Admin registered successfully", user: userResponse });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//get all entreprenurs whose status is pending
// Get all entrepreneurs whose status is pending
exports.getPendingEntrepreneurs = async (req, res) => {
  try {
    const pendingUsers = await Entrepreneur.find({ status: "Pending" }); // adjust "Pending" if needed

    res.status(200).json({
      count: pendingUsers.length,
      pendingUsers,
    });
  } catch (err) {
    console.error("Error fetching pending entrepreneurs:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// get all investors whose status is pending
exports.getPendingInvestors = async (req, res) => {
  try {
    const pendingInvestors = await Investor.find({ status: "Pending" });
    res.status(200).json({
      count: pendingInvestors.length,
      pendingInvestors});
  } catch (err) {
    console.error("Error fetching pending investors:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getInvestorById = async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id);
    if (!investor) return res.status(404).json({ message: "Investor not found" });
    res.status(200).json(investor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEntrepreneurById = async (req, res) => {
  try {
    const entrepreneur = await Entrepreneur.findById(req.params.id);
    if (!entrepreneur) return res.status(404).json({ message: "Entrepreneur not found" });
    res.status(200).json(entrepreneur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Approve or reject an Entrepreneur
exports.verifyEntrepreneur = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const entrepreneur = await Entrepreneur.findById(req.params.id);
    if (!entrepreneur) return res.status(404).json({ message: "Entrepreneur not found" });

    entrepreneur.status = status;
    entrepreneur.rejectionReason = status === "Rejected" ? rejectionReason : "";
    await entrepreneur.save();

    res.status(200).json({ message: `Entrepreneur ${status} successfully`, entrepreneur });
  } catch (error) {
    console.error("Error verifying entrepreneur:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Approve or reject an Investor
exports.verifyInvestor = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const investor = await Investor.findById(req.params.id);
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    investor.status = status;
    investor.rejectionReason = status === "Rejected" ? rejectionReason : "";
    await investor.save();

    res.status(200).json({ message: `Investor ${status} successfully`, investor });
  } catch (error) {
    console.error("Error verifying investor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

