import React from "react";
import "./ChatLayout.css";

type Chat = {
  id: number;
  name: string;
  message: string;
  time: string;
  unread?: number;
  avatar: string;
};

const chats: Chat[] = [
  {
    id: 1,
    name: "John Doe",
    message: "Validation tests underway!",
    time: "12:25",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    name: "Sarah P.",
    message: "UI mockups ready for review.",
    time: "12:25",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    name: "Alistair Leopold",
    message: "Documentation is ready!",
    time: "12:25",
    unread: 999,
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: 4,
    name: "Zelda Fitzgerald",
    message: "Did you get my email?",
    time: "12:25",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
];

const ChatLayout: React.FC = () => {
  return (
    <div className="chat-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">My Chats</h2>

        <input className="search" placeholder="Search..." />

        <div className="chat-list">
          {chats.map((chat) => (
            <div key={chat.id} className="chat-item">
              <img src={chat.avatar} className="avatar" />

              <div className="chat-details">
                <div className="chat-header">
                  <span className="chat-name">{chat.name}</span>
                  <span className="chat-time">{chat.time}</span>
                </div>

                <div className="chat-preview">
                  {chat.message}

                  {chat.unread && (
                    <span className="badge">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Section */}
      <section className="chat-section">
        <div className="chat-header-bar">
          <img
            src="https://i.pravatar.cc/40?img=1"
            className="avatar header-avatar"
          />
          <span className="header-name">John Doe</span>
        </div>

        <div className="chat-messages">
          <div className="message received">
            Hey, Jax! How's it going?
            <span className="msg-time">10:25</span>
          </div>

          <div className="message sent">
            Any updates on the Cerberus initiative? I'm eager to hear about the
            progress and next steps.
            <span className="msg-time">11:25</span>
          </div>

          <div className="message received">
            Have you had a chance to look over the mockups for the new user
            interface?
            <span className="msg-time">12:25</span>
          </div>

          <div className="message sent">
            I'm on it! Just finishing up validation tests.
            <span className="msg-time">11:25</span>
          </div>
        </div>

        <div className="message-input">
          <button className="plus">+</button>
          <input placeholder="Write your message..." />
          <button className="send">➤</button>
        </div>
      </section>
    </div>
  );
};

export default ChatLayout;