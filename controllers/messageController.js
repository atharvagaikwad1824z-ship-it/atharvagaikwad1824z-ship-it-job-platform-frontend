const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send Message (store in DB)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text) {
      return res
        .status(400)
        .json({ message: "conversationId and text are required" });
    }

    // Check conversation exists
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Ensure sender is part of conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const message = new Message({
      conversationId,
      sender: req.user.id,
      text,
      seenBy: [req.user.id]
    });

    await message.save();

    // Update last message in conversation
    conversation.lastMessage = text;
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get Messages of a Conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Ensure user is part of conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "name email role companyLogo profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
