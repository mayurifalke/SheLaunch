import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { ListGroup, Form, Badge } from "react-bootstrap";

function Messages() {
  // Demo chat list
  const initialChatList = [
    {
      id: 1,
      name: "Amruta Thikole",
      lastMessage: "You: Kontya role sathi",
      unread: 2,
    },
    {
      id: 2,
      name: "LinkedIn Offer",
      lastMessage: "Hi there, Ashwini! Thank...",
      unread: 0,
    },
    {
      id: 3,
      name: "Saurav Tupe",
      lastMessage: "You: Yes but I want a wor...",
      unread: 1,
    },
  ];

  // Messages data
  const messagesData = {
    1: [
      {
        id: 1,
        sender: "Ashwini Thikole",
        text: "Tumchi company ahe ka hi",
        time: "9:28 PM",
        fromMe: true,
      },
      {
        id: 2,
        sender: "Amruta Thikole",
        text: "Ho",
        time: "9:37 PM",
        fromMe: false,
      },
      {
        id: 3,
        sender: "Ashwini Thikole",
        text: "Recruitment ahe ka\nKontya role sathi",
        time: "9:38 PM",
        fromMe: true,
      },
    ],
    2: [
      {
        id: 1,
        sender: "LinkedIn Offer",
        text: "Hi there, Ashwini! Thanks for connecting.",
        time: "10:00 AM",
        fromMe: false,
      },
    ],
    3: [
      {
        id: 1,
        sender: "Ashwini Thikole",
        text: "Yes but I want a working demo",
        time: "11:15 AM",
        fromMe: true,
      },
      {
        id: 2,
        sender: "Saurav Tupe",
        text: "Sure, will share soon.",
        time: "11:20 AM",
        fromMe: false,
      },
    ],
  };

  // State
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatList, setChatList] = useState(initialChatList);

  // Handlers
  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
    // Mark unread as 0
    setChatList((prevList) =>
      prevList.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  };

  // Active chat details
  const activeChat = chatList.find((c) => c.id === activeChatId);
  const activeMessages = messagesData[activeChatId] || [];

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
                  <div className="fw-semibold">{chat.name}</div>
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
            <div className="p-3 border-bottom bg-white d-flex align-items-center">
              <FaUserCircle size={40} className="text-secondary me-2" />
              <div>
                <div className="fw-bold">{activeChat.name}</div>
                <small className="text-success">Online</small>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-grow-1 p-3 overflow-auto"
              style={{ background: "#f9fafb" }}
            >
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-3 ${msg.fromMe ? "text-end" : "text-start"}`}
                >
                  <div
                    className={`d-inline-block p-2 rounded-3 ${
                      msg.fromMe ? "bg-primary text-white" : "bg-light text-dark"
                    }`}
                    style={{ maxWidth: "70%", whiteSpace: "pre-line" }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#888",
                      marginTop: "2px",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-top bg-white">
              <Form.Control
                placeholder="Write a message..."
                style={{ borderRadius: "20px", padding: "10px 15px" }}
              />
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

export default Messages;
