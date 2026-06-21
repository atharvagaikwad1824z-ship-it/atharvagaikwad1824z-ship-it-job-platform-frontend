import api from "./api";

export const getMyConversations = () => api.get("/conversations/my");
export const createConversation = (receiverId) =>
  api.post("/conversations", { receiverId });
