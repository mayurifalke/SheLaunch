const jwt = require("jsonwebtoken");

const isAdminLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Allow only Admin here
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = decoded;
    next();

  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = { isAdminLoggedIn };
