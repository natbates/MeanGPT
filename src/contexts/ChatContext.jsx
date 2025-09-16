

import React, { createContext, useState } from "react";

const mockChats = [
    {
        id: "2342352342312",
        createdAt: "2025-09-15T10:00:00Z",
        lastMessaged: "2025-09-15T10:05:00Z",
        logs: [
            { sender: "user", message: "Hello!", timestamp: "2025-09-15T10:00:00Z" },
            { sender: "bot", message: "Hi! How can I help you today?", timestamp: "2025-09-15T10:00:10Z" },
            { sender: "user", message: "I'm feeling stressed.", timestamp: "2025-09-15T10:01:00Z" },
            { sender: "bot", message: "I'm here to listen. Want to talk about it?", timestamp: "2025-09-15T10:01:30Z" }
        ]
    },
    {
        id: "598236478263",
        createdAt: "2025-09-16T08:30:00Z",
        lastMessaged: "2025-09-16T08:32:00Z",
        logs: [
            { sender: "user", message: "Good morning!", timestamp: "2025-09-16T08:30:00Z" },
            { sender: "bot", message: "Good morning! How are you feeling today?", timestamp: "2025-09-16T08:30:05Z" },
            { sender: "user", message: "Pretty good, thanks.", timestamp: "2025-09-16T08:32:00Z" }
        ]
    }
];

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [chats, setChats] = useState(mockChats);
    const [activeChat, setActiveChat] = useState(mockChats[0]);

    const AddUserInput = ({input}) =>
    {

    }

    return (
        <ChatContext.Provider value={{ activeChat, setActiveChat, AddUserInput }}>
            {children}
        </ChatContext.Provider>
    );
};