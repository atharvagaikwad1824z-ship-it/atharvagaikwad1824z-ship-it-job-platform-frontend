const Conversation = require("../models/Conversation");

// Create or get existing conversation
exports.createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, receiverId]
      });

      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get logged-in user's conversations
exports.getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
      .populate("participants", "name email role companyLogo profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
