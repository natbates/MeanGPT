import "../styles/footer.css";

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>
                © {year} MeanGPT  
                <span className="footer-extra">
                    &nbsp;| Not affiliated with OpenAI&nbsp;|&nbsp; 
                    <a href="/terms" style={{ color: "#90caf9" }}>Please read TOC</a>
                </span>
            </p>
        </footer>
    );
};

export default Footer;
