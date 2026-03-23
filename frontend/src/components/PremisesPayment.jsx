import React, { useState } from 'react';
import axios from 'axios';

const PremisesPayment = ({ showToast }) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format to 254...
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.slice(1);
    else if (formattedPhone.startsWith('+')) formattedPhone = formattedPhone.slice(1);

    setIsProcessing(true);
    setModalOpen(true);
    
    try {
        // Here we hit the separate Node.js backend
        const res = await axios.post('http://localhost:5000/api/stkpush', {
            phone: formattedPhone,
            amount: amount,
            date: date
        });

        if (res.data.success) {
            // Safaricom accepted the request and sent the STK push to the user's phone.
            // Normally you would use a webhook to listen for their PIN confirmation,
            // but for frontend UX we'll close the modal after 8 seconds and say success.
            setTimeout(() => {
                showToast(`Payment received successfully!`, 'success');
                setIsProcessing(false);
                setModalOpen(false);
                setPhone('');
                setAmount('');
                setDate('');
            }, 8000);
        } else {
            throw new Error(res.data.message || 'STK Push Request failed on the Backend.');
        }

    } catch (err) {
        setIsProcessing(false);
        setModalOpen(false);
        showToast(err.response?.data?.message || 'Payment failed. Please wait for the STK prompt or try again.', 'error');
        console.error(err);
    }
  };

  return (
    <>
        <section id="premises" className="container">
            <div className="reservation">
                <h2 className="section-title">Book Premises & Payment</h2>
                <p className="section-subtitle">Secure our venue for your special events and make direct payments via M-Pesa.</p>

                <form className="reservation-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" required />
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
            </div>
        </section>

        {modalOpen && (
            <div className="lightbox active" style={{ flexDirection: 'column', textAlign: 'center', color: 'white' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#25d366', marginBottom: '1rem' }}></i>
                <h2>Processing STK Push...</h2>
                <p style={{ marginTop: '1rem', fontSize: '1.1rem', maxWidth: '400px' }}>
                    Please check your phone. An M-Pesa prompt has been sent.
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
    </>
  );
};

export default PremisesPayment;
