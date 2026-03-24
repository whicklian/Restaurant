import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success', show: false });
  const navigate = useNavigate();

  useEffect(() => {
    // Auth Check
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Theme Check
    const saved = localStorage.getItem('darkMode');
    let isDark = saved === 'enabled';
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (saved === null) {
      isDark = mql.matches;
    }
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      }
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode ? 'enabled' : 'disabled');
  };

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, show: true });
    setTimeout(() => {
        setToastMessage(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    showToast('Logged out successfully');
    navigate('/');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
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

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if(savedCart) setCart(JSON.parse(savedCart));
  }, []);

  return (
    <>
      <Navigation 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        toggleCart={() => setCartOpen(true)} 
        cartCount={cartCount} 
        user={user}
        handleLogout={handleLogout}
      />
      
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} showToast={showToast} user={user} cart={cart} clearCart={clearCart} />} />
        <Route path="/login" element={<Login setUser={setUser} showToast={showToast} />} />
        <Route path="/signup" element={<Signup setUser={setUser} showToast={showToast} />} />
        <Route path="/profile" element={<Profile user={user} showToast={showToast} />} />
      </Routes>

      {/* Cart Sidebar */}
      <div className={`overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)}></div>
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`} id="cartSidebar">
          <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-cart" onClick={() => setCartOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          <div id="cartItems">
              {cart.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Your cart is empty</p>
              ) : (
                  cart.map(item => (
                      <div key={item.id} className="cart-item">
                          <img src={item.img} alt={item.title} />
                          <div className="cart-item-info">
                              <h4>{item.title}</h4>
                              <div className="cart-item-price">KSH {item.price.toFixed(2)}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'var(--surface-alt)', border: 'none', width: '25px', height: '25px', borderRadius: '5px', cursor: 'pointer' }}>-</button>
                                  <span>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'var(--surface-alt)', border: 'none', width: '25px', height: '25px', borderRadius: '5px', cursor: 'pointer' }}>+</button>
                              </div>
                          </div>
                          <div className="cart-item-remove" style={{ color: 'var(--danger)', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, -item.quantity)}>
                              <i className="fas fa-trash"></i>
                          </div>
                      </div>
                  ))
              )}
          </div>
          <div className="cart-total">Total: KSH {cartTotal.toFixed(2)}</div>
          <button className="btn checkout-btn" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCheckout}>Proceed to Checkout</button>
      </div>

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
                  <a href="/#home">Home</a>
                  <a href="/#menu">Menu</a>
                  <a href="/#about">About</a>
                  <a href="/#gallery">Gallery</a>
                  <a href="/#reserve">Reserve</a>
                  <a href="/#premises">Premises</a>
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
      <div className={`toast ${toastMessage.show ? 'show' : ''}`}>
          {toastMessage.text}
      </div>
    </>
  );
}

export default App;

