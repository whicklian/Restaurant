import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingHistory from './BookingHistory';

const Profile = ({ user, showToast }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings/my-history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        showToast('Failed to fetch booking history', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Please login to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div className="reservation" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>My Profile</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user.name}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
        </div>
      </div>

      <BookingHistory bookings={bookings} loading={loading} />
    </div>
  );
};

export default Profile;
