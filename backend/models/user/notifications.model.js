const mongoose = require("mongoose");

const NotificationtSchema = new mongoose.Schema({
    id: {
        type: String
    },
    channel: {
        type: Number
    },
    orderId: {
        type: String
    },
    title: {
        type: String,
    },
    subtitle: {
        type: String
    },
    action: {
        type: String
    },
    notificationFor: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Notification", NotificationtSchema);
