const Coupon = require('../../models/admin/coupon.model');

exports.getActiveCoupons = async (req, res) => {
    try {
        const activeCoupons = await Coupon.find({ status: true });

        if (activeCoupons.length === 0) {
            return res.status(404).json({ message: "No active coupons found" });
        }

        res.status(200).json({
            message: "Active coupons fetched successfully",
            coupons: activeCoupons
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};