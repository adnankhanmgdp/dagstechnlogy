const mailSender = require("../../utils/admin/mailSender");
const News = require("../../models/admin/news")

exports.formSumbit = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body
        const recaptcha = req.body['g-recaptcha-response']


        // const recaptcha = req.body.g-recaptcha-response;
        // console.log(name, email, phone, subject, message, recaptcha)
        // Fetch and sort time slots by startTime in ascending order
        console.log(String(recaptcha))

        const url = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: process.env.secret_key,
                response: String(recaptcha)
            })
        });

        const data = await url.json();
        console.log(data)
        if (data.success == true) {
            const emailBody = `
            <h4> ${name}</h4>
            <p> ${phone} </p>
            <p>${email} </p>
            <p> ${subject}</br></p>
            <p> ${message} </p>
            `
            await mailSender(process.env.MAIL_USER, 'New Message from Website', emailBody);


            return res.redirect("https://dagstechnology.in#success")
        }
        else {
            return res.redirect("https://dagstechnology.in#error")
        }
    } catch (error) {
        res.redirect("https://dagstechnology.in#error")
    }
};

exports.newsletter = async (req, res) => {
    try {
        const { email } = req.body
        const checkPresent = await News.findOne({ email: email })
        if (checkPresent) {
            return res.redirect("https://dagstechnology.in#already-subscribed")
        }
        const news = await News.create({ email: email })
        return res.redirect("https://dagstechnology.in#success")
    } catch(error) {
        return res.redirect("https://dagstechnology.in#already-subscribe")
    }
}