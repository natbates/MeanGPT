import "../styles/chat.css";

import ChatContent from "../components/chat-components/ChatContent";
import ChatInformation from "../components/chat-components/ChatInformation";
import ChatInput from "../components/chat-components/ChatInput";
import ChatHistory from "../components/chat-components/ChatHistory";

const Chat = () => {
    
    return(
        <div className="chat-container">
            <ChatInformation />
            <ChatHistory />
            <ChatContent />
            <ChatInput />
        </div>
    )
}

export default Chat;