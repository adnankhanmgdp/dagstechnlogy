const User = require("../../models/user/user.model");
const Vendor = require("../../models/vendor/vendor.model");
const Logistic = require('../../models/logistic/delivery.model');
const { calculateDistance } = require('../../utils/logistic/shortestdistance');

exports.available = async (req, res) => {
    try {
        const { phone } = req.body;
        let vendorAvailable = true
        let logisticAvailable = true;

        const user = await User.findOne({ phone: phone })
        if (!user) {
            return res.status(400).json({
                message: "No user found"
            })
        }
        let vendors = await Vendor.find({
            availability: true,
            verificationStatus: 'active',
        });

        vendors = vendors.filter((vendor) => {
            return vendor.currentActiveOrders < vendor.capacity
        })


        if (vendors.length == 0) {
            vendorAvailable = false;
        }

        let shortestDistance = Infinity;
        vendors.forEach(vendor => {
            const distance = calculateDistance(
                user.geoCoordinates.latitude,
                user.geoCoordinates.longitude,
                vendor.geoCoordinates.latitude,
                vendor.geoCoordinates.longitude
            );
            if (distance < shortestDistance) {
                shortestDistance = distance;
            }
        });

        if (!isFinite(shortestDistance) || shortestDistance === null) {
            vendorAvailable = false;
        }

        if (shortestDistance > 30) {
            vendorAvailable = false;
        }

        //for logistic
        let logistics = await Logistic.find({
            availability: true,
            verificationStatus: "active",
        });

        logistics = logistics.filter((logistic) => {
            return logistic.currentActiveOrder < logistic.capacity
        })

        if (logistics.length == 0) {
            logisticAvailable = false;
        }

        let shortestDistanceL = Infinity;
        logistics.forEach(logistic => {
            const distance = calculateDistance(user.geoCoordinates.latitude, user.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
            }
        });

        if (!isFinite(shortestDistanceL) || shortestDistanceL === null) {
            logisticAvailable = false;
        }

        if (shortestDistanceL > 30) {
            logisticAvailable = false
        }

        res.json({
            logisticAvailable,
            vendorAvailable
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}