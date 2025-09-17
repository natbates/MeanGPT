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
            }, 300); // typing speed (ms)
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
            }, 400);
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

    if (!activeChat) {
        return (
            <div id="chat-content" onClick={onContentClick}>
                <div className="chat-message bot fly-down" style={{ animationDelay: "0s" }}>
                    Hey there! How can I assist you today?
                    <br />
                    <small className="timestamp">{new Date().toLocaleTimeString()}</small>
                </div>
            </div>
        );
    }

    const totalMessages = activeChat.logs.length;

    return (
        <div id="chat-content" onClick={onContentClick} key={activeChat.id}>
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
                        style={{
                            animationDelay: `${delay}s`
                        }}
                    >
                        {isTyping ? typingText || "" : log.message}
                        <br />
                        <small className="timestamp">
                            {new Date(log.timestamp).toLocaleTimeString()}
                        </small>
                    </div>
                );
            })}

            {showThinking && (
                <div
                    className="chat-message bot fly-down"
                    style={{ animationDelay: `${0.1}s` }}
                >
                    {thinkingDots}
                    <br />
                    <small className="timestamp">{new Date().toLocaleTimeString()}</small>
                </div>
            )}
        </div>
    );
};

export default ChatContent;
