import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";
import { maxAmountOfChats } from "../../utils/default";

const ChatContent = ({ onContentClick, firstMessageForUnselected }) => {
  const {
    activeChat,
    setChats,
    botThinking,
    typingLogIds,
    setTypingLogIds,
    chats,
    fetchBotResponse, // ✅ get from context
  } = useContext(ChatContext);

  const [showThinking, setShowThinking] = useState(false);
  const [thinkingDots, setThinkingDots] = useState(".");
  const intervalRef = useRef(null);
  const delayRef = useRef(null);

  const [typingMessages, setTypingMessages] = useState({});
  const [animatedMessages, setAnimatedMessages] = useState(new Set());
  const [newBotLogIds, setNewBotLogIds] = useState([]);
  const chatContentRef = useRef(null);

  // Typing animation
  useEffect(() => {
    typingLogIds.forEach((logId) => {
        if (typingMessages[logId]) return;

        const log = activeChat?.logs.find((l) => l.id === logId);
        if (!log) return;

        let index = 0;

        // Read reply_speed directly from localStorage
        const storedOptions = localStorage.getItem("options");
        const replySpeed = storedOptions ? JSON.parse(storedOptions).reply_speed || 1 : 1;

        const intervalDelay = 30 * replySpeed; // scales typing speed

        const interval = setInterval(() => {
        index++;
        setTypingMessages((prev) => ({
            ...prev,
            [logId]: log.message.slice(0, index),
        }));

        if (index >= log.message.length) {
            clearInterval(interval);
            setTypingLogIds((prev) => prev.filter((id) => id !== logId));
            setNewBotLogIds((prev) => [...prev, logId]);
            setAnimatedMessages((prev) => new Set(prev).add(logId));
        }
        }, intervalDelay);
    });
  }, [typingLogIds, activeChat, typingMessages, setTypingLogIds]);

  // Thinking dots animation
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
      }, 1000);
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

  // Reset typing & animation when switching chats
  useEffect(() => {
    setTypingMessages({});
    setNewBotLogIds([]);
    setAnimatedMessages(new Set());
  }, [activeChat?.id]);

  // Scroll to bottom
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [activeChat?.logs, showThinking]);

  if (!activeChat) {
    if (chats.length >= maxAmountOfChats) {
      return (
        <div className="chat-content-container">
          <div id="chat-content" ref={chatContentRef} onClick={onContentClick}>
            <div
              className="chat-message bot full-opacity"
              style={{ textAlign: "right" }}
            >
              You've reached the maximum number of chats.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="chat-content-container">
        <div id="chat-content" ref={chatContentRef} onClick={onContentClick}>
          <div className="chat-message bot fly-down" style={{ animationDelay: "0s" }}>
            {firstMessageForUnselected}
            <br />
            <small className="timestamp">{new Date().toLocaleTimeString()}</small>
          </div>
        </div>
      </div>
    );
  }

  const totalMessages = activeChat.logs.length;

  const handleRetry = (errorLogId) => {
    if (!activeChat) return;

    // Remove the error log from the chat
    const updatedLogs = activeChat.logs.filter((log) => log.id !== errorLogId);

    const updatedChats = chats.map((chat) =>
        chat.id === activeChat.id ? { ...chat, logs: updatedLogs } : chat
    );

    setChats(updatedChats);

    const updatedChat = updatedChats.find((c) => c.id === activeChat.id);

    // Find the last user message to retry bot response
    const lastUserMessage = updatedChat.logs
        .filter((l) => l.sender === "user")
        .slice(-1)[0]?.message;


    console.log("IUSERS LAST MESSAGE, ", lastUserMessage)

    if (lastUserMessage) {
        fetchBotResponse(updatedChat); // triggers bot to reply again
    }
  };

  return (
    <div className="chat-content-container" onClick={onContentClick}>
      <div id="chat-content" ref={chatContentRef} key={activeChat.id}>
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
              className={`chat-message ${log.sender} ${shouldAnimate ? "fly-down" : ""} ${
                newBotLogIds.includes(log.id) || isTyping ? "full-opacity" : ""
              }`}
              style={{ animationDelay: `${delay}s` }}
            >
              {isTyping ? typingText || "" : log.message}
              <br />
              <span className="under-text">
                <small className="timestamp">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </small>
                {log.sender === "error" && (
                  <img
                    className="retry-img"
                    src="../images/icons/retry.svg"
                    alt="retry"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRetry(log.id)} // ✅ calls context
                  />
                )}
              </span>
            </div>
          );
        })}

        {showThinking && (
          <div className="chat-message bot fly-down" style={{ animationDelay: "0s" }}>
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
