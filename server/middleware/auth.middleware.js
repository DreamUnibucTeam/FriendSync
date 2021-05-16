const { auth } = require("../firebase/firebase.admin.js");

const checkAuthenticationToken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication not found" });
    }

    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Server error occured @auth.middleware: " + err.message,
    });
  }
};

module.exports = { checkAuthenticationToken };
