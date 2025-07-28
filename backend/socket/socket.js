const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// keep track: userId -> Set of socketIds
const userSocketMap = new Map();

// helper to get all online userIds
const getOnlineUserIds = () => Array.from(userSocketMap.keys());

// ✅ add this helper to get a single receiver's socketId (if any)
const getReceiverSocketId = (receiverId) => {
  const sockets = userSocketMap.get(receiverId);
  // get the first socketId in the set (user may have multiple connections)
  if (sockets && sockets.size > 0) {
    return Array.from(sockets)[0];
  }
  return null;
};

io.on("connection", (socket) => {
  console.log("✅ a user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("Connected userId:", userId);

  if (userId && userId !== "undefined") {
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);
  }

  io.emit("getOnlineUsers", getOnlineUserIds());

  socket.on("sendMessage", (newMsg) => {
    io.emit("newMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("❌ user disconnected:", socket.id);
    if (userId && userSocketMap.has(userId)) {
      const userSockets = userSocketMap.get(userId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }
    io.emit("getOnlineUsers", getOnlineUserIds());
  });
});

// export everything you need
module.exports = {
  app,
  server,
  io,
  getReceiverSocketId, // ✅ export it here
};
