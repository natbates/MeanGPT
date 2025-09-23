import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatContent = ({ onContentClick }) => {
    const {
        activeChat,
        botThinking,
        typingLogIds,
        setTypingLogIds,
    } = useContext(ChatContext);

    const [showThinking, setShowThinking] = useState(false);
    const [thinkingDots, setThinkingDots] = useState(".");
    const intervalRef = useRef(null);
    const delayRef = useRef(null);

    const [typingMessages, setTypingMessages] = useState({});
    const [animatedMessages, setAnimatedMessages] = useState(new Set());
    const [newBotLogIds, setNewBotLogIds] = useState([]);

    // ✅ ref for the scrollable container
    const chatContentRef = useRef(null);

    // Typing animation for each message
    useEffect(() => {
        typingLogIds.forEach(logId => {
            // Skip if already typing
            if (typingMessages[logId]) return;

            const log = activeChat?.logs.find(l => l.id === logId);
            if (!log) return;

            let index = 0;
            const interval = setInterval(() => {
                index++;
                setTypingMessages(prev => ({
                    ...prev,
                    [logId]: log.message.slice(0, index),
                }));

                if (index >= log.message.length) {
                    clearInterval(interval);
                    setTypingLogIds(prev => prev.filter(id => id !== logId));
                    setNewBotLogIds(prev => [...prev, logId]);
                    setAnimatedMessages(prev => new Set(prev).add(logId));
                }
            }, 30); // typing speed (ms)
        });
    }, [typingLogIds, activeChat, typingMessages, setTypingLogIds]);

    // Handle thinking dots animation
    useEffect(() => {
        if (activeChat && botThinking.includes(activeChat.id)) {
            delayRef.current = setTimeout(() => {
                setShowThinking(true);
                setThinkingDots(".");
                let dotCount = 1;
                intervalRef.current = setInterval(() => {
                    dotCount = dotCount < 3 ? dotCount + 1 : 1;
                    setThinkingDots(".".repeat(dotCount));
                }, 500);
            }, 0);
        } else {
            setShowThinking(false);
            setThinkingDots(".");
            clearInterval(intervalRef.current);
            clearTimeout(delayRef.current);
        }

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(delayRef.current);
        };
    }, [botThinking, activeChat]);

    // Reset typing & animated state when switching chats
    useEffect(() => {
        setTypingMessages({});
        setNewBotLogIds([]);
        setAnimatedMessages(new Set());
    }, [activeChat?.id]);

    // ✅ Scroll to bottom whenever logs or thinking indicator changes
    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
            // For smooth scroll:
            // chatContentRef.current.scrollTo({ top: chatContentRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [activeChat?.logs, showThinking]);

    if (!activeChat) {
        return (
            <div className="chat-content-container">
                <div id="chat-content" ref={chatContentRef} onClick={onContentClick}>
                    <div className="chat-message bot fly-down" style={{ animationDelay: "0s" }}>
                        Hey there! How can I assist you today?
                        <br />
                        <small className="timestamp">{new Date().toLocaleTimeString()}</small>
                    </div>
                </div>
            </div>
        );
    }

    const totalMessages = activeChat.logs.length;

    return (
        <div className="chat-content-container" onClick={onContentClick}>
            <div
                id="chat-content"
                ref={chatContentRef}
                key={activeChat.id}
            >
                {activeChat.logs.map((log, idx) => {
                    const reverseIdx = totalMessages - idx - 1;
                    const delay = reverseIdx * 0.1;

                    const isTyping = typingLogIds.includes(log.id);
                    const typingText = typingMessages[log.id];
                    const hasAnimated = animatedMessages.has(log.id);
                    const shouldAnimate = !isTyping && !hasAnimated;

                    return (
                        <div
                            key={log.id}
                            className={`chat-message ${log.sender} ${shouldAnimate ? "fly-down" : ""} ${newBotLogIds.includes(log.id) || isTyping ? "full-opacity" : ""}`}
                            style={{ animationDelay: `${delay}s` }}
                        >
                            {isTyping ? typingText || "" : log.message}
                            <br />
                            <span className="under-text">
                                <small className="timestamp">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </small>
                                {log.sender === "error" && <img className="retry-img" src = "../images/icons/retry.svg"></img>}
                            </span>
                        </div>
                    );
                })}

                {showThinking && (
                    <div
                        className="chat-message bot fly-down"
                        style={{ animationDelay: "0s" }}
                    >
                        {thinkingDots}
                        <br />
                        <small className="timestamp">{new Date().toLocaleTimeString()}</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatContent;
