import api from "./api";

export const getAllJobs = () => api.get("/jobs");
export const getLatestJobs = () => api.get("/jobs/latest");
export const getFeaturedJobs = () => api.get("/jobs/featured");
export const createJob = (data) => api.post("/jobs", data);
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const getMyJobs = () => api.get("/jobs/my-jobs");
export const deleteJob = (id) => api.delete(`/jobs/${id}`);