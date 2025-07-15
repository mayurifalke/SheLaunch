const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Admin name is required"],
  },
  email: {
    type: String,
    required: [true, "Admin email is required"],
    unique: true,
  },
  contactno: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    default: "admin",
  }
}, {
  timestamps: true,
});

//Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


module.exports = mongoose.model("Admin", adminSchema);
