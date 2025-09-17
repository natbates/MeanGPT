import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/nav.css';

const ChatHistory = () => {
  const { chats, activeChat, setActiveChatById } = useContext(ChatContext);
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);

  const goToChat = (chatId) => {
    if (window.location.pathname !== "/chat") {
      navigate("/chat");
    }
    setActiveChatById(chatId);
  };

  useEffect(() => {
    const navBar = document.querySelector('.nav-bar');
    if (!navBar) return;

    const handleMouseEnter = () => setAnimateIn(true);
    const handleMouseLeave = () => setAnimateIn(false);

    navBar.addEventListener('mouseenter', handleMouseEnter);
    navBar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      navBar.removeEventListener('mouseenter', handleMouseEnter);
      navBar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Sort chats by lastMessaged (descending)
  const sortedChats = [...chats].sort((a, b) => new Date(b.lastMessaged) - new Date(a.lastMessaged));

  return (
    <div className="chat-history">
      {sortedChats.map((chat, index) => (
        <span 
          key={chat.id}
          onClick={() => goToChat(chat.id)}
          style={{ animationDelay: animateIn ? `${index * 0.1}s` : '0s' }}
          className={`history-item ${animateIn ? 'fly-down' : ''} ${chat.id === activeChat?.id ? 'active' : ''}`}
        >
          <p>
            {chat.title || `Chat ${chat.id}`}
          </p>
          <p className='timestamp'>
            <small className="dimmed" style={{ fontSize: '0.7rem' }}>
              {new Date(chat.createdAt).toLocaleDateString()} {new Date(chat.createdAt).toLocaleTimeString()}
            </small>
          </p>
        </span>
      ))}
    </div>
  );
};

export default ChatHistory;
