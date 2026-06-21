import api from "./api";

export const getApplicationsByJob = (jobId) =>api.get(`/application/job/${jobId}`);
export const updateApplicationStatus = (applicationId, status) =>api.put(`/application/${applicationId}/status`, { status });
export const getUserApplications = () =>api.get("/application/user");
export const checkIfApplied = (jobId) =>api.get(`/application/check/${jobId}`);
