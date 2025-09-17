import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "./chat-components/ChatHistory";
import { ChatContext } from "../contexts/ChatContext";
import "../styles/nav.css";

const NavBar = () => {
    const navigate = useNavigate();
    const { createNewChat, clearChats } = useContext(ChatContext);

    const handleClearChats = () => {
        if (window.confirm("Are you sure you want to clear all chats? This action cannot be undone.")) {
            clearChats();
        }
    };

    return (
        <nav className="nav-bar">
            <div className="nav-bar-top">
                <button className="nav-button" onClick={() => navigate("/")}>
                    <span className="nav-icon" role="img" aria-label="home"></span>
                    <span className="nav-text">Home</span>
                </button>
                <button className="nav-button" onClick={() => createNewChat("hello")}>
                    <span className="nav-icon" role="img" aria-label="new"></span>
                    <span className="nav-text">New Chat</span>
                </button>
                <button className="nav-button" onClick={() => alert("Search Chats clicked!")}>
                    <span className="nav-icon" role="img" aria-label="search"></span>
                    <span className="nav-text">Search Chats</span>
                </button>

                <ChatHistory />
            </div>

            <div className="nav-bar-bottom">
                <span className="nav-text">Settings</span>
                <span onClick={handleClearChats} className="nav-text">Clear Chats</span>
            </div>
        </nav>
    );
};

export default NavBar;
