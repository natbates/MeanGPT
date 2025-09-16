import React from "react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "./chat-components/ChatHistory";
import "../styles/nav.css";

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <nav className="nav-bar">
            <button className="nav-button" onClick={() => {navigate("/")}}>
                <span className="nav-icon" role="img" aria-label="home"></span>
                <span className="nav-text">Home</span>
            </button>
            <button className="nav-button" onClick={() => alert("New Chat clicked!")}>
                <span className="nav-icon" role="img" aria-label="new"></span>
                <span className="nav-text">New Chat</span>
            </button>
            <button className="nav-button" onClick={() => alert("Search Chats clicked!")}>
                <span className="nav-icon" role="img" aria-label="search"></span>
                <span className="nav-text">Search Chats</span>
            </button>
            <ChatHistory />
        </nav>
    );
};

export default NavBar;