const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
} = require(
  "../controllers/adminController"
);

const { protect, restrictTo } =
require("../middleware/auth");

const {
  adminOnly,
} = require(
  "../middleware/admin"
);

router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

router.get(
  "/jobs",
  protect,
  adminOnly,
  getAllJobs
);

router.delete(
  "/jobs/:id",
  protect,
  adminOnly,
  deleteJob
);

module.exports = router;