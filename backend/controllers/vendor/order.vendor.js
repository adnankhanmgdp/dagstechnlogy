const Order = require('../../models/user/order.model');
const { startOfDay, endOfDay, isBefore } = require('date-fns');
const Vendor = require('../../models/vendor/vendor.model');
const Service = require('../../models/vendor/service.model');
const Logistic = require('../../models/logistic/delivery.model');
const Notification = require('../../models/user/notifications.model')
const { calculateDistance } = require('../../utils/logistic/shortestdistance');

exports.getVendorDashboard = async (req, res) => {
    const { vendorId } = req.body;
    // console.log(vendorId)
    const start = new Date(Date.now() + (5.5 * 60 * 60 * 1000))
    const end = new Date(Date.now() + (5.5 * 60 * 60 * 1000))
    start.setUTCHours(0, 0, 0, 0);
    // Set time to 23:59:59 UTC for the end date
    end.setUTCHours(23, 59, 59, 999);

    // Add 5 hours and 30 minutes to match your storage format
    start.setHours(start.getHours() + 5);
    start.setMinutes(start.getMinutes() + 30);

    end.setHours(end.getHours() + 5);
    end.setMinutes(end.getMinutes() + 30);
    // const per = await Commission.find();

    try {
        const todayOrders = await Order.find({
            vendorId: vendorId,
            'orderStatus': {
                $elemMatch: {
                    status: 'initiated',
                    time: {
                        $gte: start,
                        $lte: end
                    }
                }
            }
        });

        const totalNumberOfOrders = todayOrders.length;
        let totalAmountToday = 0;
        todayOrders.forEach(order => {
            totalAmountToday += parseFloat(order.vendorFee);
        });

        const completedOrders = await Order.find({
            vendorId: vendorId,
            'orderStatus': {
                $elemMatch: {
                    status: 'readyToDelivery',
                    // time: {
                    //     $gte: startOfDay(today),
                    //     $lte: endOfDay(today)
                    // }
                }
            }
        });

        const totalCompletedOrders = completedOrders.length;

        const previousDaysOrders = await Order.find({
            vendorId: vendorId,
            'orderDate': {
                $lt: start
            },
            'orderStatus.status': {
                $nin: ['completed', 'cancelled']
            }
        });

        res.status(200).json({
            totalNumberOfOrders,
            totalAmountToday,
            totalCompletedOrders,
            todayOrders,
            previousDaysOrders,
        });
    } catch (error) {
        console.error("Error retrieving vendor dashboard data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getTodaysOrder = async (req, res) => {
    const { vendorId } = req.body;
    const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()

    try {
        const allOrders = await Order.find({
            vendorId: vendorId,
            $or: [
                {
                    'orderStatus': {
                        $elemMatch: {
                            status: 'initiated',
                            time: {
                                $gte: startOfDay(today),
                                $lte: endOfDay(today)
                            }
                        }
                    }
                },
                {
                    'orderDate': {
                        $lt: startOfDay(today)
                    },
                    'orderStatus.status': {
                        $nin: ['complete', 'cancelled']
                    }
                }
            ]
        });
        res.status(200).json({
            allOrders
        })

    } catch (error) {
        console.error("Error retrieving todays data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchAllOrder = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const orders = await Order.find({ vendorId })
        res.json({
            message: "All Orders for vendor fetched successfully",
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed ",
            error: error.message,
        });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findOneAndDelete({ orderId })
        if (!order) {
            return res.json({ message: 'Order not found' });
        }
        const populatedItems = [];

        for (const item of order.items) {
            const service = await Service.findOne({ serviceId: item.serviceId });

            const foundItem = service.items.find(servItem => servItem.itemId === item.itemId);

            // if (!foundItem) {
            //     continue;
            // }

            populatedItems.push({
                itemName: foundItem.name,
                service: service.name,
                unitPrice: item.unitPrice,
                qty: item.qty
            });
        }

        return res.status(200).json({
            mesage: "order fetched sucessfully",
            ordersDetails: populatedItems, order
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
}

exports.acceptOrder = async (req, res) => {
    try {
        const { vendorId, secretKey } = req.body;
        let order = await Order.findOne({ secretKey });

        if (!order) {
            return res.status(401).json({ error: "Invalid Secret Key" });
        }

        if (order.vendorId !== vendorId) {
            return res.status(403).json({ error: "Order does not belong to this vendor" });
        }

        if (order.orderStatus[order.orderStatus.length - 1].status !== "pickedUp") {
            return res.status(400).json("Invalid Status")
        }

        // const lastStatus = order.orderStatus[order.orderStatus.length - 1];
        //marking his active order as -1
        const logisticId = order.logisticId[0];
        const logistic = await Logistic.findOne({ logisticId })
        logistic.currentActiveOrder -= 1
        await logistic.save();

        order.orderStatus.push({
            status: "cleaning",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });
        const orderId = order.orderId;
        order.settlementForLogisticsOnPickup = order.deliveryFee / 2;
        await order.save();
        await Notification.create({
            id: order.userId,
            orderId: orderId,
            title: `Your Order \"${orderId}\" Getting Processsed`,
            notificationFor: "user"
        })
        res.status(200).json({ order });
    } catch (error) {
        {
            console.error("Error updating order status:", error);
            res.status(500).json({ error: "Failed to update order status" });
        }
    }
};

exports.readyForDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findOne({ orderId });
        const vendor = await Vendor.findOne({ vendorId: order.vendorId });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (!vendor) {
            return res.status(403).json({ error: "Vendor not found" });
        }

        if (order.orderStatus[order.orderStatus.length - 1].status !== "cleaning") {
            return res.status(400).json("Invalid Status")
        }

        let deliveryPartners = await Logistic.find({
            availability: true,
            verificationStatus: "active",
        });

        deliveryPartners = deliveryPartners.filter((logistic) => {
            return logistic.currentActiveOrder < logistic.capacity
        })
        let shortestDistance = Infinity;
        let closestPartner = null;

        deliveryPartners.forEach(partner => {
            const distance = calculateDistance(vendor.geoCoordinates.latitude, vendor.geoCoordinates.longitude, partner.geoCoordinates.latitude, partner.geoCoordinates.longitude);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestPartner = partner;
            }
        });
        order.logisticId[1] = closestPartner.logisticId;
        order.settlementToVendor = order.vendorFee;

        const logistic = await Logistic.findOne({ logisticId: closestPartner.logisticId })
        logistic.currentActiveOrder += 1;

        vendor.currentActiveOrders -= 1;
        await vendor.save();
        await logistic.save();

        order.orderStatus.push({
            status: "readyToDelivery",
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        });

        await order.save();

        await Notification.create({
            id: order.userId,
            orderId: orderId,
            title: `Your Order ${orderId} is ready for Delivery`,
            notificationFor: "user"
        })

        return res.json({
            message: "Order is ready to be picked up by delivery service",
            order
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
}

exports.activeOrders = async (req, res) => {
    try {
        const { vendorId } = req.body;
        // const orders = await Order.find({ vendorId });

        // const activeOrders = await Order.find({
        //     vendorId: vendorId,
        //     $and: [
        //         { 'orderStatus': { $elemMatch: { $ne: { status: 'delivered' } } } },
        //         { 'orderStatus': { $elemMatch: { $ne: { status: 'cancelled' } } } },
        //         { 'orderStatus': { $elemMatch: { $ne: { status: 'refunded' } } } }
        //     ]
        // });
        const activeOrders = []
        const orders = await Order.find({ vendorId }).sort({
            pickupDate: -1
        });
        orders.forEach((order) => {
            const lastStatus = order.orderStatus[order.orderStatus.length - 1].status
            if (lastStatus != "cancelled" && lastStatus != "delivered" && lastStatus != "refunded") {
                // console.log(lastStatus , order.orderId)
                activeOrders.push(order)
            }
        })

        res.json({
            message: "Active orders fetched successfully",
            orders: activeOrders
        });
    } catch (error) {
        console.error('Error fetching active orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.dateRange = async (req, res) => {
    const { vendorId, startDate, endDate } = req.body;

    try {
        const allOrders = await Order.find({
            vendorId: vendorId,
            orderDate: {
                $gte: startOfDay(new Date(startDate)),
                $lte: endOfDay(new Date(endDate))
            },
            'orderStatus.status': {
                $ne: 'cancelled'
            }
        });
        res.status(200).json({
            allOrders
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error", error: error.message });
    }
};

exports.pastOrders = async (req, res) => {
    try {
        const { vendorId } = req.body;

        // const orders = await Order.find({
        //     vendorId: vendorId,
        //     $or: [
        //         { 'orderStatus': { $elemMatch: { status: 'delivered' } } },
        //         { 'orderStatus': { $elemMatch: { status: 'cancelled' } } },
        //         { 'orderStatus': { $elemMatch: { status: 'refunded' } } }
        //     ]
        // });
        const activeOrders = []
        const orders = await Order.find({ vendorId }).sort({
            pickupDate: -1
        });
        orders.forEach((order) => {
            const lastStatus = order.orderStatus[order.orderStatus.length - 1].status
            if (lastStatus === "cancelled" || lastStatus === "delivered" || lastStatus === "refunded") {
                // console.log(lastStatus , order.orderId)
                activeOrders.push(order)
            }
        })

        res.json({
            message: "Completed orders fetched successfully",
            orders: activeOrders
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error: error.message });
    }
};

exports.week = async (req, res) => {
    try {
        const { vendorId, startDate, endDate } = req.body;

        // Helper function to adjust for IST (UTC +5:30)
        const adjustForIST = (date, isEndDate = false) => {
            const istOffset = 330; // IST is UTC+5:30, which is 330 minutes
            const offsetMillis = istOffset * 60 * 1000;
            const adjustedDate = new Date(date.getTime() + offsetMillis);

            if (isEndDate) {
                // Set to end of the day
                adjustedDate.setHours(23, 59, 59, 999);
            } else {
                // Set to start of the day
                adjustedDate.setHours(0, 0, 0, 0);
            }

            return adjustedDate;
        };

        // Parse and adjust start and end dates
        const startDateUTC = new Date(startDate);
        const endDateUTC = new Date(endDate);

        const startDateIST = adjustForIST(startDateUTC);
        const endDateIST = adjustForIST(endDateUTC, true);

        // Helper function to get all dates in the range
        const getDatesInRange = (start, end) => {
            const date = new Date(start);
            const dates = [];
            while (date <= end) {
                dates.push(new Date(date));
                date.setDate(date.getDate() + 1);
            }
            return dates;
        };

        const datesInRange = getDatesInRange(startDateIST, endDateIST);

        // Convert dates to day-of-week objects
        const dayOfWeekMap = datesInRange.map(date => {
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
            return { date, dayOfWeek };
        });

        const weeklyData = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorId,
                    orderStatus: {
                        $elemMatch: { status: "initiated" }
                    },
                    orderDate: {
                        $gte: startDateIST,
                        $lte: endDateIST
                    },
                    "orderStatus.status": { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$orderDate" },
                    totalRevenue: { $sum: "$vendorFee" },
                    count: { $sum: 1 },
                    date: { $first: "$orderDate" }
                }
            },
            {
                $sort: { "_id": 1 }
            },
            {
                $addFields: {
                    dayOfWeek: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                                { case: { $eq: ["$_id", 7] }, then: "Saturday" }
                            ],
                            default: "Unknown"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: "$$ROOT" }
                }
            },
            {
                $addFields: {
                    data: {
                        $map: {
                            input: dayOfWeekMap,
                            as: "day",
                            in: {
                                $mergeObjects: [
                                    {
                                        dayOfWeek: "$$day.dayOfWeek",
                                        totalRevenue: 0,
                                        count: 0,
                                        date: "$$day.date"
                                    },
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$data",
                                                    as: "d",
                                                    cond: { $eq: ["$$d.dayOfWeek", "$$day.dayOfWeek"] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$data"
            },
            {
                $replaceRoot: { newRoot: "$data" }
            },
            {
                $sort: { "date": 1 }
            }
        ]);

        res.json(weeklyData);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", error: error.message });
    }
};