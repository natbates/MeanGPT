import { useRef } from "react";
import "../styles/chat.css";
import ChatContent from "../components/chat-components/ChatContent";
import ChatInformation from "../components/chat-components/ChatInformation";
import ChatInput from "../components/chat-components/ChatInput";

const Chat = () => {
    const inputRef = useRef(null);

    return (
        <div className="chat-container">
            <ChatInformation />
            <ChatContent onContentClick={() => inputRef.current && inputRef.current.focus()} />
            <ChatInput ref={inputRef} />
        </div>
    );
};

export default Chat;