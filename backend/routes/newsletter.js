const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    try {
        const transporter = createTransporter();

        // Send welcome email to subscriber
        await transporter.sendMail({
            from: `"SavoryBites 🍽️" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 Welcome to the SavoryBites Newsletter!',
            html: `
                <div style="font-family: 'Georgia', serif; max-width: 650px; margin: 0 auto; background: #ffffff; color: #333; border: 1px solid #eaeaea; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #c17b4b, #9e623b); padding: 50px 40px; text-align: center;">
                        <h1 style="margin: 0; font-size: 2.5rem; color: #fff; letter-spacing: 3px; font-weight: normal; font-family: 'Playfair Display', serif;">SavoryBites</h1>
                        <p style="margin: 15px 0 0; color: rgba(255,255,255,0.9); font-size: 1.1rem; font-style: italic;">A Journey of Culinary Excellence Begins</p>
                    </div>
                    
                    <!-- Body -->
                    <div style="padding: 50px 40px; background: #fffaf6;">
                        <h2 style="color: #c17b4b; margin-top: 0; font-size: 1.8rem; font-weight: normal;">Welcome to our intimate dining family.</h2>
                        
                        <p style="line-height: 1.8; color: #555; font-size: 1.1rem;">
                            Dearest guest, it is with immense joy and gratitude that we welcome you to the exclusive <strong>SavoryBites Newsletter</strong>. By joining us, you have stepped into a world where gastronomy meets artistry, and every meal is a meticulously crafted masterpiece.
                        </p>

                        <p style="line-height: 1.8; color: #555; font-size: 1.1rem;">
                            At SavoryBites, we believe that dining is not merely about sustenance—it is an enchanting symphony of flavors, aromas, and memories waiting to be made. Our kitchen is a theater of passion where locally sourced, pristine ingredients are transformed into culinary poetry. 
                        </p>

                        <div style="margin: 40px 0; border-left: 4px solid #c17b4b; padding-left: 20px;">
                            <h3 style="color: #9e623b; font-size: 1.3rem; margin: 0 0 10px 0;">As a cherished subscriber, you will now receive:</h3>
                            <ul style="color: #666; line-height: 2; font-size: 1.05rem; padding-left: 20px;">
                                <li>✨ First access to our seasonal, limited-edition tasting menus.</li>
                                <li>🍷 Exclusive invitations to our private wine-pairing evenings.</li>
                                <li>👨‍🍳 Intimate behind-the-scenes stories and secret recipes from our kitchen.</li>
                                <li>🍾 Priority booking options during high-demand holiday seasons.</li>
                            </ul>
                        </div>
                        
                        <div style="background: #fff; border: 1px solid #f0e4d8; border-radius: 12px; padding: 30px; margin: 40px 0; text-align: center; box-shadow: 0 4px 15px rgba(193,123,75,0.08);">
                            <p style="margin: 0; color: #c17b4b; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem;">A Token of Our Appreciation</p>
                            <h3 style="margin: 15px 0; font-size: 1.8rem; color: #333; font-weight: normal;">Enjoy 10% Off</h3>
                            <p style="margin: 0; color: #666; font-size: 1.05rem;">Use the code <strong style="background: #fdf5f0; padding: 4px 12px; border-radius: 4px; color: #c17b4b; border: 1px dashed #c17b4b; letter-spacing: 1px;">WELCOME10</strong> on your next enchanting evening with us.</p>
                        </div>
                        
                        <p style="color: #555; line-height: 1.8; font-size: 1.1rem;">
                            We are counting the days until we can host you again and treat you to an unforgettable night of warmth, luxury, and spectacular cuisine. Until then, may your days be perfectly seasoned.
                        </p>

                        <div style="margin-top: 50px; text-align: center;">
                            <p style="margin: 0 0 15px; color: #888; font-size: 0.95rem; font-style: italic; font-family: 'Georgia', serif;">With warmest regards,</p>
                            
                            <!-- Email-safe cursive font stack -->
                            <h2 style="margin: 0; font-family: 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', cursive; font-size: 3.5rem; color: #c17b4b; font-weight: normal; line-height: 1;">
                                Reagan
                            </h2>
                            
                            <!-- Elegant divider -->
                            <div style="width: 150px; height: 1px; background: linear-gradient(90deg, transparent, #c17b4b, transparent); margin: 15px auto;"></div>
                            
                            <p style="margin: 0; font-weight: bold; color: #333; letter-spacing: 2px; text-transform: uppercase; font-size: 0.9rem; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Reagan Omondi</p>
                            <p style="margin: 4px 0 0; color: #c17b4b; font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase; font-family: 'Georgia', serif;">Senior Chef, SavoryBites</p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eaeaea;">
                        <p style="margin: 0; color: #999; font-size: 0.85rem; line-height: 1.6;">
                            <strong>SavoryBites</strong><br>
                            An oasis of taste in Oyugis, Homa Bay<br>
                            Reservations: 0707848992<br>
                            <br>
                            <a href="#" style="color: #c17b4b; text-decoration: none; border-bottom: 1px solid #c17b4b; padding-bottom: 2px;">Unsubscribe from our letters</a>
                        </p>
                    </div>
                </div>
            `
        });

        res.json({ success: true, message: 'Subscribed! Check your email for a welcome message.' });

    } catch (error) {
        console.error('Newsletter email error:', error.message);
        res.status(500).json({ success: false, message: 'Could not send email. Please try again later.' });
    }
});

module.exports = router;
