import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import axios from "axios";
import { ListGroup, Form, Badge, Modal } from "react-bootstrap";
import { RiDeleteBinLine } from "react-icons/ri";

function Messages() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { socket, onlineUsers } = useSocketContext();
  const { authUser } = useAuthContext();
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [showChatOnly, setShowChatOnly] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);

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

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch chat list
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

    if (authUser?._id) fetchData();
  }, [authUser]);

  const handleDeleteMessage = async (messageId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const handleChatClick = async (chatId) => {
    if (!authUser || !authUser._id) return;
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
      if (isMobileView) setShowChatOnly(true);
    } catch (err) {
      console.error("Error marking messages as read:", err);
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

  // Handle new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      if (
        newMsg.senderId === activeChatId ||
        newMsg.receiverId === activeChatId
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }

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
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, activeChatId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `/api/messages/send/${activeChatId}`,
        {
          message: messageText,
          receiverModel: "investor",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const activeChat = chatList.find((c) => c.id === activeChatId);

  return (
    <div
      className="d-flex w-100"
      style={{ height: "90vh", background: "#f4f6f8", marginTop: "2px" }}
    >
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
                action
                onClick={() => handleChatClick(chat.id)}
                className={`d-flex align-items-center justify-content-between ${
                  activeChatId === chat.id ? "bg-light" : ""
                }`}
                style={{
                  cursor: "pointer",
                  padding: "10px 15px",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div className="d-flex align-items-center">
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
                {chat.unread > 0 && <Badge bg="danger">{chat.unread}</Badge>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {(showChatOnly || !isMobileView) && (
        <div className="flex-grow-1 d-flex flex-column">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-bottom bg-white d-flex align-items-center shadow-sm">
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
                {messages.map((msg) => {
                  const isRightSide = msg.senderId === authUser._id;
                  const isOwnEntrepreneurMessage =
                    msg.senderId === authUser._id &&
                    msg.senderModel === "entrepreneur";
                  return (
                    <div
                      key={msg._id}
                      onContextMenu={
                        isOwnEntrepreneurMessage
                          ? (e) => {
                              e.preventDefault();
                              const menuWidth = 150; // same as your style width
                              const menuHeight = 40; // approximate height, adjust if needed
                              const padding = 10;

                              let x = e.pageX;
                              let y = e.pageY;

                              // Adjust x if going out of window
                              if (x + menuWidth + padding > window.innerWidth) {
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

              {/* Input */}
              <div className="p-3 border-top bg-white">
                <div className="d-flex align-items-center shadow-sm rounded-pill px-3 bg-white">
                  <Form.Control
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="border-0 shadow-none flex-grow-1"
                    style={{ background: "transparent" }}
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
        <Modal.Body>Are you sure you want to delete this message?</Modal.Body>
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
        </div>
      )}
    </div>
  );
}

export default Messages;
