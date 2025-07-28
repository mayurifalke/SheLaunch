import React, { useState, useEffect } from "react";
import { ListGroup, Form, Badge, Modal } from "react-bootstrap";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";

function Investor_Messages() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { socket, onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, messageId }
  const [showChatOnly, setShowChatOnly] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1000;
      setIsMobileView(mobile);
      if (!mobile) setShowChatOnly(false); // reset on large screens
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        const combined = users.map((user) => {
          let profileImage = "default-avatar.png";
          if (
            user.profileImage &&
            user.profileImage.data &&
            user.profileImage.contentType
          ) {
            const base64String = btoa(
              new Uint8Array(user.profileImage.data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            profileImage = `data:${user.profileImage.contentType};base64,${base64String}`;
          }

          const found = lastMessages.find((m) => m.participantId === user._id);
          return {
            id: user._id,
            profileImage,
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

  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove message from local state
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

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
    if (isMobileView) setShowChatOnly(true);

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
    <div
      className="d-flex"
      style={{ height: "90vh", background: "#f4f6f8", marginTop: "2px" }}
    >
      {/* Sidebar */}
      {(!showChatOnly || !isMobileView) && (
        <div
          className="border-end bg-white"
          style={{ width: isMobileView ? "100%" : "300px", overflowY: "auto" }}
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
                  {/* <FaUserCircle
                  size={40}
                  className="text-secondary me-2"
                  style={{ flexShrink: 0 }}
                /> */}
                  <img
                    src={chat.profileImage}
                    alt={chat.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
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
      )}
      {/* Chat area */}
      {(showChatOnly || !isMobileView) && (
        <div className="flex-grow-1 d-flex flex-column">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-bottom bg-white d-flex align-items-center shadow-sm">
                {/* <FaUserCircle size={40} className="text-secondary me-2" /> */}
                {isMobileView && (
                  <button
                    className="btn btn-link me-2"
                    onClick={() => setShowChatOnly(false)}
                    style={{ textDecoration: "none" }}
                  >
                    ←
                  </button>
                )}

                <img
                  src={activeChat.profileImage}
                  alt={activeChat.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />

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

                    const isOwnInvestorMessage =
                      msg.senderId === authUser._id &&
                      msg.senderModel === "investor";

                    return (
                      <div
                        key={msg._id}
                        onContextMenu={
                          isOwnInvestorMessage
                            ? (e) => {
                                e.preventDefault();
                                const menuWidth = 150; // same as your style width
                                const menuHeight = 40; // approximate height, adjust if needed
                                const padding = 10;

                                let x = e.pageX;
                                let y = e.pageY;

                                // Adjust x if going out of window
                                if (
                                  x + menuWidth + padding >
                                  window.innerWidth
                                ) {
                                  x = window.innerWidth - menuWidth - padding;
                                }

                                // Adjust y if going out of window
                                if (
                                  y + menuHeight + padding >
                                  window.innerHeight
                                ) {
                                  y = window.innerHeight - menuHeight - padding;
                                }

                                setContextMenu({
                                  x,
                                  y,
                                  messageId: msg._id,
                                });
                              }
                            : undefined
                        }
                        className={`d-flex mb-2 ${
                          isRightSide
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`p-2 px-3 rounded-4 shadow-sm position-relative ${
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
      )}
      <Modal
        show={deleteMessage}
        onHide={() => setDeleteMessage(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this message? Please note: this
          message will be deleted for both you and the recipient.
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => {
              handleDeleteMessage(deleteMessageId);
              setDeleteMessage(false);
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteMessage(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
      {contextMenu && (
        <div
          className="position-absolute bg-white shadow rounded p-2"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
            width: "150px",
          }}
        >
          <div
            className="dropdown-item"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setDeleteMessageId(contextMenu.messageId);
              setDeleteMessage(true);
              setContextMenu(null);
            }}
          >
            <RiDeleteBinLine className="me-2" /> Delete
          </div>
          {/* add more options like Reply, Forward, etc if you want */}
        </div>
      )}
    </div>
  );
}

export default Investor_Messages;
