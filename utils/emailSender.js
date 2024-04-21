import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (options) => {
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: options.email, // List of receivers
    subject: options.subject, // Subject line
    text: options.text, // Plain text body
    // html: options.html, // html body (if you want to use HTML)
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Email could not be sent.');
  }
};

export default sendEmail;
