const Coupon = require('../../models/admin/coupon.model')

exports.createCoupon = async (req, res) => {
    try {
        const { couponName, couponDiscount, minAmount, description, expiryAt, isFlat } = req.body;
        let { maxDiscount } = req.body

        // Validation checks
        if (!couponName || !couponDiscount || !minAmount || !description || !expiryAt) {
            return res.status(404).json({
                message: "Please provide all the fields"
            })
        }

        if (!maxDiscount) {
            maxDiscount = Number.MAX_SAFE_INTEGER;
        }

        const coupon = await Coupon.create({
            couponName: couponName,
            couponDiscount: couponDiscount,
            minAmount: minAmount,
            maxDiscount: maxDiscount,
            description: description,
            expiryAt: new Date(expiryAt),
            isFlat: isFlat
        });

        res.json({
            message: "Coupon Created Successfully",
            coupon
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.fetchCoupon = async (req, res) => {
    try {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;  // IST offset in milliseconds
        const currentTimeIST = new Date(now.getTime() + istOffset);

        // Fetch all coupons
        const allCoupons = await Coupon.find();

        const activeCoupons = [];
        const expiredCoupons = [];
        const inactiveCoupons = [];

        // Check expiry and update status
        for (const coupon of allCoupons) {
            if (coupon.expiryAt <= currentTimeIST) {
                if (coupon.status === true) {
                    coupon.status = false;
                    await coupon.save();
                    expiredCoupons.push(coupon);
                }
                inactiveCoupons.push(coupon);
            } else {
                if (coupon.status === true) {
                    activeCoupons.push(coupon);
                } else {
                    inactiveCoupons.push(coupon);
                }
            }
        }

        res.json({
            message: "Coupons fetched successfully",
            activeCoupons,
            inactiveCoupons,
            expiredCouponsUpdated: expiredCoupons.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.coupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById({ _id: id })
        res.json({
            message: "Coupon fetched Successfully",
            coupon,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if (!deletedCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json({
            message: "Coupon deleted successfully",
            coupon: deletedCoupon
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.editCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!updates.maxDiscount) {
            updates.maxDiscount = Number.MAX_SAFE_INTEGER;
        }

        // Check for uniqueness of couponName if it is being updated
        if (updates.couponName) {
            const existingCoupon = await Coupon.findOne({ couponName: updates.couponName });
            if (existingCoupon && existingCoupon._id.toString() !== id) {
                return res.status(400).json({ message: "Coupon name already exists" });
            }
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        res.status(200).json({
            message: "Coupon updated successfully",
            coupon: updatedCoupon
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};