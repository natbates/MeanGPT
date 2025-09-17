import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatInformation = () => {
    const { activeChat, botThinking, deleteChat } = useContext(ChatContext);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Update isOffline whenever the network status changes
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!activeChat) {
        return (
            <div id="chat-information" className="chat-information one-line">
                <p className="no-chat-selected">No chat selected.</p>
                <span className="bot-status">
                    <p className="bot-text">Bot Status:{" "}</p>
                    <span className={isOffline ? "offline" : "online"}>
                        {isOffline ? "Offline" : "Online"}
                    </span>
                </span>
            </div>
        );
    }

    // Determine bot status:
    //  - Offline if browser is offline
    //  - Thinking if botThinking contains active chat id
    //  - Otherwise Online
    let botStatus;
    let botStatusClass;
    if (isOffline) {
        botStatus = "Offline";
        botStatusClass = "offline";
    } else if (botThinking.includes(activeChat.id)) {
        botStatus = "Thinking...";
        botStatusClass = "thinking";
    } else {
        botStatus = "Online";
        botStatusClass = "online";
    }

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
                        <span className="dimmed">
                            {new Date(activeChat.createdAt).toLocaleString()}
                        </span>
                    </p>

                    <div className="right-side-info">
                        <span
                            onClick={() => deleteChat(activeChat.id)}
                            className="delete-chat"
                        >
                            <strong>Delete Chat</strong>
                        </span>

                        <span className="bot-status">
                            <p className="bot-text">Bot Status:{" "}</p>
                            <span className={botStatusClass}>{botStatus}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInformation;
