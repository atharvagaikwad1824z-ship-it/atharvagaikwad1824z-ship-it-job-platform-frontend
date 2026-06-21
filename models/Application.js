const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    // ATS Score
    atsScore: {
      type: Number,
      default: 0,
    },

    // Skills matched with job requirements
    matchedSkills: {
      type: [String],
      default: [],
    },

    // Skills missing from candidate resume
    missingSkills: {
      type: [String],
      default: [],
    },

    // Resume summary (optional)
    resumeSummary: {
      type: String,
      default: "",
    },

    // ATS Status
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected",
      ],
      default: "applied",
    },

    // Recruiter notes
    recruiterNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);