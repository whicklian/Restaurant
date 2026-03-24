import React, { useState } from 'react';
import axios from 'axios';
import Receipt from './Booking/Receipt';
import { Link } from 'react-router-dom';

const PremisesPayment = ({ showToast, user }) => {
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        showToast('Please login to make a booking', 'error');
        return;
    }
    
    // Format to 254...
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    else if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);

    setIsProcessing(true);
    setModalOpen(true);
    
    try {
        // Step 1: Initiate M-Pesa STK Push
        const paymentRes = await axios.post('http://localhost:5000/api/stkpush', {
            phone: formattedPhone,
            amount: amount,
            date: date
        });

        if (paymentRes.data.success) {
            // Simulate waiting for payment confirmation (8 seconds)
            setTimeout(async () => {
                try {
                    // Step 2: Create Booking in our Backend after payment success
                    const token = localStorage.getItem('token');
                    const bookingRes = await axios.post('http://localhost:5000/api/bookings/create', {
                        fullName,
                        phone: formattedPhone,
                        date,
                        amount: parseInt(amount)
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (bookingRes.data.success) {
                        showToast(`Booking & Payment successful!`, 'success');
                        setShowReceipt(bookingRes.data.booking);
                        setPhone('');
                        setAmount('');
                        setDate('');
                    }
                } catch (bookingErr) {
                    showToast('Payment received but booking failed to save. Please contact support.', 'error');
                } finally {
                    setIsProcessing(false);
                    setModalOpen(false);
                }
            }, 8000);
        } else {
            throw new Error(paymentRes.data.message || 'STK Push Request failed.');
        }

    } catch (err) {
        setIsProcessing(false);
        setModalOpen(false);
        showToast(err.response?.data?.message || 'Payment failed. Please try again.', 'error');
    }
  };

  return (
    <>
        <section id="premises" className="container">
            <div className="reservation">
                <h2 className="section-title">Book Premises & Payment</h2>
                <p className="section-subtitle">Secure our venue for your special events and make direct payments via M-Pesa.</p>

                {user ? (
                    <form className="reservation-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>M-Pesa Phone Number</label>
                                <input 
                                    type="tel" 
                                    required 
                                    placeholder="e.g. 0712345678" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Event Date</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount (KSH)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    step="1" 
                                    required 
                                    placeholder="Enter amount" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <button disabled={isProcessing} type="submit" className="btn" style={{ width: '100%', background: '#25d366' }}>
                            <i className={`fas ${isProcessing ? 'fa-spinner fa-spin' : 'fa-mobile-alt'}`}></i> 
                            {isProcessing ? ' Processing...' : ' Pay via M-Pesa'}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-light)', borderRadius: '15px' }}>
                        <i className="fas fa-lock" style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
                        <h3>Login Required</h3>
                        <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>You must be logged in to book premises and make payments.</p>
                        <Link to="/login" className="btn" style={{ display: 'inline-block' }}>Login Now</Link>
                    </div>
                )}
            </div>
        </section>

        {modalOpen && (
            <div className="lightbox active" style={{ flexDirection: 'column', textAlign: 'center', color: 'white', zIndex: 2000 }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#25d366', marginBottom: '1rem' }}></i>
                <h2>Processing STK Push...</h2>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem', maxWidth: '400px' }}>
                    Please check your phone. An M-Pesa prompt has been sent to <strong>{phone}</strong>.
                </p>
                <p style={{ marginTop: '0.5rem', color: '#ccc' }}>
                    Enter your M-Pesa PIN to complete the payment of KSH <strong>{amount}</strong>.
                </p>
                <button 
                    onClick={() => { setModalOpen(false); setIsProcessing(false); }} 
                    className="btn" 
                    style={{ marginTop: '2rem', background: 'transparent', border: '1px solid white' }}
                >
                    Cancel
                </button>
            </div>
        )}

        {showReceipt && (
            <Receipt booking={showReceipt} onClose={() => setShowReceipt(null)} />
        )}
    </>
  );
};

export default PremisesPayment;
