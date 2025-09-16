import { useState } from "react"

import "../../styles/chat.css"

const ChatInput = () =>
{
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    return(
        <div id="chat-input">
            <input 
                className="text-input" 
                value={input}
                onChange={(e) => {setInput(e.target.value)}}
                disabled={loading}
            />
            <button
                className="submission-button"
                disabled={loading}
                onClick={() => {
                    setInput("");
                }}
            >Submit</button>
        </div>
    )
}

export default ChatInput;