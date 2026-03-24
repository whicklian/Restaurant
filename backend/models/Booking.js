const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    receiptId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
