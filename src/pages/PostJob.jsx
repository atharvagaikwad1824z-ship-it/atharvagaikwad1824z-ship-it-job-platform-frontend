import { useState } from "react";
import { toast } from "react-toastify";
import { createJob } from "../services/jobService";
import "./PostJob.css";

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    category: "",
    type: "full-time",
    salary: "",
    experience: "",
    description: "",

    // ATS Fields
    requiredSkills: "",
    preferredSkills: "",
    education: "",
    minExperienceYears: 0,
    passingScore: 60,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,

        requiredSkills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        preferredSkills: formData.preferredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await createJob(payload);

      toast.success("Job Posted Successfully ✅");

      setFormData({
        title: "",
        companyName: "",
        location: "",
        category: "",
        type: "full-time",
        salary: "",
        experience: "",
        description: "",

        requiredSkills: "",
        preferredSkills: "",
        education: "",
        minExperienceYears: 0,
        passingScore: 60,
      });
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
          "Failed to post job ❌"
      );
    }
  };

  return (
    <div className="postjob-container">
      <div className="postjob-card">
        <h2>Post a New Job</h2>

        <p className="postjob-subtitle">
          Fill in the job details below to publish it on JobPlatform.
        </p>

        <form className="postjob-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                required
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Google"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mumbai, India"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="IT / Software"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Job Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="remote">Remote</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="₹5 LPA"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Experience Required</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="0-2 years"
            />
          </div>

          {/* ATS SECTION */}

          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Express"
            />
          </div>

          <div className="form-group">
            <label>Preferred Skills</label>
            <input
              type="text"
              name="preferredSkills"
              value={formData.preferredSkills}
              onChange={handleChange}
              placeholder="Docker, AWS, Redis"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Education Required</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="B.Tech / B.E / MCA"
              />
            </div>

            <div className="form-group">
              <label>Minimum Experience (Years)</label>
              <input
                type="number"
                name="minExperienceYears"
                value={formData.minExperienceYears}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>ATS Passing Score (%)</label>
            <input
              type="number"
              name="passingScore"
              value={formData.passingScore}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write job responsibilities, requirements, skills..."
              required
            />
          </div>

          <button type="submit" className="postjob-btn">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;