const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({
      role: "candidate",
    });
    const totalEmployers = await User.countDocuments({
      role: "employer",
    });
    const totalJobs = await Job.countDocuments();
    const totalApplications =
      await Application.countDocuments();

    res.json({
      totalUsers,
      totalCandidates,
      totalEmployers,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    console.log("USERS FOUND:", users.length);
    console.log(users);

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "User Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get All Jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "name email");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Job Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};