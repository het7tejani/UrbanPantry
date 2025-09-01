import React, { useState, useEffect, useRef } from 'react';
import { askChatbot } from '../api';

const Chatbot = ({ navigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                sender: 'ai',
                text: "Hi! I'm PantryPal. How can I help you find the perfect item for your home today? You can ask me for recommendations, gift ideas, and more!",
                products: [],
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: newMessage.trim() };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);
        
        try {
            // Pass only the text part of the history to the API
            const history = messages.map(msg => ({ sender: msg.sender, text: msg.text }));
            const response = await askChatbot(userMessage.text, history);
            const aiMessage = {
                sender: 'ai',
                text: response.text,
                products: response.products || [],
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage = {
                sender: 'ai',
                text: error.message || 'Sorry, something went wrong. Please try again.',
                products: []
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleProductClick = (productId) => {
        setIsOpen(false);
        navigate(`/products/${productId}`);
    };

    return (
        <>
            <button className="chatbot-fab" onClick={() => setIsOpen(true)} aria-label="Open PantryPal Assistant">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
            </button>

            <div className={`chat-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
            
            <div className={`chat-window ${isOpen ? 'open' : ''}`}>
                <header className="chat-header">
                    <h3>PantryPal Assistant</h3>
                    <button className="close-button" onClick={() => setIsOpen(false)}>&times;</button>
                </header>
                <div className="chat-body" ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}-message`}>
                            {msg.text}
                            {msg.products && msg.products.length > 0 && (
                                <div className="chat-product-list">
                                    {msg.products.map(product => (
                                        <div key={product._id} className="chat-product-card" onClick={() => handleProductClick(product._id)}>
                                            <img src={product.image} alt={product.name} />
                                            <div className="chat-product-card-info">
                                                <h4>{product.name}</h4>
                                                <p>${product.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message ai-message">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>
                <footer className="chat-footer">
                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ask me anything..."
                            aria-label="Your message"
                            disabled={isLoading}
                        />
                        <button type="submit" aria-label="Send message" disabled={isLoading || !newMessage.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </form>
                </footer>
            </div>
        </>
    );
};

export default Chatbot;
