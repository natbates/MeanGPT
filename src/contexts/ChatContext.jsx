import React, { createContext, useState, useRef, useEffect } from "react";

const LOCAL_STORAGE_KEY = "meangpt_chats";

const getInitialChats = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    // Default mock data if nothing in storage
    return [
        {
            id: Date.now().toString(),
            title: "Welcome Chat",
            createdAt: new Date().toISOString(),
            lastMessaged: new Date().toISOString(),
            logs: [
                { sender: "bot", message: "Welcome to MeanGPT!", timestamp: new Date().toISOString() }
            ]
        }
    ];
};

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(getInitialChats);
    const [activeChat, setActiveChat] = useState(() => getInitialChats()[0]);
    const [botThinking, setBotThinking] = useState(false);
    const [thinkingDots, setThinkingDots] = useState(".");
    const thinkingInterval = useRef(null);

    // Persist chats to localStorage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
    }, [chats]);

    // Helper to create a new chat
    const createNewChat = (firstMessage) => {
        const now = new Date();
        const newChat = {
            id: now.getTime().toString(),
            title: `Chat ${chats.length + 1}`,
            createdAt: now.toISOString(),
            lastMessaged: now.toISOString(),
            logs: [
                {
                    sender: "user",
                    message: firstMessage,
                    timestamp: now.toISOString()
                }
            ]
        };
        setChats(prev => [...prev, newChat]);
        setActiveChat(newChat);
        simulateBotResponse([...chats, newChat], newChat);
    };

    const setActiveChatById = (id) => {
        const chat = chats.find(c => c.id === id);
        if (chat) setActiveChat(chat);
    };

    // Add message or create new chat if none active
    const addMessageToActiveChat = (message) => {
        if (!activeChat) {
            createNewChat(message);
            return;
        }
        const updatedChats = chats.map(chat => {
            if (chat.id === activeChat.id) {
                return {
                    ...chat,
                    logs: [
                        ...chat.logs,
                        {
                            sender: "user",
                            message,
                            timestamp: new Date().toISOString()
                        }
                    ],
                    lastMessaged: new Date().toISOString()
                };
            }
            return chat;
        });
        setChats(updatedChats);
        setActiveChat(updatedChats.find(c => c.id === activeChat.id));
        simulateBotResponse(updatedChats, updatedChats.find(c => c.id === activeChat.id));
    };

    // Bot thinking animation and response
    const simulateBotResponse = (latestChats, latestActiveChat) => {
        setBotThinking(true);
        setThinkingDots(".");
        let dotCount = 1;
        const addOrUpdateThinking = () => {
            setThinkingDots(".".repeat(dotCount));
            setChats(prevChats =>
                prevChats.map(chat => {
                    if (chat.id === latestActiveChat.id) {
                        let logs = [...chat.logs];
                        if (logs.length && logs[logs.length - 1].sender === "bot" && logs[logs.length - 1].message.match(/^\.*$/)) {
                            logs.pop();
                        }
                        logs.push({
                            sender: "bot",
                            message: ".".repeat(dotCount),
                            timestamp: new Date().toISOString()
                        });
                        return { ...chat, logs };
                    }
                    return chat;
                })
            );
        };

        addOrUpdateThinking();

        thinkingInterval.current = setInterval(() => {
            dotCount = dotCount < 3 ? dotCount + 1 : 1;
            addOrUpdateThinking();
        }, 500);

        setTimeout(() => {
            clearInterval(thinkingInterval.current);
            setThinkingDots("");
            const response = "This is a bot response!";
            setChats(prevChats => {
                const updated = prevChats.map(chat => {
                    if (chat.id === latestActiveChat.id) {
                        let logs = [...chat.logs];
                        if (
                            logs.length &&
                            logs[logs.length - 1].sender === "bot" &&
                            logs[logs.length - 1].message.match(/^\.*$/)
                        ) {
                            logs.pop();
                        }
                        logs.push({
                            sender: "bot",
                            message: response,
                            timestamp: new Date().toISOString()
                        });
                        return {
                            ...chat,
                            logs,
                            lastMessaged: new Date().toISOString()
                        };
                    }
                    return chat;
                });
                // Set activeChat to the updated chat object
                setActiveChat(updated.find(c => c.id === latestActiveChat.id));
                return updated;
            });
            setBotThinking(false);
        }, 5100);
    };

    return (
        <ChatContext.Provider value={{
            chats,
            activeChat,
            setActiveChatById,
            addMessageToActiveChat,
            botThinking,
            thinkingDots
        }}>
            {children}
        </ChatContext.Provider>
    );
};