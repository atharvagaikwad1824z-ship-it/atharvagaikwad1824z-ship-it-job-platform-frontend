const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader =
    req.headers.authorization ||
    req.header("Authorization");

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token invalid",
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};