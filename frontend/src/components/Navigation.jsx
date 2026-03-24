import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ darkMode, toggleDarkMode, toggleCart, cartCount, user, handleLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();

  const navLinks = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'menu', label: 'Menu', path: '/#menu' },
    { id: 'about', label: 'About', path: '/#about' },
    { id: 'gallery', label: 'Gallery', path: '/#gallery' },
    { id: 'reserve', label: 'Reserve', path: '/#reserve' },
    { id: 'premises', label: 'Premises', path: '/#premises' },
    { id: 'contact', label: 'Contact', path: '/#contact' },
  ];

  const handleNavClick = (id, path) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    
    if (path.startsWith('/#')) {
        const targetId = path.split('#')[1];
        if (window.location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        navigate(path);
    }
  };

  return (
    <>
        <nav>
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>SavoryBites</Link>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <i className="fas fa-bars"></i>
            </button>
            <div className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
                {navLinks.map(link => (
                    <a 
                        key={link.id}
                        className={activeSection === link.id ? 'active' : ''}
                        onClick={() => handleNavClick(link.id, link.path)}
                    >
                        {link.label}
                    </a>
                ))}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-light)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                    {user ? (
                        <>
                            <Link to="/profile" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>
                                <i className="fas fa-user-circle"></i> {user.name}
                            </Link>
                            <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>Login</Link>
                            <Link to="/signup" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>Join</Link>
                        </>
                    )}
                    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                </div>
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
