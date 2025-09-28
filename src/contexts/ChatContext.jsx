import React, { createContext, useState, useEffect } from "react";
import { defaultOptions } from "../utils/default";

import { maxAmountOfChats, maxAmountOfReplies } from "../utils/default";
import { rudeIntros } from "../utils/default";
import { v4 as uuidv4 } from "uuid";

export const LOCAL_STORAGE_KEY = "meangpt_chats";
export const LAST_ACTIVE_CHAT_KEY = "last_active_chat_id";

const getInitialChats = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const generateId = () => uuidv4();

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(getInitialChats);
    const [activeChat, setActiveChat] = useState(null);
    const [botThinking, setBotThinking] = useState([]);
    const [typingLogIds, setTypingLogIds] = useState([]);

    useEffect(() => {
        const lastActiveId = localStorage.getItem(LAST_ACTIVE_CHAT_KEY);
        if (!activeChat && chats.length > 0 && window.location.pathname === "/chat") {
            const chat = lastActiveId ? chats.find(c => c.id === lastActiveId) : chats[0];
            if (chat) setActiveChat(chat);
        }
    }, [chats]);

    useEffect(() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats)), [chats]);
    useEffect(() => { if (activeChat) localStorage.setItem(LAST_ACTIVE_CHAT_KEY, activeChat.id); }, [activeChat]);

    const addErrorToActiveChat = (message) => {
        if (!activeChat) return;
        const updated = chats.map(chat => chat.id === activeChat.id ? {
            ...chat,
            logs: [...chat.logs, { id: generateId(), sender: "error", message, timestamp: new Date().toISOString() }],
            lastMessaged: new Date().toISOString()
        } : chat);
        setChats(updated);
        setActiveChat(updated.find(c => c.id === activeChat.id));
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (botThinking.includes(activeChat?.id)) addErrorToActiveChat("Page was refreshed or closed.");
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [activeChat, chats]);

    useEffect(() => {
        const handleError = (event) => addErrorToActiveChat(`Runtime error: ${event.message}`);
        window.addEventListener("error", handleError);
        return () => window.removeEventListener("error", handleError);
    }, [activeChat, chats]);

    // ---------- Chat operations ----------
    const createNewChat = (firstMessage = null, userMessage) => {
        if (chats.length >= maxAmountOfChats) {
            alert(`You cannot create more than ${maxAmountOfChats} chats.`);
            return null;
        }

        const now = new Date();
        const randomIntro = rudeIntros[Math.floor(Math.random() * rudeIntros.length)];

        const newChat = {
            id: now.getTime().toString(),
            title: `Chat ${chats.length + 1}`,
            createdAt: now.toISOString(),
            lastMessaged: now.toISOString(),
            logs: [
                { id: generateId(), sender: "bot", message: firstMessage || randomIntro, timestamp: now.toISOString() },
                ...(userMessage ? [{ id: generateId(), sender: "user", message: userMessage, timestamp: now.toISOString() }] : [])
            ]
        };

        setChats(prev => [...prev, newChat]);
        if (!userMessage) setTypingLogIds(prev => [...prev, newChat.logs[0].id]);
        setActiveChat(newChat);

        if (userMessage) fetchBotResponse(newChat);
        return newChat;
    };

    const addMessageToActiveChat = (message) => {
        if (!activeChat) return createNewChat(null, message);

        const userReplies = activeChat.logs.filter(l => l.sender === "user").length;
        const isFinalReply = userReplies + 1 >= maxAmountOfReplies; // +1 because we're adding this message

        const updatedChats = chats.map(chat => chat.id === activeChat.id ? {
            ...chat,
            logs: [
                ...chat.logs,
                { id: generateId(), sender: "user", message, timestamp: new Date().toISOString() }
            ],
            lastMessaged: new Date().toISOString()
        } : chat);

        setChats(updatedChats);
        const currentChat = updatedChats.find(c => c.id === activeChat.id);
        setActiveChat(currentChat);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedChats));

        fetchBotResponse(currentChat, isFinalReply); 
    };

    // ---------- Bot response ----------
    const fetchBotResponse = async (chatForResponse, finalMessage = false) => {
        if (!chatForResponse) return;

        try {
            setBotThinking(prev => [...prev, chatForResponse.id]);

            const userLastMessage =
                chatForResponse.logs[chatForResponse.logs.length - 1].message;
            const storedOptions = localStorage.getItem("options");
            const options = storedOptions ? JSON.parse(storedOptions) : defaultOptions;

            const res = await fetch(`${process.env.REACT_APP_BOT_API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userLastMessage, settings: options }),
            });

            if (!res.ok) throw new Error("Failed to get response from bot");

            const data = await res.json();
            const botReply = data.response;

            setChats(prevChats => {
                const updated = prevChats.map(chat => {
                    if (chat.id === chatForResponse.id) {
                        const newLogs = [
                            ...chat.logs,
                            {
                                id: generateId(),
                                sender: "bot",
                                message: botReply,
                                timestamp: new Date().toISOString()
                            }
                        ];
                        return { ...chat, logs: newLogs, lastMessaged: new Date().toISOString() };
                    }
                    return chat;
                });

                const updatedChat = updated.find(c => c.id === chatForResponse.id);
                setActiveChat(updatedChat);
                setTypingLogIds(prev => [
                    ...prev,
                    updatedChat.logs.slice(-1)[0].id
                ]); 
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });

            if (finalMessage) {
                const typingMessageId = chatForResponse.logs.slice(-1)[0].id;

                const checkTypingFinished = setInterval(() => {
                    if (!typingLogIds.includes(typingMessageId)) {
                        clearInterval(checkTypingFinished);

                        setTimeout(() => {
                            setChats(prevChats => {
                                const updated = prevChats.map(chat => {
                                    if (chat.id === chatForResponse.id) {
                                        const newLogs = [
                                            ...chat.logs,
                                            {
                                                id: generateId(),
                                                sender: "terminate",
                                                message: "End of chat",
                                                timestamp: new Date().toISOString()
                                            }
                                        ];
                                        return {
                                            ...chat,
                                            logs: newLogs,
                                            finished: true,
                                            lastMessaged: new Date().toISOString()
                                        };
                                    }
                                    return chat;
                                });
                                const updatedChat = updated.find(
                                    c => c.id === chatForResponse.id
                                );
                                setActiveChat(updatedChat);
                                localStorage.setItem(
                                    LOCAL_STORAGE_KEY,
                                    JSON.stringify(updated)
                                );
                                return updated;
                            });
                        }, 2000); // 2 second delay
                    }
                }, 100);
            }
        } catch (err) {
            console.error(err);

            setChats(prevChats => {
                const updated = prevChats.map(chat => {
                    if (chat.id === chatForResponse.id) {
                        const newLogs = [
                            ...chat.logs,
                            {
                                id: generateId(),
                                sender: "error", 
                                message: "Bot failed to reply. Please try again.",
                                timestamp: new Date().toISOString()
                            }
                        ];
                        return { ...chat, logs: newLogs, lastMessaged: new Date().toISOString() };
                    }
                    return chat;
                });

                const updatedChat = updated.find(c => c.id === chatForResponse.id);
                setActiveChat(updatedChat);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        } finally {
            setBotThinking(prev => prev.filter(id => id !== chatForResponse.id));
        }
    };

    // ---------- Other operations ----------
    const clearChats = () => {
        setChats([]);
        setActiveChat(null);
        setBotThinking([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LAST_ACTIVE_CHAT_KEY);
    };

    const deleteChat = (chatId) => {
        if (!window.confirm("Are you sure you want to delete this chat?")) return;
        setChats(prev => prev.filter(chat => chat.id !== chatId));
        if (activeChat?.id === chatId) setActiveChat(chats.find(c => c.id !== chatId) || null);
    };

    const setActiveChatById = (id) => {
        setActiveChat(id ? chats.find(c => c.id === id) : null);
    };

    return (
        <ChatContext.Provider value={{
            chats,
            setChats,
            activeChat,
            setActiveChatById,
            addMessageToActiveChat,
            botThinking,
            createNewChat,
            deleteChat,
            clearChats,
            addErrorToActiveChat,
            typingLogIds,
            setTypingLogIds,
            maxAmountOfChats,
            maxAmountOfReplies,
            fetchBotResponse
        }}>
            {children}
        </ChatContext.Provider>
    );
};
