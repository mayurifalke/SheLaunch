import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { ListGroup, Form, Badge } from "react-bootstrap";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import axios from "axios";

function Investor_Messages() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { socket, onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const [usersRes, lastMsgsRes, unreadRes] = await Promise.all([
          axios.get("/api/messages/allConnectedUsers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/messages/lastMessages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/messages/unread/${authUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const users = usersRes.data;
        const lastMessages = lastMsgsRes.data;
        const unreadMsgs = unreadRes.data;

        // Build unread counts
        const counts = unreadMsgs.reduce((acc, msg) => {
          acc[msg.senderId] = (acc[msg.senderId] || 0) + 1;
          return acc;
        }, {});

        // Combine into chatList
        const combined = users.map((user) => {
          const found = lastMessages.find((m) => m.participantId === user._id);
          return {
            id: user._id,
            name: user.name,
            lastMessage: found?.lastMessage
              ? found.lastMessage.message
              : "No messages yet",
            unread: counts[user._id] || 0,
          };
        });

        setChatList(combined);
      } catch (err) {
        console.error(err);
      }
    };

    if (authUser?._id) {
      fetchData();
    }
  }, [authUser]);

  // Fetch messages when chat changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${activeChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (activeChatId) fetchMessages();
  }, [activeChatId, authUser]);

  useEffect(() => {
    // console.log("✅ onlineUsers from socket:", onlineUsers);
  }, [onlineUsers]);

  const handleNewMessage = (newMsg) => {
    // Always update last message
    setChatList((prev) =>
      prev.map((chat) => {
        if (chat.id === newMsg.senderId || chat.id === newMsg.receiverId) {
          const isNotActive = chat.id !== activeChatId;
          const isFromSender = newMsg.senderId === chat.id;
          return {
            ...chat,
            lastMessage: newMsg.message,
            unread:
              isNotActive && isFromSender
                ? (chat.unread || 0) + 1
                : chat.unread,
          };
        }
        return chat;
      })
    );

    // Only add to messages if it’s for active chat
    if (
      newMsg.senderId === activeChatId ||
      newMsg.receiverId === activeChatId
    ) {
      setMessages((prev) => [...prev, newMsg]);
    }
  };
  
  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, activeChatId]);

  const handleChatClick = async (chatId) => {
    if (!authUser || !authUser._id) {
      console.error("authUser or authUser.id is undefined");
      return;
    }

    setActiveChatId(chatId);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/api/messages/markAsRead/${authUser._id}/${chatId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatList((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat))
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    const token = localStorage.getItem("token");
    try {
      // call backend API
      const res = await axios.post(
        `/api/messages/send/${activeChatId}`,
        {
          message: messageText,
          receiverModel: "entrepreneur", // or "Investor" depending on the receiver
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newMsg = res.data;
      setMessages((prev) => [...prev, newMsg]);
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const activeChat = chatList.find((c) => c.id === activeChatId);

  return (
    <div className="d-flex" style={{ height: "90vh", background: "#f4f6f8" }}>
      {/* Sidebar */}
      <div
        className="border-end bg-white"
        style={{ width: "300px", overflowY: "auto" }}
      >
        <div className="p-3 border-bottom">
          <h5 className="fw-bold mb-0">Messages</h5>
        </div>
        <ListGroup variant="flush">
          {chatList.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              className={`d-flex align-items-center justify-content-between ${
                activeChatId === chat.id ? "bg-light" : ""
              }`}
              action
              onClick={() => handleChatClick(chat.id)}
              style={{
                cursor: "pointer",
                padding: "10px 15px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div className="d-flex align-items-center">
                <FaUserCircle
                  size={40}
                  className="text-secondary me-2"
                  style={{ flexShrink: 0 }}
                />
                <div>
                  <div className="fw-semibold d-flex align-items-center">
                    {chat.name}
                    <span
                      className="ms-2"
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: onlineUsers.includes(chat.id)
                          ? "#28a745"
                          : "",
                        display: "inline-block",
                      }}
                    ></span>
                  </div>

                  <small className="text-muted">{chat.lastMessage}</small>
                </div>
              </div>
              {chat.unread > 0 && (
                <Badge bg="danger" pill>
                  {chat.unread}
                </Badge>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Chat area */}

      <div className="flex-grow-1 d-flex flex-column">
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className="p-3 border-bottom bg-white d-flex align-items-center shadow-sm">
              <FaUserCircle size={40} className="text-secondary me-2" />
              <div>
                <div className="fw-bold">{activeChat.name}</div>
                {/* <small className="text-success">Online</small> */}
                <small
                  className={
                    onlineUsers.includes(activeChat.id)
                      ? "text-success"
                      : "text-muted"
                  }
                >
                  {onlineUsers.includes(activeChat.id) ? "Online" : "Offline"}
                </small>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-grow-1 p-3 overflow-auto"
              style={{ background: "#f9fafb" }}
            >
              <div
                className="flex-grow-1 p-3 overflow-auto"
                style={{ background: "#f9fafb" }}
              >
                {messages.map((msg) => {
                  let isRightSide = false;

                  if (
                    msg.senderModel === "investor" &&
                    msg.receiverModel === "entrepreneur"
                  ) {
                    isRightSide = true;
                  } else if (
                    msg.senderModel === "entrepreneur" &&
                    msg.receiverModel === "investor"
                  ) {
                    isRightSide = false;
                  }

                  return (
                    <div
                      key={msg._id}
                      className={`d-flex mb-2 ${
                        isRightSide
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-2 px-3 rounded-4 shadow-sm ${
                          isRightSide
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <span style={{ whiteSpace: "pre-line" }}>
                          {msg.message}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-top bg-white">
              <div className="d-flex align-items-center shadow-sm rounded-pill px-3 bg-white">
                <Form.Control
                  placeholder="Write a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  className="border-0 shadow-none flex-grow-1"
                  style={{ background: "transparent", marginRight: "200px" }}
                />
                <button
                  onClick={sendMessage}
                  className="btn btn-link text-decoration-none"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-send"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.55l-6 14a.5.5 0 0 1-.931-.196l-1.174-4.703-4.703-1.174a.5.5 0 0 1-.196-.931l14-6a.5.5 0 0 1 .894.454zM6.832 9.168l.768 3.073 4.429-10.345L1.684 8l5.148 1.168z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow-1 d-flex justify-content-center align-items-center text-muted">
            <div>Select a chat to start messaging</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Investor_Messages;
