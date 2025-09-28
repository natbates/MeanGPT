import { useRef, useState, useEffect } from "react";
import "../styles/chat.css";
import ChatContent from "../components/chat-components/ChatContent";
import ChatInformation from "../components/chat-components/ChatInformation";
import ChatInput from "../components/chat-components/ChatInput";
import { rudeIntros } from "../utils/default";

const Chat = () => {
    const inputRef = useRef(null);

    const [isServiceOnline, setIsServiceOnline] = useState(true);
    const [firstMessageForUnselected, setFirstMessageForUnselected] = useState(rudeIntros[Math.floor(Math.random() * rudeIntros.length)]);

    useEffect(() => {
        const checkService = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BOT_API_URL}/ping`);
                if (res.ok) setIsServiceOnline(true);
                else setIsServiceOnline(false);
            } catch {
                setIsServiceOnline(false);
            }
        };

        checkService();
        const interval = setInterval(checkService, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="chat-container">
            <ChatInformation isBotOnline={isServiceOnline} />
            <ChatContent onContentClick={() => inputRef.current && inputRef.current.focus()} firstMessageForUnselected={firstMessageForUnselected}/>
            <ChatInput ref={inputRef} isBotOnline={isServiceOnline} firstMessageForUnselected={firstMessageForUnselected}/>
        </div>
    );
};

export default Chat;