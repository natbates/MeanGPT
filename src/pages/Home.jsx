import { useNavigate } from "react-router-dom";

const Home = () =>
{
    const navigate = useNavigate();

    return(
        <div id="home" className="page">
            <h1>Home</h1>
            <button onClick={() => navigate("/chat")}>Go to chatting</button>
        </div>
    )
}

export default Home;