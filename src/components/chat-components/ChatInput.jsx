import { useState, forwardRef, useImperativeHandle, useRef, useContext, useEffect } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";

const ChatInput = forwardRef(({ isBotOnline }, ref) => {
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

            const isBotThinking =
                activeChat && botThinking.includes(activeChat.id);

            // Only allow sending if bot is online and not thinking
            if (!isBotThinking && isBotOnline && input.trim() !== "") {
                if (!activeChat) {
                    createNewChat("Hey there! How can I assist you today?", input.trim());
                } else {
                    addMessageToActiveChat(input.trim());
                }
                setInput("");
            }
        }
    };

    const isBotThinkingInActiveChat =
        activeChat && botThinking.includes(activeChat.id);

    useEffect(() => {
        if (!isBotThinkingInActiveChat && isBotOnline) {
            inputRef.current?.focus();
        }
    }, [isBotThinkingInActiveChat, isBotOnline]);

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
                disabled={isBotThinkingInActiveChat || !isBotOnline}
                placeholder={
                    !isBotOnline
                        ? "Bot is offline..."
                        : isBotThinkingInActiveChat
                        ? "Bot is thinking..."
                        : "Type your message... "
                }
            />
        </div>
    );
});

export default ChatInput;
