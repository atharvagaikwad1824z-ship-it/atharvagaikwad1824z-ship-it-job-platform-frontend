import api from "./api";

export const getStats = () =>
  api.get("/admin/stats");

export const getUsers = () =>
  api.get("/admin/users");

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);

export const getJobs = () =>
  api.get("/admin/jobs");

export const deleteJob = (id) =>
  api.delete(`/admin/jobs/${id}`);