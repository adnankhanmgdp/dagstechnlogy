const Logistic = require('../../models/logistic/delivery.model');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token =
            req.body.token ||
            req.cookies.token
            || req.header("Authorization").replace("Bearer ", "")
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.logistic = decode;
            console.log(req.logistic)
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                error: error.message,
                message: 'Invalid Token'
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Something went wrong while validating the token'
        });
    }
}

exports.verifyLogistic = async (req, res, next) => {
    try {
        const { logisticId } = req.body;
        const logistic = await Logistic.findOne({ logisticId });

        if (!logistic) {
            return res.status(404).json({ error: "Logistic not found" });
        }

        if (logistic.verificationStatus !== 'active') {
            return res.status(403).json({ error: "Logistic is not verified" });
        }
        next();
    } catch (error) {
        console.error("Error verifying Logistic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.checkOrder = async (req, res, next) => {
    try {
        const { logisticId , orderId } = req.body;
        const logistic = await Logistic.findOne({ logisticId });
        const order = await Order.findOne({orderId})
    } catch (error) {
        console.error("Error verifying Logistic:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
