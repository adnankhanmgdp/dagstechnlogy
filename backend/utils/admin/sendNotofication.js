const admin = require('firebase-admin');

const sendNotification = async (fcmToken, title, body) => {
    const message = {
        notification: {
            title: title,
            body: body
        },
        token: fcmToken
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

module.exports = sendNotification;
