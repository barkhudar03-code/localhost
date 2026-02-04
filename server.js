import 'dotenv/config';
import express from 'express';
import { join } from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('Middleware configured.');

// Serve static files from current directory
app.use(express.static(process.cwd()));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/contact_db';
console.log('Connecting to MongoDB at:', mongoUri);

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Contact Schema
const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Email Transporter Configuration (Hostinger SMTP)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports like 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Endpoint
app.post('/api/contact', async (req, res) => {
    console.log('Received contact form submission');
    try {
        const { firstName, lastName, email, service, message } = req.body;

        // 1. Save to MongoDB
        const newContact = new Contact({ firstName, lastName, email, service, message });
        await newContact.save();
        console.log('Saved to MongoDB');

        // Respond immediately to the user (FAST)
        res.status(200).json({ success: true, message: "Message sent successfully" });

        // 2. Define Email Options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            text: `
                You have received a new message from your website contact form.

                Details:
                Name: ${firstName} ${lastName}
                Email: ${email}
                Service Interest: ${service}
                Message:
                ${message}
            `
        };

        // 3. Send Email Notification (Background Process)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Do NOT await this, let it run in background
            transporter.sendMail(mailOptions)
                .then(() => console.log('📧 Email notification sent (Async)'))
                .catch(err => console.error('❌ Error sending background email:', err));
        } else {
            console.log('⚠️ Email credentials missing, skipping email.');
        }

    } catch (error) {
        console.error('❌ Error processing contact form:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Fallback to index.html
// app.get('*', (req, res) => {
//     res.sendFile(join(process.cwd(), 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
