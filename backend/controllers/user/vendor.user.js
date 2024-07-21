const Feedback = require("../../models/user/feedback.model");
const Order = require("../../models/user/order.model");

exports.giveReview = async (req, res) => {
    const { orderId, feedback, rating } = req.body;
    console.log(req.body)
    const order = await Order.findOne({orderId})
    if (!order) {
        res.json({ mesage: "No order found" })
    }
    console.log(order.userId)
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