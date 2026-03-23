import React, { useState } from 'react';

const Navigation = ({ darkMode, toggleDarkMode, toggleCart, cartCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reserve', label: 'Reserve' },
    { id: 'premises', label: 'Premises' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    
    const element = document.getElementById(id);
    if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
        <nav>
            <div className="logo">SavoryBites</div>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <i className="fas fa-bars"></i>
            </button>
            <div className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
                {navLinks.map(link => (
                    <a 
                        key={link.id}
                        className={activeSection === link.id ? 'active' : ''}
                        onClick={() => handleNavClick(link.id)}
                    >
                        {link.label}
                    </a>
                ))}
                <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                    <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
            </div>
        </nav>

        <button className="cart-toggle" onClick={toggleCart}>
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{cartCount}</span>
        </button>
    </>
  );
};

export default Navigation;
