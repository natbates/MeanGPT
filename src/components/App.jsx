
import "../styles/app.css";

import NavBar from "./Navbar";
import Footer from "./Footer";

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Chat from "../pages/Chat";
import DevBlog from "../pages/DevBlog";

import Support from "../pages/boring/Support";
import Settings from "../pages/boring/Settings";
import Terms from "../pages/boring/Terms";

import "../styles/mobile.css";

const App = () => {

    return (
        <div className="page-container">
            <p className="version">Version 1.0.0</p>
            <NavBar />
            <div className="page-wrapper">
                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/dev-blog" element={<DevBlog />} />

                        <Route path="/support" element={<Support />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/terms" element={<Terms />} />

                        <Route path="/*" element={<h1>404</h1>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default App;