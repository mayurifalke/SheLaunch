const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"],
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
  education: {
    type: String,
    required: [true, "Education is required"],
    maxlength: [100, "Education cannot exceed 100 characters"]
  },
  linkdinurl: {
    type: String,
    required: [true, "LinkedIn URL is required"],
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, "Must be a valid LinkedIn URL"]
  },
  experience: {
    type: String,
    required: [true, "Experience is required"],
    maxlength: [100, "Experience cannot exceed 100 characters"]
  },
  bio: {
    type: String,
    required: [true, "Bio is required"],
    maxlength: [500, "Bio cannot exceed 500 characters"]
  },
  startupname: {
    type: String,
    required: [true, "Startup name is required"],
    maxlength: [100, "Startup name cannot exceed 100 characters"]
  },
  industry: {
    type: String,
    required: [true, "Industry is required"],
    maxlength: [100, "Industry cannot exceed 100 characters"]
  },
  vision: {
    type: String,
    required: [true, "Vision is required"],
    maxlength: [300, "Vision cannot exceed 300 characters"]
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  websiteurl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, "Website must be a valid URL starting with http or https"],
  },
  fundinggoal: {
    type: Number,
    required: [true, "Funding goal is required"],
    min: [0, "Funding goal must be positive"]
  },
  raisedfunds: {
    type: Number,
    default: 0,
    min: [0, "Raised funds must be positive"]
  },
  savedInvestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investor"
  }],
  interestedInvestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investor"
  }],
  investmentTypes: {
    type: [String],
    validate: {
      validator: function(arr) {
        return Array.isArray(arr) && arr.every(s => typeof s === 'string');
      },
      message: "Investment types must be an array of strings"
    }
  },
  useoffunds: {
    type: String,
    required: [true, "Use of funds is required"],
    maxlength: [500, "Use of funds cannot exceed 500 characters"]
  },
  pitchdeckurl: {
    type: String,
    required: [true, "Pitch deck URL is required"],
    trim: true,
    match: [/^https?:\/\/.+/, "Pitch deck URL must be a valid URL"]
  },
  videourl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, "Video URL must be a valid URL"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  businessLicense: {
    data: { type: Buffer, required: [true, "Business license file is required"] },
    contentType: { type: String, required: [true, "Content type of business license is required"] }
  },
  aadhaarPan: {
    data: { type: Buffer, required: [true, "Aadhaar/PAN file is required"] },
    contentType: { type: String, required: [true, "Content type of Aadhaar/PAN is required"] }
  },
  startupCertificate: {
    data: { type: Buffer, required: [true, "Startup certificate file is required"] },
    contentType: { type: String, required: [true, "Content type of startup certificate is required"] }
  },
  otherDocs: [{
    data: Buffer,
    contentType: String
  }],
  role: {
    type: String,
    default: "user",
    enum: ["user"]
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: '',
    maxlength: [300, "Rejection reason cannot exceed 300 characters"]
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);