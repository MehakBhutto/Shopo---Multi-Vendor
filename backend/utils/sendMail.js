const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    const port = Number(process.env.SMPT_PORT) || 587;

    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port,
        secure: port === 465,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.verify();
    await transporter.sendMail(mailOptions)
};

module.exports = sendMail;
