const Coupon = require('../../models/admin/coupon.model')

exports.createCoupon = async (req, res) => {
    console.log(req.body)
    try {
        const { couponName, couponDiscount, minAmount, maxDiscount, description, expiryAt, isFlat } = req.body;
        console.log(req.body)

        // Validation checks
        if (!couponName || !couponDiscount || !minAmount || !maxDiscount || !description || !expiryAt) {
            return res.json({
                message: "Please provide all the fields"
            })
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
        const activeCoupons = await Coupon.find({ status: true })
        const inactiveCoupons = await Coupon.find({ status: false })
        res.json({
            message: "Coupon fetched Successfully",
            activeCoupons,
            inactiveCoupons
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

exports.coupon = async (req, res) => {
    try {
        const { id } = req.query;
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
        console.log(id)

        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        console.log(deletedCoupon)
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
        console.log(req.body)
        const updates = req.body;

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
        console.log(updatedCoupon)

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