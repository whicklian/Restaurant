const express = require('express');
const router = express.Router();
const { Booking } = require('../models/mockDB');
const authMiddleware = require('../middleware/authMiddleware');

// Create Booking
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { fullName, phone, date, amount, type, guests, time, items, occasion, requests } = req.body;
        const receiptId = 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        let tableNumber = null;
        if ((type || 'Table') === 'Table') {
            tableNumber = Math.floor(Math.random() * 20) + 1;
        }

        const booking = await Booking.create({
            userId: req.user.id,
            fullName,
            phone,
            date,
            amount: amount || 0,
            type: type || 'Table',
            guests,
            time,
            items: items || [],
            occasion,
            requests,
            receiptId,
            tableNumber
        });

        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get User's Bookings
router.get('/my-history', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id });
        // Sort manually by date
        const sortedBookings = bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, bookings: sortedBookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
