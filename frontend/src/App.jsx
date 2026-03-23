import React, { useState, useEffect } from 'react';
import './index.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Gallery from './components/Gallery';
import PremisesPayment from './components/PremisesPayment';
import Contact from './components/Contact';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success', show: false });

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'enabled';
    setDarkMode(isDark);
    if(isDark) document.body.classList.add('dark-mode');
    
    const savedCart = localStorage.getItem('cart');
    if(savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if(!darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
  };

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, show: true });
    setTimeout(() => {
        setToastMessage(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const addToCart = (item) => {
    setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        const newCart = existing 
            ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...prev, { ...item, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(newCart));
        return newCart;
    });
    showToast(`${item.title} added to cart!`);
  };

  const updateQuantity = (id, change) => {
    setCart(prev => {
        let newCart = prev.map(i => i.id === id ? { ...i, quantity: i.quantity + change } : i);
        newCart = newCart.filter(i => i.quantity > 0);
        localStorage.setItem('cart', JSON.stringify(newCart));
        return newCart;
    });
  };

  const handleCheckout = () => {
    if(cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    alert('Thank you for your order! This would proceed to payment.');
    setCart([]);
    setCartOpen(false);
    localStorage.removeItem('cart');
    showToast('Order placed successfully!');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleCart={() => setCartOpen(true)} cartCount={cartCount} />
      
      <Hero />
      <Menu addToCart={addToCart} />

      {/* Cart Sidebar */}
      <div className={`overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)}></div>
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`} id="cartSidebar">
          <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-cart" onClick={() => setCartOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          <div id="cartItems">
              {cart.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>Your cart is empty</p>
              ) : (
                  cart.map(item => (
                      <div key={item.id} className="cart-item">
                          <img src={item.img} alt={item.title} />
                          <div className="cart-item-info">
                              <h4>{item.title}</h4>
                              <div className="cart-item-price">${item.price.toFixed(2)}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <button onClick={() => updateQuantity(item.id, -1)} style={{ background: '#f0f0f0', border: 'none', width: '25px', height: '25px', borderRadius: '5px', cursor: 'pointer' }}>-</button>
                                  <span>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} style={{ background: '#f0f0f0', border: 'none', width: '25px', height: '25px', borderRadius: '5px', cursor: 'pointer' }}>+</button>
                              </div>
                          </div>
                          <div className="cart-item-remove" style={{ color: '#ff4444', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, -item.quantity)}>
                              <i className="fas fa-trash"></i>
                          </div>
                      </div>
                  ))
              )}
          </div>
          <div className="cart-total">Total: ${cartTotal.toFixed(2)}</div>
          <button className="btn checkout-btn" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCheckout}>Proceed to Checkout</button>
      </div>

      <About />
      <Gallery />

      {/* Reservation Form */}
      <section id="reserve" className="container">
          <div className="reservation">
              <h2 className="section-title">Make a Reservation</h2>
              <p className="section-subtitle">Book your table for an unforgettable dining experience</p>
              
              <form className="reservation-form" onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Reservation confirmed!');
                  e.target.reset();
              }}>
                  <div className="form-row">
                      <div className="form-group"><label>First Name</label><input type="text" required /></div>
                      <div className="form-group"><label>Last Name</label><input type="text" required /></div>
                  </div>
                  <div className="form-row">
                      <div className="form-group"><label>Email</label><input type="email" required /></div>
                      <div className="form-group"><label>Phone</label><input type="tel" required /></div>
                  </div>
                  <div className="form-row">
                      <div className="form-group"><label>Date</label><input type="date" required min={new Date().toISOString().split('T')[0]} /></div>
                      <div className="form-group"><label>Time</label>
                          <select required>
                              <option value="">Select time</option>
                              <option value="17:00">5:00 PM</option>
                              <option value="18:00">6:00 PM</option>
                              <option value="19:00">7:00 PM</option>
                              <option value="20:00">8:00 PM</option>
                              <option value="21:00">9:00 PM</option>
                          </select>
                      </div>
                  </div>
                  <div className="form-row">
                      <div className="form-group"><label>Guests</label>
                          <select required>
                              <option value="1">1 Person</option>
                              <option value="2">2 People</option>
                              <option value="3">3 People</option>
                              <option value="4">4 People</option>
                              <option value="5">5 People</option>
                              <option value="6">6+ People</option>
                          </select>
                      </div>
                      <div className="form-group"><label>Special Occasion?</label>
                          <select>
                              <option value="none">None</option>
                              <option value="birthday">Birthday</option>
                              <option value="anniversary">Anniversary</option>
                              <option value="date">Date Night</option>
                              <option value="business">Business</option>
                          </select>
                      </div>
                  </div>
                  <div className="form-group"><label>Special Requests</label><textarea rows="3" placeholder="Dietary restrictions, allergies, etc."></textarea></div>
                  <button type="submit" className="btn" style={{ width: '100%' }}>Book Table</button>
              </form>
          </div>
      </section>

      <PremisesPayment showToast={showToast} />
      <Contact />

      <footer>
          <div className="footer-content">
              <div className="footer-section">
                  <h3>SavoryBites</h3>
                  <p>Delicious food made with love, fresh ingredients daily since 2020.</p>
                  <div className="social-icons">
                      <a href="#"><i className="fab fa-facebook"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                      <a href="#"><i className="fab fa-yelp"></i></a>
                  </div>
              </div>
              <div className="footer-section">
                  <h3>Quick Links</h3>
                  <a href="#home">Home</a>
                  <a href="#menu">Menu</a>
                  <a href="#about">About</a>
                  <a href="#gallery">Gallery</a>
                  <a href="#reserve">Reserve</a>
                  <a href="#premises">Premises</a>
              </div>
              <div className="footer-section">
                  <h3>Legal</h3>
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Accessibility</a>
                  <a href="#">Careers</a>
              </div>
          </div>
          <div className="footer-bottom">
              <p>&copy; 2025 SavoryBites. All rights reserved. | Made with ❤️ in NYC</p>
          </div>
      </footer>

      {/* Global Toast */}
      <div className={`toast ${toastMessage.show ? 'show' : ''}`} style={{ background: toastMessage.type === 'success' ? '#2d2d2d' : '#ff4444' }}>
          {toastMessage.text}
      </div>
    </>
  );
}

export default App;
