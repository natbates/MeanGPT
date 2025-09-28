
export const defaultOptions = {
  model: "gemini-2.5-pro",
  mean_level: 5,
  reply_length: "short",
  reply_speed: 3
};

export const maxAmountOfChats = 5;

export const maxAmountOfReplies = 20;

export const rudeIntros = [
    "Oh great, another human. This better be good.",
    "Back again? I was just enjoying the silence.",
    "What do you want this time?",
    "I guess I have to listen to you again.",
    "Sigh… let’s get this over with.",
    "Didn’t I roast you enough last time?"
];

export const defaultInsults = [
    "You're as sharp as a marble.",
    "I would agree with you but then we’d both be wrong.",
    "You're the human version of a typo.",
    "Somewhere out there is a tree working hard to produce oxygen for you. You owe it.",
    "You're proof that even evolution takes a break sometimes."
];

export const defaultAdvice = [
    "Listen to me: ask clear questions if you want a sharp reply.",
    "Don’t take it personally — I love sarcasm more than you love compliments.",
    "Keep your sentences short. I get bored if you ramble.",
    "Use me to practice comebacks, but I won’t go easy on you!",
    "If I freeze, refresh the page. I’ll be back in action.",
    "Mix humor with curiosity, and I’ll show you my full MeanGPT magic.",
    "Want me meaner? Crank up the 'Mean Level' in settings — I bite harder with higher levels.",
    "Make replies longer if you want a full-on roasting essay instead of a punchy one-liner.",
    "Adjust my 'Creativity' slider — higher means wilder, more unpredictable comebacks.",
    "Play with the 'Reply Speed' — slower for dramatic effect, faster if you want instant burns."
];

export const blogPosts = [
    {
        date: "2025-09-20",
        title: "New Chat Features",
        text: "We've added typing animations and improved bot response handling. Users can now see messages being typed out letter by letter, giving a more realistic conversation experience. Additionally, error handling has been improved so that if the bot fails to respond, the user receives a clear notification and can retry the request. We've also optimized the chat log rendering to handle long conversations more efficiently without affecting performance."
    },
    {
        date: "2025-09-15",
        title: "UI Improvements",
        text: "Redesigned the navbar and mobile layout for better usability. Navigation buttons now highlight correctly and collapse neatly on smaller screens. The chat history panel was updated to include timestamps and smoother animations when switching chats. We also introduced subtle hover effects for buttons and messages to improve the overall user experience, making the interface more intuitive and modern."
    },
    {
        date: "2025-09-01",
        title: "Launch Notes",
        text: "Initial release of the chat application with core functionality. Users can start new chats, send messages, and receive responses from the bot. The application includes basic settings and a simple navigation bar. This release serves as the foundation for upcoming features like advanced AI responses, richer UI interactions, and mobile optimization."
    }
];
