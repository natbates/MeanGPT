import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "./chat-components/ChatHistory";
import { ChatContext } from "../contexts/ChatContext";
import "../styles/nav.css";

// Define your nav items as an array of objects
const navItems = (navigate, createNewChat, alertSearch) => [
    {
        key: "home",
        title: "Home",
        name: "Home",
        imgUrl: "/images/icons/face-icon.png", // replace with your actual image URL
        onClick: () => navigate("/")
    },
    {
        key: "newChat",
        title: "New Chat",
        name: "New Chat",
        imgUrl: "/images/icons/new-chat.png",
        onClick: () => {navigate("/chat"); createNewChat("hello");}
    },
    {
        key: "help",
        title: "Help",
        name: "Help",
        imgUrl: "/images/icons/help.png",
        onClick: () => navigate("/support")
    }
];

const NavBar = () => {
    const navigate = useNavigate();
    const { createNewChat, clearChats } = useContext(ChatContext);

    const handleClearChats = () => {
        if (
            window.confirm(
                "Are you sure you want to clear all chats? This action cannot be undone."
            )
        ) {
            clearChats();
        }
    };

    const handleSearch = () => {
        alert("Search Chats clicked!");
    };

    return (
        <nav className="nav-bar">
            <div className="nav-bar-top">
                {navItems(navigate, createNewChat, handleSearch).map((item) => (
                    <button
                        key={item.key}
                        className="nav-button"
                        onClick={item.onClick}
                    >
                        <img
                            src={item.imgUrl}
                            alt={item.title}
                            className="nav-icon"
                        />
                        <span className="nav-text">{item.name}</span>
                    </button>
                ))}

                <ChatHistory />
            </div>

            <div className="nav-bar-bottom">
                <span className="nav-text" onClick={() => navigate("/settings")}>Settings</span>
                <span onClick={handleClearChats} className="nav-text">
                    Clear Chats
                </span>
            </div>
        </nav>
    );
};

export default NavBar;
