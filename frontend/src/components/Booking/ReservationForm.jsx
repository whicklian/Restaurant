import React, { useState } from 'react';
import axios from 'axios';
import Receipt from './Receipt';
import { Link } from 'react-router-dom';

const MENU_ITEMS = [
  { id: 1, category: 'Appetizers', title: 'Bruschetta', price: 8.99, emoji: '🍞' },
  { id: 2, category: 'Appetizers', title: 'Crispy Calamari', price: 12.99, emoji: '🦑' },
  { id: 9, category: 'Appetizers', title: 'Garlic Bread', price: 5.99, emoji: '🧄' },
  { id: 3, category: 'Mains', title: 'Classic Burger', price: 14.99, emoji: '🍔' },
  { id: 4, category: 'Mains', title: 'Margherita Pizza', price: 18.99, emoji: '🍕' },
  { id: 5, category: 'Mains', title: 'Pasta Carbonara', price: 16.99, emoji: '🍝' },
  { id: 10, category: 'Mains', title: 'Grilled Steak', price: 25.99, emoji: '🥩' },
  { id: 6, category: 'Desserts', title: 'Tiramisu', price: 7.99, emoji: '🍮' },
  { id: 7, category: 'Desserts', title: 'NY Cheesecake', price: 8.99, emoji: '🍰' },
  { id: 11, category: 'Desserts', title: 'Choco Lava Cake', price: 9.99, emoji: '🫓' },
  { id: 8, category: 'Drinks', title: 'House Red Wine', price: 9.99, emoji: '🍷' },
  { id: 12, category: 'Drinks', title: 'Fresh Mojito', price: 8.99, emoji: '🍹' },
];

const ReservationForm = ({ showToast, user, cart, clearCart }) => {
  const [formData, setFormData] = useState({
    firstName: user ? user.name.split(' ')[0] : '',
    lastName: user ? user.name.split(' ').slice(1).join(' ') : '',
    email: user ? user.email : '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: 'none',
    requests: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);
  const [foodOrder, setFoodOrder] = useState({});
  const [showFoodPicker, setShowFoodPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changeQty = (itemId, delta) => {
    setFoodOrder(prev => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const orderedItems = MENU_ITEMS
    .filter(i => foodOrder[i.id])
    .map(i => ({ ...i, quantity: foodOrder[i.id] }));

  const cartItems = cart && cart.length > 0 ? cart : [];
  const allItems = [
    ...orderedItems,
    ...cartItems.filter(ci => !orderedItems.find(oi => oi.id === ci.id))
  ];
  const foodTotal = allItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const RESERVATION_FEE = 1500;
  const totalAmount = foodTotal + RESERVATION_FEE;


  const categories = ['All', ...new Set(MENU_ITEMS.map(i => i.category))];
  const filteredMenu = activeCategory === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === activeCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to make a reservation', 'error');
      return;
    }
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/bookings/create', {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        occasion: formData.occasion,
        requests: formData.requests,
        type: 'Table',
        items: allItems,
        reservationFee: RESERVATION_FEE,
        amount: parseFloat(totalAmount.toFixed(2))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        showToast('Reservation confirmed!', 'success');
        setShowReceipt(res.data.booking);
        setFoodOrder({});
        if (typeof clearCart === 'function') clearCart();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Reservation failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-light)', borderRadius: '15px' }}>
        <i className="fas fa-calendar-check" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1.5rem' }}></i>
        <h3>Table Reservation</h3>
        <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>Log in to book your table and pre-order your favourite meals.</p>
        <Link to="/login" className="btn" style={{ display: 'inline-block' }}>Login to Reserve</Link>
      </div>
    );
  }

  return (
    <>
      <form className="reservation-form" onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        {/* Personal Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>Personal Details
          </h4>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" type="text" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" type="text" required value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="0712345678" />
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>Booking Details
          </h4>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input name="date" type="date" required value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <select name="time" required value={formData.time} onChange={handleChange}>
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
            <div className="form-group">
              <label>Guests</label>
              <select name="guests" required value={formData.guests} onChange={handleChange}>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6+ People</option>
              </select>
            </div>
            <div className="form-group">
              <label>Special Occasion?</label>
              <select name="occasion" value={formData.occasion} onChange={handleChange}>
                <option value="none">None</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="date">Date Night</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Pre-Order */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--accent)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fas fa-utensils" style={{ marginRight: '0.5rem' }}></i>Pre-Order Food
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0, marginLeft: '0.5rem' }}>(optional)</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowFoodPicker(!showFoodPicker)}
              style={{
                background: showFoodPicker ? 'var(--accent)' : 'var(--accent-light)',
                color: showFoodPicker ? 'white' : 'var(--accent)',
                border: '1px solid var(--accent)',
                borderRadius: '20px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <i className={`fas fa-${showFoodPicker ? 'minus' : 'plus'}`} style={{ marginRight: '0.4rem' }}></i>
              {showFoodPicker ? 'Close Menu' : 'Add Items'}
            </button>
          </div>

          {/* Cart items already in cart */}
          {cartItems.length > 0 && (
            <div style={{ padding: '0.8rem 1rem', background: 'var(--accent-light)', borderRadius: '10px', marginBottom: '0.8rem', fontSize: '0.9rem' }}>
              <i className="fas fa-shopping-cart" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i>
              <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{cartItems.length} item(s) from your cart</span>
              <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>will be included.</span>
            </div>
          )}

          {/* Food picker panel */}
          {showFoodPicker && (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: '15px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: '0.3rem 0.9rem',
                      borderRadius: '20px',
                      border: '1px solid var(--accent)',
                      background: activeCategory === cat ? 'var(--accent)' : 'transparent',
                      color: activeCategory === cat ? 'white' : 'var(--accent)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >{cat}</button>
                ))}
              </div>

              {/* Items list */}
              <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
                {filteredMenu.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.8rem',
                    background: 'var(--surface)',
                    borderRadius: '10px',
                    border: foodOrder[item.id] ? '1px solid var(--accent)' : '1px solid transparent'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{item.emoji}</span>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.title}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700' }}>KSH {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, -1)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          border: '1px solid var(--border-light)',
                          background: 'var(--surface-alt)', cursor: 'pointer', fontWeight: 'bold',
                          color: 'var(--text-primary)'
                        }}
                      >−</button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '700', color: 'var(--accent)' }}>
                        {foodOrder[item.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(item.id, 1)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          border: 'none', background: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold',
                          color: 'white'
                        }}
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order summary */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: '600' }}>
              Cost Breakdown
            </p>
            
            {/* Base Fee */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
              <span>Base Reservation Fee</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>KSH {RESERVATION_FEE.toFixed(2)}</span>
            </div>

            {/* Food Items */}
            {allItems.length > 0 && (
              <div style={{ margin: '0.5rem 0', paddingLeft: '0.5rem', borderLeft: '2px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>PRE-ORDERED FOOD:</p>
                {allItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                    <span>{item.quantity}× {item.title || item.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>KSH {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div style={{ borderTop: '1px dashed var(--border-light)', marginTop: '0.7rem', paddingTop: '0.7rem', display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--accent)' }}>KSH {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>


        {/* Special Requests */}
        <div className="form-group">
          <label><i className="fas fa-comment-alt" style={{ marginRight: '0.4rem', color: 'var(--accent)' }}></i>Special Requests</label>
          <textarea name="requests" rows="3" value={formData.requests} onChange={handleChange} placeholder="Dietary restrictions, allergies, seating preferences..."></textarea>
        </div>

        <button disabled={isProcessing} type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem' }}>
          {isProcessing
            ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>Processing...</>
            : <><i className="fas fa-calendar-check" style={{ marginRight: '0.5rem' }}></i>Confirm Reservation</>
          }
        </button>
      </form>

      {showReceipt && (
        <Receipt booking={showReceipt} onClose={() => setShowReceipt(null)} />
      )}
    </>
  );
};

export default ReservationForm;
