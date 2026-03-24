import React, { useState } from 'react';
import Receipt from '../Booking/Receipt';

const BookingHistory = ({ bookings, loading }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <section>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Booking History</h3>
      {bookings.length === 0 ? (
        <div className="reservation" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No bookings found. Time to make one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="menu-card" 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1.5rem',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
              onClick={() => setSelectedBooking(booking)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <i className={`fas ${booking.type === 'Table' ? 'fa-chair' : 'fa-building'}`} style={{ color: 'var(--accent)' }}></i>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', background: 'rgba(255,107,0,0.1)', padding: '2px 8px', borderRadius: '10px', color: 'var(--accent)', fontWeight: 'bold' }}>
                    {booking.type || 'Premises'}
                  </span>
                </div>
                <h4 style={{ color: 'var(--text-primary)' }}>{booking.type === 'Table' ? 'Table Reservation' : 'Premises Booking'}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <i className="far fa-calendar-alt"></i> {new Date(booking.date).toLocaleDateString()}
                  {booking.time && <span> at {booking.time}</span>}
                </p>
                {booking.guests && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.guests} Guests</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  padding: '0.3rem 0.8rem', 
                  borderRadius: '50px', 
                  background: 'var(--accent-light)', 
                  color: 'var(--accent)',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {booking.status}
                </span>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click for receipt</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <Receipt booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </section>
  );
};

export default BookingHistory;
