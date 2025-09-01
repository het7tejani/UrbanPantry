import React from 'react';

const NewsletterSignup = ({ navigate }) => {
    const [email, setEmail] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = email ? `/register?email=${encodeURIComponent(email)}` : '/register';
        navigate(url);
    };

    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <div className="newsletter-text">
                    <h2>Join the newsletter</h2>
                    <p>Get weekly curated designs straight to your inbox.</p>
                </div>
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <div className="newsletter-input-group">
                         <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-label="Email address"
                        />
                        <button type="submit">Notify me</button>
                    </div>
                    <p className="newsletter-disclaimer">No spam, ever! Unsubscribe any time.</p>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSignup;