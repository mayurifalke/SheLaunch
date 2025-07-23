const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investor",
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Connection", connectionSchema);
