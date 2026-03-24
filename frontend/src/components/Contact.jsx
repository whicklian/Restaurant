import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setFeedbackMsg('Please enter a valid email address.');
      setFeedbackType('error');
      return;
    }

    setIsLoading(true);
    setFeedbackMsg('');

    try {
      const res = await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      if (res.data.success) {
        setFeedbackMsg('🎉 Subscribed! Check your inbox for a welcome email.');
        setFeedbackType('success');
        setEmail('');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Subscription failed. Please try again.';
      setFeedbackMsg(msg);
      setFeedbackType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubscribe();
  };

  return (
    <>
      <section id="contact" className="container">
          <div className="contact">
              <div className="contact-info">
                  <h2>Visit Us</h2>
                  <div className="contact-item">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Oyugis, Homa Bay</span>
                  </div>
                  <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>0707848992</span>
                  </div>
                  <div className="contact-item">
                      <i className="fas fa-envelope"></i>
                      <span>reaganomondi@gmail.com</span>
                  </div>
                  <div className="contact-item">
                      <i className="fas fa-clock"></i>
                      <span>Mon-Thu: 11am - 10pm<br/>Fri-Sat: 11am - 11pm<br/>Sun: 12pm - 9pm</span>
                  </div>
              </div>
              <div className="map-container">
                  <iframe 
                      title="Google Maps"
                      src="https://maps.google.com/maps?q=Oyugis,%20Homa%20Bay&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed" 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      aria-hidden="false" 
                      tabIndex="0">
                  </iframe>
              </div>
          </div>
      </section>

      <section className="container">
          <div className="newsletter">
              <h2>Subscribe to Our Newsletter</h2>
              <p>Get special offers and updates about new menu items</p>
              <div className="newsletter-form">
                  <input 
                      type="email" 
                      placeholder="Your email address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                  />
                  <button onClick={handleSubscribe} disabled={isLoading}>
                      {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Subscribing...</> : 'Subscribe'}
                  </button>
              </div>
              {feedbackMsg && (
                  <p style={{
                      marginTop: '1rem',
                      color: feedbackType === 'success' ? '#25d366' : '#ff4444',
                      fontWeight: '500',
                      fontSize: '0.95rem'
                  }}>
                      {feedbackMsg}
                  </p>
              )}
          </div>
      </section>
    </>
  );
};

export default Contact;
