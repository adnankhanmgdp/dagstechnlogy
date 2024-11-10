const Order = require('../../models/user/order.model');
const User = require('../../models/user/user.model');
const Vendor = require('../../models/vendor/vendor.model');
const Logistic = require('../../models/logistic/delivery.model');
const { startOfDay, endOfDay } = require('date-fns')
const { startOfMonth, endOfMonth, subMonths } = require('date-fns');

exports.viewOrders = async (req, res) => {
    try {
        let orders;
        if (req.body.filter == true) {
            orders = await Order.find({ orderStatus: { $ne: "Completed" } })
        } else {
            orders = await Order.find()
        }
        const uniqueUserIds = [...new Set(orders.map(order => order.userId))];
        const uniqueLogisticIds = [...new Set(orders.flatMap(order => order.logisticId))];
        const uniqueVendorIds = [...new Set(orders.flatMap(order => order.vendorId))];

        const usersPromise = User.find({ phone: { $in: uniqueUserIds } }).exec();
        const logisticsPromise = Logistic.find({ logisticId: { $in: uniqueLogisticIds } }).exec();
        const vendorPromise = Vendor.find({ vendorId: { $in: uniqueVendorIds } }).exec();

        const [users, logistics, vendors] = await Promise.all([usersPromise, logisticsPromise, vendorPromise]);

        const userMap = new Map(users.map(user => [user.phone, user]));
        const vendorMap = new Map(vendors.map(vendor => [vendor.vendorId, vendor]));
        const logisticMap = new Map(logistics.map(logistic => [logistic.logisticId, logistic]));

        const populatedOrders = orders.map(order => ({
            ...order.toObject(),
            user: userMap.get(order.userId),
            vendor: vendorMap.get(order.vendorId),
            logistics: order.logisticId.map(id => logisticMap.get(id))
        }));

        return res.status(200).json({
            populatedOrders,
            message: "Orders fetched successfully"
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to find orders",
                error: error.message,
            });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        console.log(req.body)
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        const totalQty = order.items.reduce((acc, item) => acc + item.qty, 0);
        const user = await User.findOne({ phone: order.userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const vendor = await Vendor.findOne({ vendorId: order.vendorId });

        const logisticDetails = await Logistic.find({
            logisticId: { $in: order.logisticId }
        });
        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order: {
                ...order.toObject(),
                user: user,
                vendor: vendor,
                logisticDetails: logisticDetails.map(logistic => logistic.toObject())
            },
            totalQty
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find order",
            error: error.message,
        });
    }
};

exports.updateOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            message: "Order Updated successfully",
            updatedOrder
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.updateOrderStatus = async (req, res) => {
    const { orderId, newStatus } = req.body;
    try {

        if (!orderId || !newStatus) {
            return res.status(400).json({ message: "Order ID and new status are required" });
        }

        const validStatuses = ["pending", "initiated", "readyToPickup", "pickedUp", "cleaning",
            "readyToDelivery", "outOfDelivery", "delivered", "cancelled", "refunded"];

        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findOne({ orderId: orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const statusExists = order.orderStatus.some(status => status.status === newStatus);
        if (statusExists) {
            return res.status(400).json({ message: 'Status already exists for this order' });
        }

        // Ensure the new status follows the correct order
        const statusOrder = {
            "pending": 0,
            "initiated": 1,
            "readyToPickup": 2,
            "pickedUp": 3,
            "cleaning": 4,
            "readyToDelivery": 5,
            "outOfDelivery": 6,
            "delivered": 7,
            "cancelled": 8,
            "refunded": 9
        };

        const currentStatus = order.orderStatus.length > 0 ? order.orderStatus[order.orderStatus.length - 1].status : "pending";
        if (statusOrder[newStatus] <= statusOrder[currentStatus]) {
            return res.status(400).json({ message: "New status must be greater than the current status" });
        }

        const finalStatus = {
            status: newStatus,
            time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
        };

        order.orderStatus.push(finalStatus);
        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCancelledOrders = async (req, res) => {
    try {
        const orders = await Order.find({ OrderStatus: { $eq: "Canceled" } });
        res.status(200).json({
            message: "Cancelled orders fetched successfully",
            orders
        });
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong while fetching cancelled orders",
            error: error.message
        });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { phone, ...updates } = req.body;
        const user = await User.findOne({ phone: phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        updates.orderStatus = [{
            status: "pending",
            time: currentTime
        }];

        const order = await Order.create({
            userId: phone,
            orderDate: currentTime,
            ...updates,
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
    }
};

const getDayNameFromDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayIndex = date.getDay(); // Get the day index (0-6)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
};

exports.fetchOrdersByDateRange = async (req, res) => {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        start.setUTCHours(0, 0, 0, 0);
        // Set time to 23:59:59 UTC for the end date
        end.setUTCHours(23, 59, 59, 999);

        // Add 5 hours and 30 minutes to match your storage format
        start.setHours(start.getHours() + 5);
        start.setMinutes(start.getMinutes() + 30);

        end.setHours(end.getHours() + 5);
        end.setMinutes(end.getMinutes() + 30);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (start > end) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        // Create arrays to store dates and corresponding day names
        const dates = [];
        const dayNames = [];

        // Initialize currentDate to start date
        let currentDate = new Date(start);

        // Iterate through each day in the range
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dates.push(dateStr); // Push date into dates array
            dayNames.push(getDayNameFromDate(dateStr)); // Push day name into dayNames array
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        // Fetch orders within the date range
        const orders = await Order.find({
            "orderStatus.0.time": { $gte: start, $lte: end }
        });

        // Create a map to store the count of orders per day
        const ordersPerDay = {};
        const dateLabels = [];
        const incomePerDay = {};

        // Initialize the map with zeros for each day in the range
        currentDate = new Date(start); // Reset currentDate to start
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            ordersPerDay[dateStr] = 0;
            incomePerDay[dateStr] = 0;
            dateLabels.push(dateStr);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Count the number of orders for each day
        orders.forEach(order => {
            const dateStr = order.orderStatus[0].time.toISOString().split('T')[0];
            if (ordersPerDay[dateStr] !== undefined) {
                ordersPerDay[dateStr]++;
                incomePerDay[dateStr] += order.finalAmount;
            }
        });

        // Convert the map to an array of order counts
        const ordersArray = dateLabels.map(date => ordersPerDay[date]);
        const incomeArray = dateLabels.map(date => incomePerDay[date].toFixed(2));

        res.status(200).json({ message: "Orders fetched successfully", dates: dateLabels, dayNames: dayNames, orders: ordersArray, income: incomeArray });
    } catch (error) {
        console.error(`Error fetching orders by date range: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.fetchOrdersByMonthRange = async (req, res) => {
    try {
        // Calculate start and end dates for the past 12 months
        const currentDate = new Date();
        const endDate = endOfMonth(currentDate); // End date is the end of current month
        const startDate = subMonths(startOfMonth(currentDate), 11); // Start date is 12 months ago

        // Arrays to store month names, order counts, and income per month
        const monthNames = [];
        const orderCounts = [];
        const incomePerMonth = [];

        // Iterate over each month in the past 12 months
        let currentDatePointer = new Date(startDate);
        while (currentDatePointer <= endDate) {
            const startOfMonthDate = startOfMonth(currentDatePointer);
            const endOfMonthDate = endOfMonth(currentDatePointer);

            // Query orders within the current month
            const orders = await Order.find({
                "orderStatus.0.time": { $gte: startOfMonthDate, $lte: endOfMonthDate }
            });

            // Calculate total income for the current month
            const totalIncome = orders.reduce((sum, order) => sum + order.finalAmount, 0);

            // Store month name, order count, and total income
            const monthName = currentDatePointer.toLocaleDateString('en-US', { month: 'long' });
            monthNames.push(monthName);
            orderCounts.push(orders.length);
            incomePerMonth.push(totalIncome.toFixed(2)); // Fix to 2 decimal places

            // Move currentDatePointer to the next month
            currentDatePointer.setMonth(currentDatePointer.getMonth() + 1);
        }

        // Send response with month names, order counts, and income per month
        res.status(200).json({
            message: "Orders fetched successfully",
            monthNames: monthNames,
            orderCounts: orderCounts,
            income: incomePerMonth
        });

    } catch (error) {
        console.error(`Error fetching orders by date range: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.day = async (req, res) => {
    try {
        const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000))
        today.setUTCHours(0, 0, 0, 0);
        today.setHours(today.getHours() + 5);
        today.setMinutes(today.getMinutes() + 30);

        const totalOrders = await Order.countDocuments({
            orderDate: {
                $gte: startOfDay(today),
                $lte: endOfDay(today)
            }
        }).sort({ orderDate: 1 });

        res.json({ totalOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.totalOrdersCompleted = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.status(200).json({ totalOrders })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getTodaysOrders = async (req, res) => {
    try {
        const today = new Date(Date.now() + (5.5 * 60 * 60 * 1000))
        today.setUTCHours(0, 0, 0, 0);
        // Set time to 23:59:59 UTC for the end date
        today.setHours(today.getHours() + 5);
        today.setMinutes(today.getMinutes() + 30);
        console.log(today, startOfDay(today), " j", endOfDay(today))
        const orders = await Order.find({
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

        const totalAmount = orders.reduce((acc, order) => acc + order.finalAmount, 0);

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
};

// exports.week = async (req, res) => {
//     try {
//         const today = new Date();
//         const startOfWeek = new Date(today);
//         startOfWeek.setDate(today.getDate() - today.getDay());
//         const endOfWeek = new Date(startOfWeek);
//         endOfWeek.setDate(startOfWeek.getDate() + 7);

//         const totalOrders = await Order.countDocuments({
//             orderDate: { $gte: startOfWeek, $lt: endOfWeek }
//         }).sort({ orderDate: 1 });

//         res.json({ totalOrders });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

exports.month = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const totalOrders = await Order.countDocuments({
            orderDate: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ orderDate: 1 });

        res.json({ totalOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.fetchmonthlyIncome = async (req, res) => {
    console.log(req.body)
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (start > end) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        const orders = await Order.find({
            orderDate: { $gte: start, $lte: end },
            'orderStatus.status': 'delivered'
        });
        let totalAmount = 0;

        orders.forEach((order) => {
            if (order.amount) {
                console.log(order.amount)
                totalAmount += parseFloat(order.amount);
            }
        })
        console.log(totalAmount)
        res.status(200).json({ message: "Monthly Income fetched successfully", monthly: totalAmount });
    } catch (error) {
        console.error(`Error fetching orders by date range: ${error.message}`);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.initiateRefund = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findOne({ orderId })
        if (order.refundRequest == false) {
            return res.json({
                message: "Inavlid request for refund"
            })
        }
        const lastStatus = order.orderStatus[order.orderStatus.length - 1].status
        // if (lastStatus != "pending" && lastStatus != "refunded") {
        if (lastStatus == "cancelled") {
            order.orderStatus.push({
                status: "refunded",
                time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
            });
        }
        await order.save();
        res.json(order)
    } catch (error) {
        return res.json("Internal server error", error.message)
    }
}