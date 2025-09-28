import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/nav.css';

const ChatHistory = ({ mobileOpen }) => {
  const { chats, activeChat, setActiveChatById } = useContext(ChatContext);
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);


  const goToChat = (chatId) => {
    if (window.location.pathname !== "/chat") {
      navigate("/chat");
    }
    setActiveChatById(chatId);
  };

  useEffect(() => {
    const navBar = document.querySelector('.nav-bar');
    if (!navBar) return;

    const handleMouseEnter = () => setHovering(true);
    const handleMouseLeave = () => setHovering(false);

    navBar.addEventListener('mouseenter', handleMouseEnter);
    navBar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      navBar.removeEventListener('mouseenter', handleMouseEnter);
      navBar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);


  const sortedChats = [...chats].sort((a, b) => new Date(b.lastMessaged) - new Date(a.lastMessaged));
  const animateIn = hovering || mobileOpen;


  return (
    <div className='chat-history-container'>
      <h4
        className={`history-title ${animateIn ? 'fly-down' : ''}`}
        style={{ animationDelay: '0.1s' }}
      >History</h4>
      <div className="chat-history">
        {sortedChats.length > 0 ? (
          sortedChats.map((chat, index) => (
            <span 
              key={chat.id}
              onClick={() => goToChat(chat.id)}
              style={{ animationDelay: animateIn ? `${index * 0.1 + 0.1}s` : '0s' }}
              className={`history-item ${animateIn ? 'fly-down' : ''} ${chat.id === activeChat?.id ? 'active' : ''}`}
            >
              <p
                className="chat-title"
                style={{
                  textDecoration: chat?.finished ? "line-through" : "none"
                }}
              >
                {chat.title || `Chat ${chat.id}`}
              </p>
              <p className='timestamp'>
                <small className="dimmed" style={{ fontSize: '0.7rem' }}>
                  {new Date(chat.createdAt).toLocaleDateString()} {new Date(chat.createdAt).toLocaleTimeString()}
                </small>
              </p>
            </span>
          ))
        ) : (
          <span
            className={`history-item ${animateIn ? 'fly-down' : ''}`}
            style={{ animationDelay: '0.2s', cursor: 'default' }}
          >
            <p className="chat-title" style={{opacity: 0.6}}>No chats yet</p>
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
