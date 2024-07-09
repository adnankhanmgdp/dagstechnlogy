const Logistic = require('../../models/logistic/delivery.model');
const { calculateDistance } = require('../../utils/logistic/mapBoxDistance');
// const { calculateShortestDistance } = require('../../utils/logistic/shortestdistance');
const Order = require('../../models/user/order.model')

exports.findShortestDistance = async (req, res) => {
  try {
    const { latitude, longitude ,orderId } = req.body;
    const order = await Order.findOne(orderId)
    const deliveryPartners = await Logistic.find({ availability: true });

    let shortestDistance = Infinity;
    let closestPartner = null;

    deliveryPartners.forEach(partner => {
      const distance = calculateDistance(latitude, longitude, partner.geoCoordinates.latitude, partner.geoCoordinates.longitude);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestPartner = partner;
      }
    });
    order.logisticId[1]=closestPartner.logisticId
    await order.save();
    res.json({ shortestDistance, closestPartner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// exports.findShortestDistance = async (req, res) => {
//   try {
//     const { latitude, longitude } = req.body;

//     const L1 =  26.857000742237627;
//     const L2 = 80.8862285344838;
//     const apiToken = 'pk.eyJ1IjoiYXJhZGh5YTM0NTUiLCJhIjoiY2x2czUwdHNmMGtheTJrbndodW9ieDFmbCJ9.iHwyPQcyqhGa0BtCYBj9JA'; 

//     let shortestDistance = Infinity;
//     let closestPartner = null;

//       const distance = await calculateShortestDistance(apiToken, [latitude, longitude], [L1, L2]);
//       console.log(distance,"hi")
//     res.json({ distance });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }