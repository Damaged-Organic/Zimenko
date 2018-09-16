const nodemailer = require('nodemailer');

const transportOptions = {
    service: 'Gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
};

const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.FEEDBACK_RECIPIENT,
    subject: 'Новое сообщение',
};

const transport = nodemailer.createTransport(transportOptions);

const sendMailHtml = (html) => {

    return new Promise((resolve, reject) => {
        const options = Object.assign({}, mailOptions, { html });

        transport.sendMail(options, (error) => {
            if (error) return reject(error);

            resolve();

            transport.close();
        });
    });
};

module.exports = { sendMailHtml };
