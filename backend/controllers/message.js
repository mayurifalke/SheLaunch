const { getReceiverSocketId, io } = require("../socket/socket.js");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const Connection = require("../models/connectionModel");
const mongoose = require("mongoose");

exports.sendMessage = async (req, res, next) => {
  try {
    const { message, receiverModel } = req.body; // include receiverModel in body

    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    const senderModel = req.user.role.toLowerCase();

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      senderModel,
      receiverId,
      receiverModel,
      message,
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // socket io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const { id: userToMessage } = req.params;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToMessage] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

exports.allConnectedUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let connections;
    let connectedUsers;

    if (userRole === "investor") {
      connections = await Connection.find({
        investor: userId,
        status: "Accepted",
      }).populate("entrepreneur");
      connectedUsers = connections.map((conn) => conn.entrepreneur);
    } else if (userRole === "entrepreneur") {
      connections = await Connection.find({
        entrepreneur: userId,
        status: "Accepted",
      }).populate("investor");
      connectedUsers = connections.map((conn) => conn.investor);
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json(connectedUsers);
  } catch (error) {
    next(error);
  }
};

exports.getReceivedMessages = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all messages where this user is the receiver
    const messages = await Message.find({ receiverId: userId }).sort({
      createdAt: 1,
    }); // sort oldest to newest

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching received messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUnreadMessages = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find messages where this user is the receiver and message is unread
    const unreadMessages = await Message.find({
      receiverId: userId,
      read: false,
    }).sort({ createdAt: 1 }); // sort oldest to newest

    res.status(200).json(unreadMessages);
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLastMessagesForUser = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", userId] },
              "$receiverId",
              "$senderId", 
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          participantId: "$_id",
          lastMessage: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching last messages:", error);
    next(error);
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chatPartnerId = req.params.chatPartnerId;

    await Message.updateMany(
      {
        receiverId: userId,
        senderId: chatPartnerId,
        read: false,
      },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    
    // these should come from your auth middleware or session
    const userId = req.user.id;            // logged-in user's ObjectId as string
    const userRole = req.user.role;        // "entrepreneur" or "investor"

    // find the message first
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // check if logged-in user is the sender
    if (
      message.senderId.toString() !== userId ||
      message.senderModel !== userRole
    ) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    // delete message
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
