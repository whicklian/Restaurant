import React, { useState } from 'react';

const Contact = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      alert('Thanks for subscribing! Check your email for confirmation.');
      setEmail('');
    } else {
      alert('Please enter a valid email address');
    }
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
                  />
                  <button onClick={handleSubscribe}>Subscribe</button>
              </div>
          </div>
      </section>
    </>
  );
};

export default Contact;
