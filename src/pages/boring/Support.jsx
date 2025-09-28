const Support = () => {
  return (
    <div id="support" className="page">
      <h1>Support</h1>
      <p>If you have any questions, issues or ideas, please fill out the form below and we will get back to you.</p>

      <form
        action="https://formspree.io/f/xovkjkqe"
        method="POST"
        className="support-form"
      >
        <label>
          Name:
          <input type="text" name="name" placeholder="Your Name" required />
        </label>

        <label>
          Email:
          <input type="email" name="email" placeholder="Your Email" required />
        </label>

        <label>
          Message:
          <textarea name="message" placeholder="Your message..." required />
        </label>
        
        <div className="button-container">
            <button type="submit">Clear</button>
            <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Support;
