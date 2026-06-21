const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      requirements,
      category,
      type,
      salary,
      experience,
      companyName,

      requiredSkills,
      preferredSkills,
      education,
      minExperienceYears,
      atsEnabled,
      passingScore,
    } = req.body;

    const job = new Job({
      title,
      description,
      location,
      requirements,
      category,
      type,
      salary,
      experience,
      companyName,

      employer: req.user.id,

      requiredSkills:
        typeof requiredSkills === "string"
          ? requiredSkills.split(",").map((s) => s.trim())
          : requiredSkills || [],

      preferredSkills:
        typeof preferredSkills === "string"
          ? preferredSkills.split(",").map((s) => s.trim())
          : preferredSkills || [],

      education,
      minExperienceYears: minExperienceYears || 0,
      atsEnabled:
        atsEnabled !== undefined ? atsEnabled : true,
      passingScore: passingScore || 60,
    });

    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      "employer",
      "name email companyLogo"
    );

    res.json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getJobById = async (req,res) =>{
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({message:'Job not found'});
        res.json(job);
    } catch(error){
        res.status(500).json({ message: 'Server Error'});
    }
};
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
