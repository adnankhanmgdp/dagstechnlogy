const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    couponName: {
        type: String,
        trim: true,
        unique: true,
        require: true
    },
    couponDiscount: {
        type: Number,
        require: true
    },
    minAmount: {
        type: Number,
        require: true
    },
    maxDiscount: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    usedTimes: {
        type: Number,
        default: 0
    },
    expiryAt: {
        type: Date,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    },
    isFlat: {
        type: Boolean,
        require: true
    },
    createdAt: {
        type: Date,
        default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    }
}, { versionKey: false });

module.exports = mongoose.model("Coupon", CouponSchema);