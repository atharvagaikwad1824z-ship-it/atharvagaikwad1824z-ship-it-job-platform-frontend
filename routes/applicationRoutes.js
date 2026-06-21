const express = require("express");

const {
  applyForJob,
  getApplicationForEmployer,
  getUserApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  checkIfApplied,
} = require("../controllers/applicationController");

const { protect, restrictTo } = require("../middleware/auth");

const upload = require("../middleware/resumeUpload");

const router = express.Router();

// Candidate applies with resume upload
router.post(
  "/",
  protect,
  restrictTo("candidate"),
  upload.single("resume"),
  applyForJob
);

// Candidate's applications
router.get(
  "/user",
  protect,
  restrictTo("candidate"),
  getUserApplications
);

// Employer dashboard applications
router.get(
  "/employer",
  protect,
  restrictTo("employer"),
  getApplicationForEmployer
);

// Applications for specific job
router.get(
  "/job/:jobId",
  protect,
  restrictTo("employer"),
  getApplicationsByJob
);

// Update status
router.put(
  "/:id/status",
  protect,
  restrictTo("employer"),
  updateApplicationStatus
);

// Check if candidate already applied
router.get(
  "/check/:jobId",
  protect,
  restrictTo("candidate"),
  checkIfApplied
);

module.exports = router;