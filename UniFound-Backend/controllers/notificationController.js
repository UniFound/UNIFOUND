// controllers/notificationController.js
import Notification from "../models/notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const data = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};