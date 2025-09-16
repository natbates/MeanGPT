import React, { useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatInformation = () => {
    const { activeChat, botThinking } = useContext(ChatContext);

    const botStatus = botThinking ? "Thinking..." : "Online";

    if (!activeChat)
        return (
            <div id="chat-information" className="chat-information">
                <p className="no-chat-selected">No chat selected.</p>
            </div>
        );

    return (
        <div id="chat-information" className="chat-information">
            <h4 className="chat-title">{activeChat.title}</h4>
            <div className="chat-info-row">
                <p className="chat-id">
                    <strong>ID:</strong>{" "}
                    <span className="dimmed">{activeChat.id}</span>
                </p>
                <div className="chat-meta-row">
                    <p className="chat-created">
                        <strong>Created:</strong>{" "}
                        <span className="dimmed">{new Date(activeChat.createdAt).toLocaleString()}</span>
                    </p>
                    <span className="bot-status">
                        Bot Status:{" "}
                        <span className={botThinking ? "thinking" : "online"}>
                            {botStatus}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatInformation;