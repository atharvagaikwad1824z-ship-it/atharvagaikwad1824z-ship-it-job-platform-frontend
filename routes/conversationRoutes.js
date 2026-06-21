const express = require("express");
const router = express.Router();

const {
  createConversation,
  getMyConversations
} = require("../controllers/conversationController");

const { protect } = require("../middleware/auth");

router.post("/", protect, createConversation);
router.get("/my", protect, getMyConversations);

module.exports = router;
