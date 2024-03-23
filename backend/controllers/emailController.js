const nodemailer =  require('nodemailer');
// require('dotenv').config({ path: '../../.env' });
// dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hakkimbinqamar@gmail.com',
        pass: 'ycqi pubf yolv hbjn'
    }
});

const sendEmail = async (options) => {
    try {
        await transporter.sendMail(options);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
module.exports = {
    sendEmail
};