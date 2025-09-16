import React, { useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatContent = ({ onContentClick }) => {
    const { activeChat } = useContext(ChatContext);

    if (!activeChat) {
        return (
            <div id="chat-content" onClick={onContentClick}>
                <p>No chat selected.</p>
            </div>
        );
    }

    return (
        <div id="chat-content" onClick={onContentClick}>
            {activeChat.logs.map((log, idx) => (
                <div key={idx} className={`chat-message ${log.sender}`}>
                    {log.message}
                    <br />
                    <small className="timestamp">{new Date(log.timestamp).toLocaleTimeString()}</small>
                </div>
            ))}
        </div>
    );
};

export default ChatContent;