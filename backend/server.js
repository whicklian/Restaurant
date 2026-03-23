const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Safaricom Daraja Credentials from .env
const consumerKey = process.env.DARAJA_CONSUMER_KEY;
const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
const shortCode = process.env.DARAJA_SHORTCODE;
const passkey = process.env.DARAJA_PASSKEY;
// Using sandbox endpoint for testing; change to api.safaricom.co.ke for production
const darajaBaseUrl = 'https://sandbox.safaricom.co.ke';

// Generate Token Middleware
const generateToken = async (req, res, next) => {
    if (consumerKey === 'YOUR_CONSUMER_KEY') {
        req.token = 'MOCK_TOKEN_123';
        return next();
    }

    try {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const response = await axios.get(`${darajaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: { Authorization: `Basic ${auth}` }
        });
        req.token = response.data.access_token;
        next();
    } catch (error) {
        console.error('Error generating Daraja token:', error.response?.data || error.message);
        return res.status(400).json({ success: false, message: 'Failed to authenticate with Daraja API. Check logic credentials.' });
    }
};

// Route: Initiate STK Push
app.post('/api/stkpush', generateToken, async (req, res) => {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
        return res.status(400).json({ success: false, message: 'Phone and amount are required.' });
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    try {
        const payload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: parseInt(amount),
            PartyA: phone, // phone number making the payment
            PartyB: shortCode, // business recieving the payment
            PhoneNumber: phone, // target phone to send the prompt to
            CallBackURL: process.env.CALLBACK_URL || 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/timeout', // Safaricom will ping this webhook and send success/failure info
            AccountReference: 'SavoryBites Booking',
            TransactionDesc: 'Premises Event Booking Payment'
        };

        if (consumerKey === 'YOUR_CONSUMER_KEY') {
            console.log("SIMULATING STK PUSH (No Daraja Keys Provided). Payload:", payload);
            return res.json({ 
                success: true, 
                message: "MOCK: STK Push Initiated successfully. (Please add real keys in .env to trigger your phone)",
                data: { ResponseCode: "0" } 
            });
        }

        const response = await axios.post(`${darajaBaseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
            headers: { Authorization: `Bearer ${req.token}` }
        });

        // ResponseCode "0" means Success.
        if (response.data.ResponseCode === "0") {
            return res.json({ success: true, message: "STK Push Initiated successfully", data: response.data });
        } else {
            return res.status(400).json({ success: false, message: "STK Push Failed", data: response.data });
        }

    } catch (error) {
        console.error('STK Push Request Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while connecting to Daraja API.', 
            error: error.response?.data || error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node backend running on http://localhost:${PORT}`);
});
