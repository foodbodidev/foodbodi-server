const api_key = "API-KEY";

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(api_key);
const msg = {
    to: 'duyy.uit@gmail.com',
    from: 'foodbodidev95@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);