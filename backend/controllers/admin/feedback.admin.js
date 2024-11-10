const Feedback = require("../../models/user/feedback.model")

exports.vendorFeedback = async (req, res) => {
    try {
        const { vendorId } = req.body;

        // Aggregation pipeline to calculate the average rating
        const feedbacksWithAvgRating = await Feedback.aggregate([
            { $match: { vendorId: vendorId } },
            {
                $addFields: {
                    rating: { $toDouble: "$rating" }
                }
            },
            {
                $group: {
                    _id: "$vendorId",
                    averageRating: { $avg: "$rating" },
                    feedbacks: { $push: "$$ROOT" }
                }
            }
        ]);

        if (feedbacksWithAvgRating.length === 0) {
            return res.json({
                message: "No feedbacks found for the given vendorId",
                feedbacks: [],
                averageRating: null
            });
        }

        const { feedbacks, averageRating } = feedbacksWithAvgRating[0];

        res.json({
            message: "Feedback fetched successfully",
            feedbacks,
            averageRating
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

