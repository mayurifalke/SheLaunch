const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const investorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
    },
    company: {
      type: String,
      maxlength: [100, "Company name cannot exceed 100 characters"]
    },
    contactno: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^\d{10}$/, "Contact number must be exactly 10 digits"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"]
    },
    categories: [String],
    investmentRange: [String],
    location: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"]
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"]
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Website must be a valid URL starting with http or https"],
    },
    linkedin: {
      type: String,
      trim: true,
      match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, "LinkedIn must be a valid LinkedIn URL"],
    },
    savedEntrepreneurs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "investor",
    },
  },
  { timestamps: true }
);

//for hashing password before saving
investorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model("Investor", investorSchema);
