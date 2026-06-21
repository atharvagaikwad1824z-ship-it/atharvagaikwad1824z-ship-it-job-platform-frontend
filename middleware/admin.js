const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin Access Only",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { adminOnly };