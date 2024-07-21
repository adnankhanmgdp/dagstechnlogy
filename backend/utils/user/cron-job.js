// const cron = require('node-cron');
// const mongoose = require('mongoose');
// const Order = require('../../models/user/order.model'); // adjust the path according to your project structure

// cron.schedule('* * * * *', async () => {
//     try {
//         const fiveMinutesAgo = new Date((Date.now() + (5.5 * 60 * 60 * 1000)) - 5 * 60 * 1000);

//         const orders = await Order.find({
//             'orderStatus.status': 'pending',
//             'orderStatus.time': { $lt: fiveMinutesAgo }
//         });

//         const updates = orders.map(order => {
//             order.orderStatus.push({
//                 status: 'cancelled',
//                 time: new Date(Date.now() + (5.5 * 60 * 60 * 1000)).toISOString()
//             });
//             return order.save();
//         });

//         const results = await Promise.all(updates);
//         console.log(`${results.length} orders were cancelled.`);
//     } catch (err) {
//         console.error('Error updating orders:', err);
//     }
// });
