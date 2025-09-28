import { blogPosts } from "../utils/default";
import { useState, useRef, useEffect } from "react";

const BlogSection = ({ date, title, text }) => {
    const [expanded, setExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState("0px");
    const contentRef = useRef(null);

    const toggleExpand = (e) => {
        e.preventDefault();
        setExpanded(prev => !prev);
    };

    useEffect(() => {
        if (contentRef.current) {
            setMaxHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
        }
    }, [expanded]);

    return (
        <section className="blog-section">
            <h2>{title}</h2>
            <small className="blog-date">{new Date(date).toLocaleDateString()}</small>
            <div
                ref={contentRef}
                className="blog-text"
                style={{
                    maxHeight: expanded ? maxHeight : "60px",
                    overflow: "hidden",
                    transition: "max-height 0.5s ease"
                }}
            >
                {text}
            </div>
            {text.length > 350 && (
                <a href="#" onClick={toggleExpand} className="read-more">
                    {expanded ? "Read Less" : "Read More"}
                </a>
            )}
        </section>
    );
};

const DevBlog = () => {
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div id="dev-blog" className="page">
            <h1>Dev Blog</h1>
            <p>Please check out my Portfolio website at <a href="https://nathanielbates.uk" target="_blank" rel="noreferrer">nathanielbates.uk</a></p>
            <div className="blogs">
                {sortedPosts.map((post, idx) => (
                    <BlogSection
                        key={idx}
                        date={post.date}
                        title={post.title}
                        text={post.text}
                    />
                ))}
            </div>
        </div>
    );
};

export default DevBlog;