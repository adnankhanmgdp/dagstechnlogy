const Notification = require('../../models/user/notifications.model')

exports.fetchNotifications = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: "Phone number is required." });
        }

        const notifications = await Notification.find({
            id: phone
        }).sort({
            createdAt: -1
        })

        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};