import { useState, forwardRef, useImperativeHandle, useRef, useContext, useEffect } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatInput = forwardRef((props, ref) => {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);
    const { addMessageToActiveChat, botThinking } = useContext(ChatContext);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current && inputRef.current.focus();
        }
    }));

    // Auto-grow textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!botThinking && input.trim() !== "") {
                addMessageToActiveChat(input.trim());
                setInput("");
            }
        }
    };

    return (
        <div id="chat-input">
            <textarea
                ref={inputRef}
                className="text-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                maxLength={255}
                disabled={botThinking}
                placeholder={botThinking ? "Bot is thinking..." : "Type your message..."}
            />
        </div>
    );
});

export default ChatInput;