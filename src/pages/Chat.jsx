import { useRef, useState, useEffect } from "react";
import "../styles/chat.css";
import ChatContent from "../components/chat-components/ChatContent";
import ChatInformation from "../components/chat-components/ChatInformation";
import ChatInput from "../components/chat-components/ChatInput";

const Chat = () => {
    const inputRef = useRef(null);

    const [isServiceOnline, setIsServiceOnline] = useState(true);

    useEffect(() => {
            const checkService = async () => {
                try {
                    const res = await fetch(process.env.REACT_APP_BOT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "ping" }) });
                    if (res.ok) setIsServiceOnline(true);
                    else setIsServiceOnline(false);
                } catch {
                    setIsServiceOnline(false);
                }
            };
    
            // Initial check
            checkService();
    
            // Check every 10 seconds
            const interval = setInterval(checkService, 10000);
    
            return () => clearInterval(interval);
        }, []);

    return (
        <div className="chat-container">
            <ChatInformation isBotOnline={isServiceOnline} />
            <ChatContent onContentClick={() => inputRef.current && inputRef.current.focus()} />
            <ChatInput ref={inputRef} isBotOnline={isServiceOnline} />
        </div>
    );
};

export default Chat;