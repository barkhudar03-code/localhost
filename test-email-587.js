
import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testEmail() {
    console.log('Testing Email Configuration (Port 587)...');
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`User: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587, // HARDCODED PORT 587
        secure: false, // HARDCODED SECURE FALSE
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully on Port 587!');

        console.log('Sending test email...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'Test Email from Node Backend (Port 587)',
            text: 'If you see this, Port 587 is working!'
        });
        console.log('✅ Test email sent successfully on Port 587!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testEmail();
