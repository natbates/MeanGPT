
import "../styles/app.css";

import NavBar from "./Navbar";
import Footer from "./Footer";

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import DevBlog from "../pages/DevBlog";
import Support from "../pages/Support";

const App = () => {

    return (
        <div className="page-container">
            <NavBar />
            <div className="page-wrapper">
                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/dev-blog" element={<DevBlog />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/*" element={<h1>404</h1>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default App;