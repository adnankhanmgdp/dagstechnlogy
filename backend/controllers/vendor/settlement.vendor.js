const Settlement = require('../../models/admin/settlement.model')
const Order = require('../../models/user/order.model')

//using this one
exports.settlement = async (req, res) => {
    try {
        const { vendorId } = req.body
        const settlementHistory = await Settlement.find({ Id: vendorId });
        let amountEarned = 0

        const dueAmount = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorId, // Filter orders by vendorId
                    settlementToVendor: { $gt: 0 }, // Filter orders where settlementToVendor is not null and not 0
                    orderStatus: {
                        // Exclude orders with 'cancelled' status in orderStatus
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$settlementToVendor' } // Summing up the 'amount' field of matching orders
                }
            }
        ]);

        const totalAmount = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorId, // Filter orders by vendorId
                    orderStatus: { // Ensure order has 'initiated' status and exclude 'cancelled' status
                        $elemMatch: {
                            status: 'readyToDelivery'
                        },
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$vendorFee' } // Sum up the 'vendorFee' field of matching orders
                }
            }
        ]);

        if (dueAmount.length > 0 && totalAmount.length > 0) {
            amountEarned = totalAmount[0].totalAmount - dueAmount[0].totalAmount
        } else {
            amountEarned = totalAmount[0].totalAmount
        }

        res.status(200).json({
            message: 'Settlement history fetched successfully',
            history: settlementHistory,
            dueAmount,  //contain all due amount
            totalAmount, //contain total amount including due
            amountEarned
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching settlement history',
            message: error.message
        });
    }
}

exports.settle = async (req, res) => {
    try {
        const { vendorId } = req.body
        const settlementHistory = await Settlement.find({ Id: vendorId });
        let amountEarned = 0

        if (!settlementHistory.length) {
            return res.status(404).json({ error: 'No settlement history found' });
        }

        const dueAmount = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorId, // Filter orders by vendorId
                    // settlementToVendor: { $gt: 0 }, // Filter orders where settlementToVendor is not null and not 0
                    orderStatus: {
                        $elemMatch: {
                            status: 'initiated'
                        },
                        // Exclude orders with 'cancelled' status in orderStatus
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    dueAmount: { $sum: '$settlementToVendor' },
                    totalAmount: { $sum: '$vendorFee' }
                    // Summing up the 'amount' field of matching orders
                }
            }
        ]);

        const totalAmount = await Order.aggregate([
            {
                $match: {
                    vendorId: vendorId, // Filter orders by vendorId
                    orderStatus: { // Ensure order has 'initiated' status and exclude 'cancelled' status
                        $elemMatch: {
                            status: 'initiated'
                        },
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$vendorFee' } // Summing up the 'vendorFee' field of matching orders
                }
            }
        ]);

        if (dueAmount && totalAmount) {
            amountEarned = totalAmount[0].totalAmount - dueAmount[0].totalAmount
        }

        res.status(200).json({
            message: 'Settlement history fetched successfully',
            history: settlementHistory,
            dueAmount,  //contain all due amount
            totalAmount, //contain total amount including due
            amountEarned
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching settlement history',
            message: error.message
        });
    }
}