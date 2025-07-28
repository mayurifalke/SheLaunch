const express = require("express");
const { isUserLoggedIn } = require("../middleware/authMiddleware.js");
const router = express.Router();
const messageController = require("../controllers/message.js");
const checkInvestorApproval = require("../middleware/checkInvestorApproval.js");
const { authorizeRole } = require("../middleware/authenticateRole.js");

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

router.get(
  "/:id",
  isUserLoggedIn,
  messageController.getMessage
);

router.post(
  "/send/:id",
  isUserLoggedIn,
  // checkInvestorApproval,
  // authorizeRole(["investor", "entrepreneur"]),
  messageController.sendMessage
);

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
  isUserLoggedIn,
  // checkInvestorApproval,
  // authorizeRole(["investor", "entrepreneur"]),
  messageController.markMessagesAsRead
);

// DELETE /api/messages/:messageId
router.delete(
  "/:messageId",
  isUserLoggedIn,
  // checkInvestorApproval,
  // authorizeRole(["investor", "entrepreneur"]),
  messageController.deleteMessage
);

module.exports = router;
