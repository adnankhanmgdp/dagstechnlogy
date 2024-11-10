const Coupon = require('../../models/admin/coupon.model');

exports.getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;  // IST offset in milliseconds
        const currentTimeIST = new Date(now.getTime() + istOffset);

        // Find active coupons that have not expired
        const activeCoupons = await Coupon.find({
            status: true,
            expiryAt: { $gt: currentTimeIST }  // Check that expiry date is greater than current time
        });
        const allCoupons = await Coupon.find();

        const expiredCoupons = [];

        // Check expiry and update status
        for (const coupon of allCoupons) {
            if (coupon.expiryAt <= currentTimeIST) {
                if (coupon.status === true) {
                    coupon.status = false;
                    await coupon.save();
                    expiredCoupons.push(coupon);
                }
            } else {
                if (coupon.status === true) {
                    activeCoupons.push(coupon);
                }
            }
        }
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