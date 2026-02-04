
import 'dotenv/config';
import nodemailer from 'nodemailer';

async function testEmail() {
    console.log('Testing Email Configuration...');
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log(`Secure: ${process.env.EMAIL_SECURE}`);
    console.log(`User: ${process.env.EMAIL_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('Sending test email...');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'Test Email from Node Backend',
            text: 'If you see this, your Hostinger email configuration is working correctly!'
        });
        console.log('✅ Test email sent successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testEmail();
