const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    trackLocation,
    updateProfile,
    fetchProfile,
    switchAvailability,
    updateDocs
} = require("../controllers/logistic/auth.logistic")
const { verifyLogistic } = require("../middlewares/logistic/auth")
const { getLogisticDashboard,
    getAllOrders,
    fetchActiveOrders,
    getOrder,
    pickedUpStatus,
    outOfDeliveryStatus,
    confirmDelivery,
    fetchPastOrders,
    dashboard,
    deliveryOTP
} = require("../controllers/logistic/orders.logistic")
const { settlement, calculateLogisticsFee, calculateAmount } = require("../controllers/logistic/settlement.logistic")

//auth
router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/fetchProfile",  fetchProfile)
router.put("/updateProfile",  updateProfile)
router.put("/updateDocs", updateDocs)
router.post("/switchAvailability", verifyLogistic, switchAvailability)
router.post("/trackLocation", verifyLogistic, trackLocation)

//orders
router.post("/dashboard", verifyLogistic, dashboard)
router.post("/getAllOrders", verifyLogistic, getAllOrders)
router.post("/fetchActiveOrders", verifyLogistic, fetchActiveOrders)
router.post("/getOrder", verifyLogistic, getOrder)
router.post("/pickedUp", verifyLogistic, pickedUpStatus)
router.post("/outOfDelivery", verifyLogistic, outOfDeliveryStatus)
router.post("/delivered", verifyLogistic, confirmDelivery)
router.post("/pastOrders", verifyLogistic, fetchPastOrders)
router.post("/deliveryOTP", verifyLogistic, deliveryOTP)

//settlement
router.post("/settlement", verifyLogistic, settlement)
router.post("/calculateLogisticsFee", verifyLogistic, calculateLogisticsFee)
router.post("/calculateAmount", verifyLogistic, calculateAmount)

module.exports = { logisticRoutes: router }; 