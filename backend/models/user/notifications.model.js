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
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
    },
    orderDate: {
        type: Date,
        default: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString() //time on which order is placed 
    },
}, { versionKey: false });

module.exports = mongoose.model("Notification", NotificationtSchema);
