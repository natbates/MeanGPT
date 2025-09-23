import React, { createContext, useState, useEffect } from "react";
export const LOCAL_STORAGE_KEY = "meangpt_chats";
export const LAST_ACTIVE_CHAT_KEY = "last_active_chat_id";

const getInitialChats = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return [];
};

const generateId = () => {
    return crypto.randomUUID(); 
};

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(getInitialChats);
    const [activeChat, setActiveChat] = useState(null);
    const [botThinking, setBotThinking] = useState([]); // array of chat IDs where bot is thinking
    const [typingLogIds, setTypingLogIds] = useState([]); // array of log IDs that are currently being typed

    // Restore last active chat on mount
    useEffect(() => {
        const lastActiveId = localStorage.getItem(LAST_ACTIVE_CHAT_KEY);
        if (!activeChat && chats.length > 0)
        {
            if (lastActiveId) {
                const chat = chats.find(c => c.id === lastActiveId);
                if (chat) setActiveChat(chat);
            } else if (chats.length > 0) {
                setActiveChat(chats[0]);
            }
        }
    }, [chats]);

    // Persist chats to localStorage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
    }, [chats]);

    // Persist last active chat ID
    useEffect(() => {
        if (activeChat) {
            localStorage.setItem(LAST_ACTIVE_CHAT_KEY, activeChat.id);
        }
    }, [activeChat]);

    // ---------- ERROR LOGGING ----------
    const addErrorToActiveChat = (message) => {
        if (!activeChat) return;
        const updated = chats.map(chat => {
            if (chat.id === activeChat.id) {
                return {
                    ...chat,
                    logs: [
                        ...chat.logs,
                        {
                            id: generateId(),
                            sender: "error",
                            message,
                            timestamp: new Date().toISOString()
                        }
                    ],
                    lastMessaged: new Date().toISOString()
                };
            }
            return chat;
        });
        setChats(updated);
        setActiveChat(updated.find(c => c.id === activeChat.id));
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (botThinking.includes(activeChat?.id)) {
                addErrorToActiveChat("Page was refreshed or closed.");
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [activeChat, chats]);

    useEffect(() => {
        const handleError = (event) => {
            addErrorToActiveChat(`Runtime error: ${event.message}`);
        };
        window.addEventListener("error", handleError);
        return () => window.removeEventListener("error", handleError);
    }, [activeChat, chats]);
    // -----------------------------------

    const createNewChat = (firstMessage, userMessage) => {
        const now = new Date();
        const newChat = {
            id: now.getTime().toString(),
            title: `Chat ${chats.length + 1}`,
            createdAt: now.toISOString(),
            lastMessaged: now.toISOString(),
            logs: [
                {
                    id: generateId(),
                    sender: "bot",
                    message: firstMessage,
                    timestamp: now.toISOString()
                },
                ...(userMessage ? [{
                    id: generateId(),
                    sender: "user",
                    message: userMessage,
                    timestamp: now.toISOString()
                }] : [])
            ]
        };

        console.log("Before activeChat set:", activeChat);
        setChats(prev => [...prev, newChat]);
        if (!userMessage) {
            setTypingLogIds(prev => [...prev, newChat.logs[0].id]);
        }
        setActiveChat(newChat);
        console.log("New chat created:", newChat.id);

        if (userMessage) fetchBotResponse(newChat);

        return newChat;
    };

    useEffect(() => {
        if (!activeChat && chats.length > 0) {
            setActiveChat(chats[chats.length - 1]);
        }
    }, [chats, activeChat]);


    const clearChats = () => {
        setChats([]);
        setActiveChat(null);
        setBotThinking([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LAST_ACTIVE_CHAT_KEY);
    };

    const deleteChat = (chatId) => {
        if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
            setChats(prev => prev.filter(chat => chat.id !== chatId));
            if (activeChat?.id === chatId) {
                const remainingChats = chats.filter(chat => chat.id !== chatId);
                setActiveChat(remainingChats.length > 0 ? remainingChats[0] : null);
            }
        }
    };

    const setActiveChatById = (id) => {

        if (id === null) {
            setActiveChat(null);
            return;
        }

        const chat = chats.find(c => c.id === id);
        if (chat) setActiveChat(chat);
    };

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
                            id: generateId(),
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
        fetchBotResponse(updatedChats.find(c => c.id === activeChat.id));
    };

    const fetchBotResponse = async (chatForResponse) => {
        try {
            // Mark bot as thinking after time out
            await new Promise(resolve => setTimeout(resolve, 1000));

            setBotThinking(prev => [...prev, chatForResponse.id]);

            // Send user's last message to your Flask backend
            const userLastMessage = chatForResponse.logs[chatForResponse.logs.length - 1].message;

            const res = await fetch(process.env.REACT_APP_BOT_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userLastMessage }),
            });

            if (!res.ok) {
                addErrorToActiveChat("Failed to get response from bot");
                throw new Error("Failed to get response from bot");
            }

            const data = await res.json();
            const response = data.response; // bot's reply from backend

            // Update chat state with bot response
            setChats(prevChats => {
                const updated = prevChats.map(chat => {
                    if (chat.id === chatForResponse.id) {
                        return {
                            ...chat,
                            logs: [
                                ...chat.logs,
                                {
                                    id: generateId(),
                                    sender: "bot",
                                    message: response,
                                    timestamp: new Date().toISOString()
                                }
                            ],
                            lastMessaged: new Date().toISOString()
                        };
                    }
                    return chat;
                });

                // Update active chat
                const updatedChat = updated.find(c => c.id === chatForResponse.id);
                setActiveChat(updatedChat);

                // Add last bot message ID to typing logs
                const newLastLogId = updatedChat.logs[updatedChat.logs.length - 1].id;
                setTypingLogIds(prev => [...prev, newLastLogId]);

                return updated;
            });

        } catch (error) {
            console.error("Error fetching bot response:", error);
        } finally {
            // Remove bot thinking state
            setBotThinking(prev => prev.filter(id => id !== chatForResponse.id));
        }
    };


    return (
        <ChatContext.Provider value={{
            chats,
            activeChat,
            setActiveChatById,
            addMessageToActiveChat,
            botThinking,
            createNewChat,
            deleteChat,
            clearChats,
            addErrorToActiveChat,
            typingLogIds,
            setTypingLogIds
        }}>
            {children}
        </ChatContext.Provider>
    );
};
