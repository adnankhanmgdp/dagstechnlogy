const Logistic = require('../../models/logistic/delivery.model');
const Vendor = require('../../models/vendor/vendor.model');
const Order = require('../../models/user/order.model');
const { calculateDistance } = require('../../utils/logistic/shortestdistance');
const User = require('../../models/user/user.model');
const Misc = require("../../models/logistic/miscellaneous")
const Notification = require('../../models/user/notifications.model')

exports.ShortestDistanceforUser = async (req, res) => {
    try {
        const { orderId, vendorId } = req.body;
        const vendor = await Vendor.findOne({ vendorId });
        const order = await Order.findOne({ orderId });
        const user = await User.findOne({ phone: order.userId })

        let logistics = await Logistic.find({
            availability: true,
            verificationStatus: "active"
        });

        logistics = logistics.filter((logistic) => {
            return logistic.currentActiveOrder < logistic.capacity
        })
        // console.log(logistics)
        // console.log("user ", user)
        let shortestDistanceL = Infinity;
        let closestlogistic = null;
        logistics.forEach(logistic => {
            const distance = calculateDistance(user.geoCoordinates.latitude, user.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
                closestlogistic = logistic;
            }
        });

        if (!isFinite(shortestDistanceL) || shortestDistanceL === null) {
            return res.status(404).json({
                message: "No nearby Logistic Found"
            });
        }

        if (shortestDistanceL > 30) {
            return res.status(404).json({
                message: "No nearby Logistic Found"
            });
        }

        if (!closestlogistic) {
            return res.status(404).json({
                message: "No nearby Logistic Found"
            })
        }

        if (order.orderStatus[order.orderStatus.length - 1].status != "initiated") {
            return res.status(400).json("Invalid Status")
        }

        vendor.currentActiveOrders += 1;
        vendor.orders.push(orderId) //array of orders for vendor

        if (!closestlogistic.currentActiveOrders) {
            closestlogistic.currentActiveOrders = 0;
        }
        closestlogistic.currentActiveOrders += 1;
        closestlogistic.orders.push(orderId)

        order.orderStatus.push({
            status: "readyToPickup",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000))
        });
        order.logisticId.push(closestlogistic.logisticId)
        order.vendorId = vendor.vendorId

        await closestlogistic.save()
        await vendor.save()
        await order.save()
        await Notification.create({
            id: order.userId,
            orderId: orderId,
            title: `Delivery partner is coming to pick up your order ${orderId} `,
            notificationFor: "user"
        })

        res.json({ shortestDistanceL, closestlogistic, vendor });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

exports.ShortestDistanceForVendor = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const vendorId = order.vendorId;
        const vendor = await Vendor.findOne({ vendorId });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        let logistics = await Logistic.find({
            availability: true,
            verificationStatus: 'active',
            // currentActiveOrders: { $lt: "$capacity" }
        });

        logistics = logistics.filter((logistic) => {
            return logistic.currentActiveOrder < logistic.capacity
        })

        let shortestDistanceL = Infinity;
        let closestlogistic = null;

        logistics.forEach(logistic => {
            const distance = calculateDistance(vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
            if (distance < shortestDistanceL) {
                shortestDistanceL = distance;
                closestlogistic = logistic;
            }
        });

        if (!closestlogistic) {
            return res.status(404).json({ message: "No logistics found" });
        }

        closestlogistic.currentActiveOrders += 1;
        closestlogistic.orders.push(orderId);
        await closestlogistic.save();

        order.logisticId.push(closestlogistic.logisticId)  //pushing logisticid to order's logisticId at 1st index
        await order.save();
        return res.json({ shortestDistanceL, closestlogistic });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.findNearestVendor = async (req, res) => {
    const misc = await Misc.findOne();
    try {
        const { phone } = req.body

        const user = await User.findOne({ phone: phone })
        if (!user) {
            return res.status(400).json({
                message: "No user found"
            })
        }
        let vendors = await Vendor.find({
            availability: true,
            verificationStatus: 'active',
            // currentActiveOrders: { $lt: '$capacity' }
        });

        vendors = vendors.filter((vendor) => {
            return vendor.currentActiveOrders < vendor.capacity
        })

        if (vendors.length == 0) {
            return res.status(400).json("No vendors found")
        }
        let shortestDistance = Infinity;
        let closestvendor = null;
        if (!vendors) {
            res.json({
                message: 'No vendors found'
            })
        }
        vendors.forEach(vendor => {
            const distance = calculateDistance(
                user.geoCoordinates.latitude,
                user.geoCoordinates.longitude,
                vendor.geoCoordinates.latitude,
                vendor.geoCoordinates.longitude
            );
            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestvendor = vendor;
            }
        });

        // console.log("shortest distance---------->", shortestDistance)

        if (!isFinite(shortestDistance) || shortestDistance === null) {
            return res.status(400).json({
                message: "No nearest vendor available"
            });
        }

        if (shortestDistance > 30) {
            return res.status(400).json({
                message: "No nearest vendor available"
            });
        }

        let deliveryFee = 0;
        if (shortestDistance <= 5) {
            deliveryFee = misc.dist.five;
        } else if (shortestDistance <= 10) {
            deliveryFee = misc.dist.ten;
        } else if (shortestDistance <= 20) {
            deliveryFee = misc.dist.twenty;
        } else {
            deliveryFee = misc.dist.thirty; // For distances above 20+
        }
        // res.json({ shortestDistance, sampleVendor, deliveryFee, tax: misc.tax });
        res.json({ shortestDistance, closestvendor, deliveryFee, tax: misc.tax });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// exports.ShortestDistanceforUser = async (req, res) => {
//     try {
//         const { orderId } = req.body;  //user coordinates
//         const vendors = await Vendor.find({
//             availability: true,
//             currentActiveOrders: { $lt: "$capacity" }
//         });
//         const order = await Order.findOne({ orderId });
//         const user = await User.findOne({ phone: order.userId })
//         let shortestDistanceV = Infinity;
//         let closestvendor = null;
//         vendors.forEach(vendor => {
//             const distance = calculateDistance(latitude, longitude, vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude);
//             if (distance < shortestDistanceV) {
//                 shortestDistanceV = distance;
//                 closestvendor = vendor;
//             }
//         });

//         const logistics = await Logistic.find({
//             availability: true,
//             currentActiveOrders: { $lt: "$capacity" }
//         });
//         let shortestDistanceL = Infinity;
//         let closestlogistic = null;
//         logistics.forEach(logistic => {
//             const distance = calculateDistance(user.geoCoordinates.latitude, user.geoCoordinates.longitude, logistic.geoCoordinates.latitude, logistic.geoCoordinates.longitude);
//             if (distance < shortestDistanceL) {
//                 shortestDistanceL = distance;
//                 closestlogistic = logistic;
//             }
//         });

//         closestvendor.currrentActiveOrders += 1;
//         closestvendor.orders.push(orderId) //array of orders for vendor
//         await closestvendor.save()

//         closestlogistic.currrentActiveOrders += 1;
//         closestlogistic.orders.push(orderId)
//         await closestlogistic.save()

//         order.status = "readyToPickup"
//         order.logisticId.push(closestlogistic.logisticId)
//         order.vendorId = closestvendor.logisticId
//         await order.save()

//         res.json({ shortestDistanceV, closestvendor, shortestDistanceL, closestlogistic });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }