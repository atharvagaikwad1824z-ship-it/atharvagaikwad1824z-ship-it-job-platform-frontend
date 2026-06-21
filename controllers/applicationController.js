const Application = require('../models/Application');
const Job = require('../models/Job');
const axios = require("axios");
const pdfParse = require("pdf-parse");
console.log("pdfParse:", pdfParse);
console.log("typeof pdfParse:", typeof pdfParse);

const calculateATS = require("./utils/atsService");
const extractSkills = require("./utils/extractSkills");
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const resumeUrl = req.file?.path;

    if (!resumeUrl) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied for this job",
      });
    }

    // Download Resume PDF from Cloudinary
    const pdfResponse = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    const pdfData = await pdfParse(pdfResponse.data);

    const resumeText = pdfData.text || "";

    // Extract Candidate Skills
    const candidateSkills = extractSkills(resumeText);

    // Calculate ATS Score
    const atsResult = calculateATS(
      job.requiredSkills || [],
      candidateSkills
    );

    // Auto Shortlist
    const status =
      atsResult.atsScore >= job.passingScore
        ? "shortlisted"
        : "applied";

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume: resumeUrl,

      atsScore: atsResult.atsScore,
      matchedSkills: atsResult.matchedSkills,
      missingSkills: atsResult.missingSkills,

      resumeSummary: resumeText.substring(0, 500),

      status,
    });

    // Update applicant count
    job.totalApplicants += 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("ATS Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getApplicationForEmployer = async (req, res) => {
    try {
      const jobs = await Job.find({ employer: req.user.id }).select('_id');
      const jobIds = jobs.map(job => job._id);
  
      const applications = await Application.find({ job: { $in: jobIds } })
        .populate('candidate', 'name email profilePic')
        .populate('job', 'title location');
  
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
exports.getUserApplications = async (req, res) => {
    try {
      const applications = await Application.find({ candidate: req.user.id })
        .populate('job', 'title location type salary');
  
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Ensure employer owns the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email profilePic')
      .sort({ atsScore: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
exports.checkIfApplied = async (req, res) => {
  try {
    const { jobId } = req.params;

    const existing = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existing) {
      return res.json({ applied: true, status: existing.status });
    }

    res.json({ applied: false });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
