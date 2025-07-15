const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactno: { type: String, required: true },
  password: { type: String, required: true },
  education: { type: String, required: true },
  linkdinurl: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  startupname: { type: String, required: true },
  industry: { type: String, required: true },
  vision: { type: String, required: true },
  description: { type: String, required: true },
  websiteurl: { type: String },
  fundinggoal: { type: Number, required: true },
  raisedfunds: { type: Number, default: 0 },
  savedInvestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Investor" }],
  interestedInvestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Investor" }],
  investmentTypes: [String],
  useoffunds: { type: String, required: true },
  pitchdeckurl: { type: String, required: true },
  videourl: { type: String },
  createdAt: { type: Date, default: Date.now },
 businessLicense: {
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
},
aadhaarPan: {
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
},
startupCertificate: {
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
},
otherDocs: [
  {
    data: Buffer,
    contentType: String,
  },
],


   role: {
    type: String,
    default: "user",
  },
  status: {
  type: String,
  enum: ['Pending', 'Approved', 'Rejected'],
  default: 'Pending'
},
rejectionReason: {
  type: String,
  default: ''
}

},{timestamps: true});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model("User", userSchema);