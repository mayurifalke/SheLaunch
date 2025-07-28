const { server,app } = require("./socket/socket.js");
require('dotenv').config();
require("./config/db");
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

const users = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const investorRoutes = require("./routes/investorRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");

app.use('/api/admin', adminRoutes);
app.use('/api/users', users);
app.use('/api/investors', investorRoutes);
app.use('/api/messages', messageRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})