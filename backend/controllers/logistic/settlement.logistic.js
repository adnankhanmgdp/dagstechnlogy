const Settlement = require('../../models/admin/settlement.model')
const Order = require('../../models/user/order.model')

exports.settlement = async (req, res) => {
    try {
        const { logisticId } = req.body
        const settlementHistory = await Settlement.find({ Id: logisticId });
        let settledOrders = [];

        if (!settlementHistory.length) {
            return res.status(404).json({ error: 'No settlement history found' });
        }

        // for (const settlement of settlementHistory) {
        //     const orders = await Order.find({ _id: { $in: settlement.orderIds } });
        //     settledOrders.push(orders);
        // }

        res.status(200).json({
            message: 'Settlement history fetched successfully',
            history: settlementHistory,
            // orders: settledOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching settlement history',
            message: error.message
        });
    }
}
//currently using this one
exports.calculateAmount = async (req, res) => {
    try {
        const { logisticId } = req.body

        // const check = await Order.aggregate([
        //     {
        //         $match: {
        //             'logisticId.0': logisticId, 
        //             settlementForLogisticsOnPickup: { $gt: 0 },// Filter orders by vendorId
        //             orderStatus: { // Ensure order has 'initiated' status and exclude 'cancelled' status
        //                 $elemMatch: {
        //                     status: 'initiated'
        //                 },
        //                 $not: {
        //                     $elemMatch: {
        //                         status: 'cancelled'
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     { $unwind: '$logisticId' },
        // ]);

        //pickup

        const ordersDueOnPickup = await Order.aggregate([
            {
                $match: {
                    'logisticId.0': logisticId,
                    'orderStatus.status': { $ne: 'cancelled' },
                    settlementForLogisticsOnPickup: { $gt: 0 },
                    'orderStatus.1.status': 'initiated', // Assuming 'initiated' is at 1th position
                }
            },
            { $unwind: '$logisticId' },
            {
                $group: {
                    _id: null,
                    totalSettlement: { $sum: '$settlementForLogisticsOnPickup' },
                }
            }
        ]);

        const ordersTotalOnPickup = await Order.aggregate([
            {
                $match: {
                    'logisticId.0': logisticId, // Filter orders by vendorId
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
                    totalAmount: { $sum: '$deliveryFee' } // Summing up the 'vendorFee' field of matching orders
                }
            }
        ]);

        const dueSettlementOnPickup = ordersDueOnPickup.length ? ordersDueOnPickup[0].totalSettlement : 0;
        const totalSettlementOnPickup = ordersTotalOnPickup.length ? ordersTotalOnPickup[0].totalAmount / 2 : 0;
        const amountEarnedOnPickup = totalSettlementOnPickup - dueSettlementOnPickup;

        //delivery
        const ordersDueOnDelivery = await Order.aggregate([
            {
                $match: {
                    'logisticId.1': logisticId,
                    // 'orderStatus.status': { $ne: 'cancelled' },
                    // 'orderStatus.6.status': 'outForDelivery',
                    orderStatus: { // Ensure order has 'outForDelivery' status and exclude 'cancelled' status
                        $elemMatch: {
                            status: 'outForDelivery'
                        },
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
            { $unwind: '$logisticId' },
            {
                $group: {
                    _id: null,
                    totalSettlement: { $sum: '$settlementForLogisticsOnPickup' }
                }
            }
        ]);

        const ordersTotalOnDelivery = await Order.aggregate([
            {
                $match: {
                    'logisticId.1': logisticId, // Filter orders by vendorId
                    orderStatus: { // Ensure order has 'initiated' status and exclude 'cancelled' status
                        $elemMatch: {
                            status: 'outForDelivery'
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
                    totalAmount: { $sum: '$deliveryFee' } // Summing up the 'vendorFee' field of matching orders
                }
            }
        ]);

        //delivery
        const dueSettlementOnDelivery = ordersDueOnDelivery.length ? ordersDueOnDelivery[0].totalSettlement : 0;
        const totalSettlementOnDelivery = ordersTotalOnDelivery.length ? ordersTotalOnDelivery[0].totalAmount / 2 : 0;
        const amountEarnedOnDelivery = totalSettlementOnDelivery - dueSettlementOnDelivery;
        // const orders = await Order.aggregate([
        //     {
        //         $match: {
        //             'logisticId.0': logisticId, // Filter orders by logisticId for pickup (assuming 0 index is for pickup)
        //             settlementForLogisticsOnPickup: { $ne: null, $ne: 0 }, // Filter orders where settlementForLogisticsOnPickup is not null and not 0
        //             orderStatus: { // Ensure order has 'initiated' status and exclude 'cancelled' status
        //                 $elemMatch: {
        //                     status: 'initiated'
        //                 },
        //                 $not: {
        //                     $elemMatch: {
        //                         status: 'cancelled'
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             totalLogisticsFee: { $sum: { $divide: ['$deliveryFee', 2] } } // Summing up half of the 'deliveryFee' field of matching orders
        //         }
        //     }
        // ]);

        // if (orders.length > 0) {
        //  totalLogisticsFee = orders[0].totalLogisticsFee;
        // } 

        res.json({
            dueSettlementOnPickup,
            totalSettlementOnPickup,
            amountEarnedOnPickup,
            dueSettlementOnDelivery,
            totalSettlementOnDelivery,
            amountEarnedOnDelivery,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

//not using this one - optimised but some issue coming in calculation
exports.calculateLogisticsFee = async (req, res) => {
    try {
        const { logisticId } = req.body

        //pickup
        const ordersPickup = await Order.aggregate([
            {
                $match: {
                    'logisticId.0': logisticId,
                    'orderStatus.status': { $ne: 'cancelled' },
                    'orderStatus.1.status': 'initiated', // Assuming 'initiated' is at 1th position
                }
            },
            { $unwind: '$logisticId' },
            {
                $group: {
                    _id: null,
                    totalSettlement: { $sum: '$settlementForLogisticsOnPickup' },
                    totalAmount: { $sum: '$deliveryFee' }
                }
            }
        ]);

        const dueSettlementOnPickup = ordersPickup.length ? ordersPickup[0].totalSettlement : 0;
        const totalSettlementOnPickup = ordersPickup.length ? ordersPickup[0].totalAmount : 0;
        const amountEarnedOnPickup = totalSettlementOnPickup - dueSettlementOnPickup;

        //delivery
        const ordersDelivery = await Order.aggregate([
            {
                $match: {
                    'logisticId.1': logisticId,
                    // 'orderStatus.status': { $ne: 'cancelled' },
                    // 'orderStatus.6.status': 'outForDelivery',
                    orderStatus: { // Ensure order has 'outForDelivery' status and exclude 'cancelled' status
                        $elemMatch: {
                            status: 'outForDelivery'
                        },
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
            { $unwind: '$logisticId' },
            {
                $group: {
                    _id: null,
                    totalSettlement: { $sum: '$settlementForLogisticsOnPickup' },
                    totalAmount: { $sum: '$deliveryFee' }
                }
            }
        ]);

        const check = await Order.aggregate([
            {
                $match: {
                    'logisticId.1': logisticId,
                    // 'orderStatus.status': { $ne: 'cancelled' },
                    // 'orderStatus.6.status': 'outForDelivery',
                    orderStatus: { // Ensure order has 'outForDelivery' status and exclude 'cancelled' status
                        $elemMatch: {
                            status: 'outForDelivery'
                        },
                        $not: {
                            $elemMatch: {
                                status: 'cancelled'
                            }
                        }
                    }
                }
            },
        ]);

        //delivery
        const dueSettlementOnDelivery = ordersDelivery.length ? ordersDelivery[0].totalSettlement : 0;
        const totalSettlementOnDelivery = ordersDelivery.length ? ordersDelivery[0].totalAmount : 0;
        const amountEarnedOnDelivery = totalSettlementOnDelivery - dueSettlementOnDelivery;

        res.json({
            dueSettlementOnPickup,
            totalSettlementOnPickup,
            amountEarnedOnPickup,
            dueSettlementOnDelivery,
            totalSettlementOnDelivery,
            amountEarnedOnDelivery,
            check
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}