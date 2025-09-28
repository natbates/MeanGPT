import { useState, forwardRef, useImperativeHandle, useRef, useContext, useEffect } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import "../../styles/chat.css";
import { maxAmountOfChats, maxAmountOfReplies } from "../../utils/default";

const ChatInput = forwardRef(({ isBotOnline, firstMessageForUnselected}, ref) => {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    const { chats, activeChat, addMessageToActiveChat, botThinking, createNewChat } =
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

    const handleSend = () => {
        if (!input.trim()) return;

        const isBotThinking =
            activeChat && botThinking.includes(activeChat.id);

        if (!isBotThinking && isBotOnline) {
            if (!activeChat) {
            createNewChat(firstMessageForUnselected, input.trim());
            } else {
            addMessageToActiveChat(input.trim());
            }
            setInput("");
        }
    };

    const isBotThinkingInActiveChat =
        activeChat && botThinking.includes(activeChat.id);

    useEffect(() => {
        if (!isBotThinkingInActiveChat && isBotOnline) {
            inputRef.current?.focus();
        }
    }, [isBotThinkingInActiveChat, isBotOnline]);
    

    if (activeChat?.finished && !botThinking.includes(activeChat.id)) {return;}

    if (!activeChat && chats.length >= maxAmountOfChats){return;}

    return (
    <div id="chat-input">
        <form
            onSubmit={(e) => {
            e.preventDefault();
            handleSend();
            }}
        >
            <textarea
            ref={inputRef}
            className="text-input"
            type="text"
            value={isBotThinkingInActiveChat ? "" : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
                }
            }}
            maxLength={255}
            disabled={isBotThinkingInActiveChat || !isBotOnline || activeChat?.finsihed}
            placeholder={
                !isBotOnline
                ? "Bot is offline..."
                : isBotThinkingInActiveChat
                ? "Bot is thinking..."
                : "Type your message..."
            }
            />
        </form>
    </div>
    );
});

export default ChatInput;
