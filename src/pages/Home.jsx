import { useEffect, useState, useRef, useContext } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { LAST_ACTIVE_CHAT_KEY } from "../contexts/ChatContext";
import "../styles/home.css";
import { ChatContext } from "../contexts/ChatContext";
import { defaultAdvice, defaultInsults } from "../utils/default";

const talkingImages = ["/images/mr_meanie/face-1.png", "/images/mr_meanie/face-2.png"];

const MrMeanieBot = ({
    mode = "insult",
    typingSpeed = 50,
    pauseAfter = 4000,
    reverse = false,
    initialDelay = 0,
}) => {
    const lines = mode === "insult" ? defaultInsults : defaultAdvice;

    const [currentLine, setCurrentLine] = useState("");
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isTyping, setIsTyping] = useState(false);
    const [talkingFrame, setTalkingFrame] = useState(0);

    const typingTimeoutRef = useRef(null);
    const nextLineTimeoutRef = useRef(null);
    const talkingIntervalRef = useRef(null);

    const getNextLineIndex = () => {
        let next;
        do {
            next = Math.floor(Math.random() * lines.length);
        } while (next === currentIndex && lines.length > 1);
        return next;
    };

    const typeLine = (line) => {
        setIsTyping(true);
        let charIndex = 0;

        talkingIntervalRef.current = setInterval(() => {
            setTalkingFrame(prev => (prev + 1) % talkingImages.length);
        }, 200);

        const typeChar = () => {
            if (charIndex <= line.length) {
                setCurrentLine(line.slice(0, charIndex));
                charIndex++;
                typingTimeoutRef.current = setTimeout(typeChar, typingSpeed);
            } else {
                clearInterval(talkingIntervalRef.current);
                setIsTyping(false);

                nextLineTimeoutRef.current = setTimeout(() => {
                    const nextIndex = getNextLineIndex();
                    setCurrentIndex(nextIndex);
                    typeLine(lines[nextIndex]);
                }, pauseAfter);
            }
        };

        typeChar();
    };

    useEffect(() => {
        const startBot = () => {
            const firstIndex = getNextLineIndex();
            setCurrentIndex(firstIndex);
            typeLine(lines[firstIndex]);
        };

        const delayTimer = setTimeout(startBot, initialDelay); 

        return () => {
            clearTimeout(delayTimer);
            clearTimeout(typingTimeoutRef.current);
            clearTimeout(nextLineTimeoutRef.current);
            clearInterval(talkingIntervalRef.current);
        };
    }, []);

    return (
        <div className={`mr-meanie-insult ${reverse && 'reverse'}`}>
            <div className="mr-meanie">
                <img
                    src={isTyping ? talkingImages[talkingFrame] : talkingImages[0]}
                    alt={mode}
                    className="mr-meanie"
                />
            </div>
            <div className="insult-box">
                <p className="insult-text">{currentLine}&nbsp;</p>
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const { setActiveChatById } = useContext(ChatContext);

    return (
        <div id="home" className="page">
            <div className="home-text">
                <div className="home-title">
                    <h1>MeanGPT</h1>
                    <h2>The unsympathetic chatbot that doesn’t sugarcoat anything — insults and rude replies only!</h2>
                </div>

                <div className="bots-container">
                    <MrMeanieBot mode="insult" />
                    <MrMeanieBot mode="advice" reverse={true} initialDelay={2000} />
                </div>

                <div className="button-container home-buttons">
                    <button
                        className="share-button"
                        onClick={async () => {
                            const shareData = {
                            title: "MeanGPT",
                            text: "Check out MeanGPT! Get roasted or get advice from our chatbots!",
                            url: window.location.href,
                            };

                            if (navigator.share) {
                            try {
                                await navigator.share(shareData);
                                console.log("Content shared successfully");
                            } catch (err) {
                                console.error("Error sharing:", err);
                            }
                            } else {
                            try {
                                await navigator.clipboard.writeText(shareData.url);
                                alert("Link copied to clipboard!");
                            } catch (err) {
                                alert("Could not copy link. Please copy manually.");
                            }
                            }
                        }}
                        >
                        Share
                        </button>
                    <button onClick={() => {
                        setActiveChatById(null);
                        localStorage.removeItem(LAST_ACTIVE_CHAT_KEY);
                        navigate("/chat");
                    }}>Get Bullied</button>
                </div>
                <p className="dev-blog">If you are interested you can read my dev blog <a href="/dev-blog">here</a>.</p>
            </div>
        </div>
    );
};

export default Home;