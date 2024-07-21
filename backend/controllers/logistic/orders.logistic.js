const Order = require('../../models/user/order.model');
const { startOfDay, endOfDay, isBefore, subDays } = require('date-fns');
const Vendor = require('../../models/vendor/vendor.model');
const Service = require('../../models/vendor/service.model');
const Logistic = require('../../models/logistic/delivery.model');
const User = require('../../models/user/user.model');
const Notification = require('../../models/user/notifications.model')
const { sendOTP, generateOTP } = require('../../utils/admin/generateOTP');
const bcrypt = require('bcryptjs')

exports.getLogisticDashboard = async (req, res) => {
    const logisticId = req.body.logisticId;
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString();
    const yesterday = subDays(new Date(), 1); // Calculate yesterday's date

    try {
        const todayOrders = await Order.find({
            logisticId: logisticId,
            'orderStatus': {
                $elemMatch: {
                    status: 'initiated',
                    time: {
                        $gte: startOfDay(today),
                        $lte: endOfDay(today)
                    }
                }
            }
        });


        // Initialize variables to track total amounts and income for today
        let totalAmountToday = 0;
        let totalIncomeToday = 0;

        // Fetch today's completed orders
        const completedOrdersToday = await Order.find({
            logisticId: logisticId,
            'orderStatus': {
                $elemMatch: {
                    status: 'delivered',
                    time: {
                        $gte: startOfDay(today),
                        $lte: endOfDay(today)
                    }
                }
            }
        });

        completedOrdersToday.forEach(order => {
            order.amount.forEach(amount => {
                totalIncomeToday += amount;
            });
        });

        // Fetch previous day's completed orders with status 'completed'
        const completedOrdersYesterday = await Order.find({
            logisticId: logisticId,
            'orderDate': {
                $gte: startOfDay(yesterday),
                $lt: startOfDay(today)
            },
            'orderStatus.status': 'delivered'
        });

        // Iterate over previous day's completed orders to calculate total income for today
        completedOrdersYesterday.forEach(order => {
            order.amount.forEach(amount => {
                totalIncomeToday += amount;
            });
        });

        // Calculate total amount for today's orders
        todayOrders.forEach(order => {
            order.amount.forEach(amount => {
                totalAmountToday += amount;
            });
        });

        // Calculate total completed orders for today
        const totalCompletedOrders = completedOrdersToday.length + completedOrdersYesterday.length;

        // Fetch previous day's orders with status other than 'complete' or 'cancelled'
        const previousDaysOrders = await Order.find({
            logisticId: logisticId,
            'orderDate': {
                $lt: startOfDay(today)
            },
            'orderStatus.status': {
                $nin: ['delivered', 'cancelled']
            }
        });

        // Send response with the calculated data
        res.status(200).json({
            totalAmountToday,
            totalCompletedOrders,
            totalIncomeToday,
            todayOrders,
            previousDaysOrders
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.getAllOrders = async (req, res) => {
    const { logisticId } = req.body;
    try {
        const logistic = await Logistic.findOne({ logisticId });
        const orderIds = logistic.orders
        const orders = await Order.find({ orderId: { $in: orderIds } }).sort({
            pickupDate: -1
        });
        res.json(orders)
    } catch (error) {
        console.error("Error retrieving orders data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchActiveOrders = async (req, res) => {
    try {
        const { logisticId } = req.body;
        const logistic = await Logistic.findOne({ logisticId });
        const orderIds = logistic.orders
        const orders = await Order.find({
            orderId: { $in: orderIds },
            'orderStatus.status': { $ne: 'cancelled' }
        }).sort({ pickupDate: -1 });
        //will get all orders even repeated orders 

        // const activeOrders = orders.filter(order => {
        //     let isActive = true;

        //     // Check if there is a pickup logistic status
        //     if (order.logisticId[0]) {
        //         const pickupStatus = order.orderStatus.find(status => logisticId === order.logisticId[0]);
        //         if (pickupStatus && pickupStatus.status === 'cleaning') {
        //             isActive = false;
        //         }
        //     }

        //     // Check if there is a delivery logistic status
        //     if (order.logisticId[1]) {
        //         const deliveryStatus = order.orderStatus.find(status => logisticId === order.logisticId[1]);
        //         if (deliveryStatus && deliveryStatus.status === 'delivered') {
        //             isActive = false;
        //         }
        //     }

        //     // Order is active if at least one of the conditions above is not met
        //     return isActive;
        // });

        const activeOrdersOnPickup = orders.filter(order => {
            const statusesToExclude = ["cleaning", "cancelled", "refunded"];
            return !order.orderStatus.some(status => statusesToExclude.includes(status.status));
        });
        const activeOrdersOnDelivery = orders.filter(order => {
            const statusesToExclude = ["delivered", "cancelled", "refunded"];
            return !order.orderStatus.some(status => statusesToExclude.includes(status.status));
        });

        let activeOrders = [...activeOrdersOnPickup, ...activeOrdersOnDelivery];

        activeOrders = Array.from(new Set(activeOrders.map(order => order.id)))
            .map(id => activeOrders.find(order => order.id === id));

        return res.status(200).json({ activeOrders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.fetchPastOrders = async (req, res) => {
    try {
        const { logisticId } = req.body;

        const logistic = await Logistic.findOne({ logisticId })

        if (!logistic) {
            return res.status(404).json({ message: "Logistic not found" });
        }

        const orderIds = logistic.orders;

        const orders = await Order.find({ orderId: { $in: orderIds } }).sort({
            orderDate: -1
        });

        const pastOrdersOnPickup = orders.filter(order => {
            const statusesToInclude = ["cleaning", "cancelled", "refunded"];
            return order.orderStatus.some(status => statusesToInclude.includes(status.status));
        });
        const pastOrdersOnDelivery = orders.filter(order => {
            const statusesToInclude = ["delivered", "cancelled", "refunded"];
            return order.orderStatus.some(status => statusesToInclude.includes(status.status));
        });

        let pastOrders = [...pastOrdersOnPickup, ...pastOrdersOnDelivery];

        pastOrders = Array.from(new Set(pastOrders.map(order => order.id)))
        .map(id => pastOrders.find(order => order.id === id));

        return res.status(200).json({ pastOrders });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOne({ orderId })

        if (!order) {
            return res.send('Order not found');
        }

        // const populatedItems = [];

        // for (const item of order.items) {
        //     const service = await Service.findOne({ serviceId: item.serviceId });

        //     const foundItem = service.items.find(servItem => servItem.itemId === item.itemId);

        //     // if (!foundItem) {
        //     //     continue;
        //     // }

        //     populatedItems.push({
        //         itemName: foundItem.name,
        //         service: service.name,
        //         unitPrice: item.unitPrice,
        //         qty: item.qty
        //     });
        // }

        const user = await User.findOne({
            phone: order.userId
        })
        const vendor = await Vendor.findOne({
            vendorId: order.vendorId
        })

        return res.status(200).json({
            mesage: "order fetched sucessfully",
            order, user, vendor
        })
    } catch {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
}

exports.pickedUpStatus = async (req, res) => {
    try {
        const { orderId, secretKey } = req.body;
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        order.secretKey = secretKey;

        if (order.orderStatus[order.orderStatus.length - 1].status !== "readyToPickup") {
            return res.status(400).json("Invalid Status")
        }

        order.orderStatus.push({
            status: "pickedUp",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });

        // const logisticId = order.logisticId[0]
        // const logistic = await Logistic.findOne({ logisticId })

        await order.save();
        await Notification.create({
            id: order.userId,
            orderId: orderId,
            title: "Order picked up Successfully",
            notificationFor: "user"
        })
        // await logistic.save();

        res.status(200).json({
            message: "Order picked up successfully",
            order
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.outOfDeliveryStatus = async (req, res) => {
    try {
        const { secretKey } = req.body;
        const order = await Order.findOne({ secretKey });
        const user = await User.findOne({ phone: order.userId })

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.secretKey !== secretKey) {
            return res.status(403).json({ error: "Invalid secret key" });
        }

        if (order.orderStatus[order.orderStatus.length - 1].status != "readyToDelivery") {
            return res.status(400).json("Invalid Status")
        }

        order.orderStatus.push({
            status: "outOfDelivery",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });

        order.settlementToVendor = order.vendorFee;
        await order.save();
        await user.save();
        await Notification.create({
            id: order.userId,
            orderId: order.orderId,
            title: "Your order is out of delivery",
            notificationFor: "user"
        })

        res.status(200).json({
            message: "Order out for delivery",
            order
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.confirmDelivery = async (req, res) => {
    try {
        const { otp, orderId, otpStored } = req.body;
        const order = await Order.findOne({ orderId })
        const user = await User.findOne({ phone: order.userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (otp !== otpStored) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }

        if (order.orderStatus[order.orderStatus.length - 1].status != "outOfDelivery") {
            return res.status(400).json("Invalid Status")
        }

        order.orderStatus.push({
            status: "delivered",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });
        order.settlementForLogisticsOnDelivery = order.deliveryFee / 2;
        const logistic = await Logistic.findOne({ logisticId: order.logisticId[1] })
        logistic.currentActiveOrder -= 1;
        await order.save();
        await logistic.save();
        await Notification.create({
            id: order.userId,
            orderId: orderId,
            title: "Order Delivered",
            notificationFor: "user"
        })

        return res.json({
            message: "Order is Delivered Successfully",
            order
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

exports.deliveryOTP = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findOne({ orderId })
        const phoneOTP = generateOTP().substring(0, 4)
        console.log(phoneOTP)

        // const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        // user.OTP = hashedOTP;
        const otp = sendOTP(phoneOTP, order.userId);
        res.json({
            message: "OTP send successfully",
            phoneOTP
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
//using this
exports.dashboard = async (req, res) => {
    const logisticId = req.body.logisticId;
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString();
    const yesterday = subDays(new Date(), 1); // Calculate yesterday's date

    try {

        //all total orders until now
        const allOrdersOnPickup = await Order.find({
            'logisticId.0': logisticId,
            orderStatus: {
                $elemMatch: { status: 'cleaning' }
            }
        })

        const allOrdersOnDelivery = await Order.find({
            'logisticId.1': logisticId,
            orderStatus: {
                $elemMatch: { status: 'delivered' }
            }
        })

        //all completed orders
        const todayOrdersOnPickupCompleted = await Order.find({
            'logisticId.0': logisticId,
            'orderStatus': {
                $elemMatch: {
                    $and: [
                        { status: 'cleaning' },
                        { status: { $ne: 'cancelled' } },
                        { time: { $gte: startOfDay(today), $lte: endOfDay(today) } }
                    ]
                }
            }
        });

        const todayOrdersOnDeliveryCompleted = await Order.find({
            'logisticId.1': logisticId,
            'orderStatus': {
                $elemMatch: {
                    $and: [
                        { status: 'delivered' },
                        { status: { $ne: 'cancelled' } },
                        { time: { $gte: startOfDay(today), $lte: endOfDay(today) } }
                    ]
                }
            }
        });

        // Initialize variables to track total amounts and income for today
        let totalAmountTodayOnPickup = 0;
        let totalAmountTodayOnDelivery = 0;
        let totalAmount = 0;
        let distance = 0;

        // Calculate total amount for today's orders
        todayOrdersOnPickupCompleted.forEach(order => {
            totalAmountTodayOnPickup += order.deliveryFee / 2;
        });
        todayOrdersOnDeliveryCompleted.forEach(order => {
            totalAmountTodayOnDelivery += order.deliveryFee / 2;
        });

        //total number of orders completed till now
        const totalOrders = allOrdersOnPickup.length + allOrdersOnDelivery.length

        totalAmount = totalAmountTodayOnPickup + totalAmountTodayOnDelivery

        const orderOnPickup = await Order.find({
            'logisticId.0': logisticId,
            'orderStatus': {
                $elemMatch: {
                    $and: [
                        { status: 'readyToPickup' },
                        { status: { $ne: 'cancelled' } },
                        { status: { $ne: 'cleaning' } },
                    ]
                }
            }
        });
        const orderOnDelivery = await Order.find({
            'logisticId.1': logisticId,
            'orderStatus': {
                $elemMatch: {
                    $and: [
                        { status: 'readyToDelivery' },
                        { status: { $ne: 'cancelled' } },
                        { status: { $ne: 'delivered' } },
                    ]
                }
            }
        });

        allOrdersOnPickup.forEach(order => {
            if (order.distance != null)
                distance += parseFloat(order.distance)
        });
        allOrdersOnDelivery.forEach(order => {
            if (order.distance != null)
                distance += parseFloat(order.distance)
        });


        // Send response with the calculated data
        res.status(200).json({
            totalOrders,
            ordersToPickup: orderOnPickup.length,
            totalTodayOrdersPicked: todayOrdersOnPickupCompleted.length,
            ordersToDelivered: orderOnDelivery.length,
            totalTodayOrdersDelivered: todayOrdersOnDeliveryCompleted.length,
            todaysEarning: totalAmount,
            distance:Math.round(distance)
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


// exports.dashboard1 = async (req, res) => {
//     const logisticId = req.body.logisticId;
//     const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString();
//     const yesterday = subDays(new Date(), 1); // Calculate yesterday's date

//     try {
//         const todayOrdersOnPickup = await Order.find({
//             'logisticId.0': logisticId,
//             'orderStatus': {
//                 $elemMatch: {
//                     $and: [
//                         { status: 'cleaning' },
//                         { status: { $ne: 'cancelled' } },
//                         { time: { $gte: startOfDay(today), $lte: endOfDay(today) } }
//                     ]
//                 }
//             }
//         });

//         const todayOrdersOnDelivery = await Order.find({
//             'logisticId.1': logisticId,
//             'orderStatus': {
//                 $elemMatch: {
//                     $and: [
//                         { status: 'delivered' },
//                         { status: { $ne: 'cancelled' } },
//                         { time: { $gte: startOfDay(today), $lte: endOfDay(today) } }
//                     ]
//                 }
//             }
//         });

//         // Initialize variables to track total amounts and income for today
//         let totalAmountTodayOnPickup = 0;
//         let totalAmountTodayOnDelivery = 0;
//         let totalAmount = 0;
//         let distance = 0;

//         // Calculate total amount for today's orders
//         todayOrdersOnPickup.forEach(order => {
//             totalAmountTodayOnPickup += order.deliveryFee / 2;
//             distance += order.distance
//         });
//         todayOrdersOnDelivery.forEach(order => {
//             totalAmountTodayOnDelivery += order.deliveryFee / 2;
//             distance += order.distance
//         });
//         const totalOrder = todayOrdersOnPickup.length + todayOrdersOnDelivery.length

//         totalAmount = totalAmountTodayOnPickup + totalAmountTodayOnDelivery

//         // Calculate total completed orders for today
//         // const totalCompletedOrders = completedOrdersToday.length + completedOrdersYesterday.length;

//         // Fetch previous day's orders with status other than 'complete' or 'cancelled'
//         // const previousDaysOrders = await Order.find({
//         //     logisticId: logisticId,
//         //     'orderDate': {
//         //         $lt: startOfDay(today)
//         //     },
//         //     'orderStatus.status': {
//         //         $nin: ['delivered', 'cancelled']
//         //     }
//         // });

//         // Send response with the calculated data
//         res.status(200).json({
//             totalAmount,
//             distance,
//             totalOrder,
//             orderOnPickup: todayOrdersOnPickup.length,
//             orderOnDelivery: todayOrdersOnDelivery.length
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// }