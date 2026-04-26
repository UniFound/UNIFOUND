import Conversation from "../models/conversation.js";

export const createConversation = async (req, res) => {
  try {
    const { user1, user2, claimId } = req.body;

    const existing = await Conversation.findOne({
      members: { $all: [user1, user2] },
      claimId,
    });

    if (existing) return res.status(200).json(existing);

    const newConv = await Conversation.create({
      members: [user1, user2],
      claimId,
    });

    res.status(201).json(newConv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const convs = await Conversation.find({
      members: { $in: [userId] },
    }).populate("members", "firstName lastName email");

    res.status(200).json(convs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};