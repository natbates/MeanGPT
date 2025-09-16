import React, { useContext } from 'react';
import { ChatContext } from '../../contexts/ChatContext';

const ChatHistory = () => {
  const { chats, activeChat, setActiveChatById } = useContext(ChatContext);

  return (
    <div className="chat-history">
        {chats.map(chat => (
          <p
            key={chat.id}
            className={`history-item ${chat.id === activeChat?.id ? ' active' : ''}`}
            onClick={() => setActiveChatById(chat.id)}
            style={{
              cursor: 'pointer',
            }}
          >
            {chat.title || `Chat ${chat.id}`}
          </p>
        ))}
    </div>
  );
};

export default ChatHistory;