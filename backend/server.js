const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// app setup
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}));

app.use(express.json()); // to accept JSON

const users = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const investorRoutes = require("./routes/investorRoutes.js");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use('/api/admin', adminRoutes);
app.use('/api/users', users);
app.use('/api/investors', investorRoutes);

// routes import
// const investorRoutes = require('./routes/investorRoutes');
// app.use('/api/investors', investorRoutes);

// server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
