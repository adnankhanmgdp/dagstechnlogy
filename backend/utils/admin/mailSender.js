const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    console.log(email)
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        return info;
    } catch (error) {
        console.log("Error occurred while sending email:", error.message);
    }
};

module.exports = mailSender;
