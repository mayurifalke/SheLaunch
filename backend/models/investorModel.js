const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const investorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    company: String,
    contactno: { type: String, required: true },
    password: { type: String, required: true },
    categories: [String],
    investmentRange: [String],
    location: String,
    bio: String,
    website: String,
    linkedin: String,
    savedEntrepreneurs: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
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
