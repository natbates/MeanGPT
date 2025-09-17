import { useState, forwardRef, useImperativeHandle, useRef, useContext, useEffect } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatInput = forwardRef((props, ref) => {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    const { activeChat, addMessageToActiveChat, botThinking, createNewChat } =
        useContext(ChatContext);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
    }));

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            // Determine if the bot is currently thinking in THIS active chat
            const isBotThinking =
                activeChat && botThinking.includes(activeChat.id);

            if (!isBotThinking && input.trim() !== "") {
                if (!activeChat) {
                    // No active chat yet: create a new one with bot greeting and first user message
                    createNewChat("Hey there! How can I assist you today?", input.trim());
                } else {
                    // Add the user message to the existing active chat
                    addMessageToActiveChat(input.trim());
                }
                setInput("");
            }
        }
    };

    const isBotThinkingInActiveChat =
        activeChat && botThinking.includes(activeChat.id);

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
                disabled={isBotThinkingInActiveChat}
                placeholder={
                    isBotThinkingInActiveChat
                        ? "Bot is thinking..."
                        : "Type your message..."
                }
            />
        </div>
    );
});

export default ChatInput;
