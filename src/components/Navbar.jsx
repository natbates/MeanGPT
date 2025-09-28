import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHistory from "./chat-components/ChatHistory";
import { ChatContext } from "../contexts/ChatContext";
import "../styles/nav.css";

const navItems = (navigate, createNewChat, setMobileOpen) => [
  {
    key: "home",
    title: "Home",
    name: "Home",
    imgUrl: "/images/icons/face-icon.png",
    onClick: (e) =>{e.stopPropagation(); setMobileOpen(false); navigate("/")},
    path: "/"
  },
  {
    key: "newChat",
    title: "New Chat",
    name: "New Chat",
    imgUrl: "/images/icons/new-chat.png",
    onClick: (e) => {
      e.stopPropagation();
      setMobileOpen(false);
      navigate("/chat");
      createNewChat(null, null);
    },
  },
  {
    key: "help",
    title: "Help",
    name: "Help",
    imgUrl: "/images/icons/help.png",
    onClick: (e) => {e.stopPropagation(); setMobileOpen(false); navigate("/support")},
    path: "/support"
  }
];

const NavBar = () => {
  const navigate = useNavigate();
  const { createNewChat, clearChats } = useContext(ChatContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  // ✅ Close menu when wider than 750 px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 750) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Click outside closes menu (only if currently open)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleClearChats = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all chats? This action cannot be undone."
      )
    ) {
      clearChats();
    }
  };

  // ✅ Only toggle mobile menu if viewport ≤ 750 px
  const handleNavClick = () => {
    if (window.innerWidth <= 750) {
      setMobileOpen(true);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`nav-bar ${mobileOpen ? "mobile-open" : ""}`}
      onClick={handleNavClick}
    >
      <div className="nav-content">
        <div className="nav-bar-top">
          <div className="nav-items">
            <div className="nav-items-spacer">
              {navItems(navigate, createNewChat, setMobileOpen).map((item) => {
                const isActive = window.location.pathname === item.path;
                return (
                  <button
                    key={item.key}
                    className={`nav-button ${isActive ? "active" : ""}`}
                    onClick={item.onClick}
                  >
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="nav-icon"
                    />
                    <span className="nav-text">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <ChatHistory mobileOpen={mobileOpen} />
        </div>

        <div className="nav-bar-bottom">
          <span className="nav-text" onClick={() => navigate("/terms")}>TOC</span>
          <span className="nav-text" onClick={() => navigate("/settings")}>Settings</span>
          <span onClick={handleClearChats} className="nav-text">
            Clear Chats
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
