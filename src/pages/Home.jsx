import { useNavigate } from "react-router-dom";
import { LAST_ACTIVE_CHAT_KEY } from "../contexts/ChatContext";
import "../styles/home.css";
import { useContext } from "react";
import { ChatContext } from "../contexts/ChatContext";

const Home = () =>
{
    const navigate = useNavigate();
    const {setActiveChatById} = useContext(ChatContext);

    return(
        <div id="home" className="page">
            <div className="home-text">
                <div className="home-title">
                    <h1>MeanGPT</h1>
                    <h2>The AI companionthat roasts you</h2>
                </div>
                <p>Read my dev blog <a href="/dev-blog">here</a>.</p>
                <button onClick={() => {
                    localStorage.removeItem(LAST_ACTIVE_CHAT_KEY);
                    navigate("/chat");
                    setActiveChatById(null);
                }}>Get Bullied</button>
            </div>
            <button className="share-button">Share</button>
        </div>
    )
}

export default Home;