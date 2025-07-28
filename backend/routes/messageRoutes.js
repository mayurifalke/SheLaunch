const express = require("express");
const { isUserLoggedIn } = require("../middleware/authMiddleware.js");
const router = express.Router();
const messageController = require("../controllers/message.js");

router.get(
  "/lastMessages",
  isUserLoggedIn,
  messageController.getLastMessagesForUser
);

router.get(
  "/allConnectedUsers",
  isUserLoggedIn,
  messageController.allConnectedUsers
);

router.get("/:id", isUserLoggedIn, messageController.getMessage);

router.post("/send/:id", isUserLoggedIn, messageController.sendMessage);

router.get(
  "/received/:userId",
  isUserLoggedIn,
  messageController.getReceivedMessages
);

router.get(
  "/unread/:userId",
  isUserLoggedIn,
  messageController.getUnreadMessages
);

router.put(
  "/markAsRead/:userId/:chatPartnerId",
  messageController.markMessagesAsRead
);

module.exports = router;
