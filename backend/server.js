const express = require('express');
const cors = require('cors');
require('dotenv').config();
require("./config/db");
// app setup
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use(express.json()); // to accept JSON

const users = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const investorRoutes = require("./routes/investorRoutes.js");

app.use('/api/admin', adminRoutes);
app.use('/api/users', users);
app.use('/api/investors', investorRoutes);

// routes import
// const investorRoutes = require('./routes/investorRoutes');
// app.use('/api/investors', investorRoutes);

// server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
