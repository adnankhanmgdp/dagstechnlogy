const Feedback = require("../../models/user/feedback.model");
const Order = require("../../models/user/order.model");

exports.giveReview = async (req, res) => {
    const { orderId, feedback, rating } = req.body;
    const order = await Order.findOne({orderId})
    if (!order) {
        res.json({ mesage: "No order found" })
    }
    const feed = await Feedback.create({
        feedback,
        rating,
        orderId:orderId,
        userId: order.userId,
        vendorId: order.vendorId,
        feedbackFor:"vendor"
    })

    order.feedbackProvided = feedback;
    order.feedbackRating = rating;
    await order.save();

    return res.json({
        message: "feedback created successfully",
        feedback: feed
    })
}

exports.showReview = async (req, res) => {
    try {
        const { orderId } = req.body;
        const feedback = await Feedback.findOne({ orderId })
        return res.json(feedback)
    } catch (error) {
        res.json({
            message: "Internal Server error"
        })
    }
}

// controllers/timeController.js

exports.time = (req, res) => {
    try {
        const currentTime = new Date();
        res.status(200).json({
            message: "Current time fetched successfully",
            currentTime: currentTime.toISOString() 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

exports.getFormattedTime = (req, res) => {
    try {
        // Example ISO date string received in IST
        const utcTime = new Date();

        // Add 5 hours and 30 minutes to UTC time
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
        const istTime = new Date(utcTime.getTime() + istOffset);// e.g., "2024-07-31T16:14:00+05:30"

        // Parse the ISO date string into a Date object;

        // Format the date in AM/PM format (without converting the time zone)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const formattedTime = istTime.toLocaleString('en-US', options);

        res.status(200).json({
            message: "Formatted time fetched successfully",
            currentTime: formattedTime // AM/PM format
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

