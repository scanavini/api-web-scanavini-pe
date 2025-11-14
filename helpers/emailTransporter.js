const nodemailer = require('nodemailer');


// ---- SMTP transporter (Nextcloud)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE) === 'true',
  auth: { 
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS 
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 50,
  socketTimeout: 8000,
  greetingTimeout: 5000,
  connectionTimeout: 5000,
});



// previene detener el server si falla mostrando error en consola
transporter.verify().catch(err => {
  console.error('SMTP verify failed:', err?.message || err);
});

module.exports = { transporter };