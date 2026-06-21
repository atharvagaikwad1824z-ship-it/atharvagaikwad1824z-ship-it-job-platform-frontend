const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },

    category: {
      type: String,
    },

    type: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },

    salary: {
      type: String,
    },

    experience: {
      type: String,
    },

    companyName: {
      type: String,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requiredSkills: [
      {
        type: String,
      },
    ],

    preferredSkills: [
      {
        type: String,
      },
    ],

    education: {
      type: String,
    },

    minExperienceYears: {
      type: Number,
      default: 0,
    },

    atsEnabled: {
      type: Boolean,
      default: true,
    },

    passingScore: {
      type: Number,
      default: 60,
    },

    totalApplicants: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", JobSchema);