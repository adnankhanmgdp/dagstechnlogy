const express = require("express")
const router = express.Router()
const {
    register,
    verifyOTP,
    login,
    addAddress,
    fetchAddress,
    fetchProfile,
    updateUser,
    updateAddress,
} = require("../controllers/user/auth.user")

const { createOrder, fetchServices, verifyPayment, fetchAllOrders, viewItem, viewOrder, cancelledStatus } = require("../controllers/user/orders.user")

const { auth } = require('../middlewares/user/auth')
const { findNearestVendor, ShortestDistanceForVendor, ShortestDistanceforUser } = require("../controllers/user/logistic.user")
const { giveReview, showReview } = require("../controllers/user/vendor.user")
const { fetchNotifications } = require("../controllers/user/notifications.user")
const { tnc } = require("../controllers/user/tnc.user")
const { getActiveCoupons } = require("../controllers/user/coupon.user")
const { getTimeSlots } = require("../controllers/user/timeSlot.user")
const { fetchCarousel } = require("../controllers/user/carousel.user")

router.post("/signup", register)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.put("/addAddress", addAddress)
router.post("/fetchAddress", fetchAddress)
router.post("/updateAddress", updateAddress)
router.put("/updateUser", updateUser)
router.post("/fetchProfile", fetchProfile)

//orders
router.get("/fetchServices", fetchServices)
router.post("/createOrder", createOrder)
router.post("/verifyPayment", verifyPayment)
router.post("/fetchAllOrders", fetchAllOrders)
router.get("/viewOrder", viewOrder)
router.get("/viewItem", viewItem)
router.post("/cancel", cancelledStatus)

//logistic
router.post("/findNearestVendor", findNearestVendor)
router.post("/ShortestDistanceForVendor", ShortestDistanceForVendor)
router.post("/ShortestDistanceforUser", ShortestDistanceforUser)

//notigications
router.get("/notifications", fetchNotifications)

//timeslot
router.get('/timeSlot', getTimeSlots)

//coupons
router.get("/coupon", getActiveCoupons)

//carousel
router.get("/carousel", fetchCarousel)

router.get("/tnc", tnc)

router.post("/review", giveReview)
router.post("/showReview", showReview)


module.exports = { userRoutes: router }
