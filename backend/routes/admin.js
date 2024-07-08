const express = require("express")
const router = express.Router()

const {
    credentials,
    verifyOTP,
    twoSV,
    forgotPassword,
    forgotPasscode,
    resendOTP,
    getIP
} = require("../controllers/admin/auth.admin")

const {
    fetchLogistic,
    getLogistic,
    updateLogistic,
    createLogistic,
    fetchlogisticOrders,
    deleteUnapprovedLogistic
} = require('../controllers/admin/logistic.admin')

const {
    viewOrders,
    getOrder,
    updateOrder,
    getCancelledOrders,
    createOrder,
    fetchOrdersByDateRange,
    day,
    totalOrdersCompleted,
    getTodaysOrders,
    fetchOrdersByMonthRange,
    month,
    fetchmonthlyIncome,
    updateOrderStatus,
    initiateRefund
} = require('../controllers/admin/order.admin')

const {
    addItemToService,
    createService,
    editService,
    editItemInService,
    fetchServices,
    fetchItem,
    deleteItem,
    deleteService,
    getServiceDetails
} = require("../controllers/admin/service.admin")

const {
    sendBulkEmails,
    getUser,
    fetchUsers,
    editUser,
    createUser,
    viewFeedbacks,
    fetchAllUserOrders
} = require("../controllers/admin/user.admin")

const {
    fetchAllVendor,
    getVendor,
    editVendor,
    createvendor,
    fetchVendorOrders,
    deleteUnapprovedVendor
} = require("../controllers/admin/vendor.admin")

const {
    logIP,
    auth,
    checkInactivity
} = require('../middlewares/admin/auth')

const {
    createDeliveryCharge,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    additionaldetails,
    fetchMisc,
    updateDeliveryCharge,
    updateMinAmount
} = require("../controllers/admin/charges.admin")

const {
    vendorSettlement,
    settleVendorAmount,
    viewHistory,
    logisticPickupSettlement,
    logisticDeliverySettlement,
    settlePickedAmount,
    settleDeliveredAmount
} = require("../controllers/admin/settlement.admin")

const { createBankDetails, fetchBankDetails } = require("../controllers/admin/bankDetails.admin")
const { vendorFeedback } = require("../controllers/admin/feedback.admin")
const { getTimeSlots, createTimeSlot, deleteTimeSlot } = require("../controllers/admin/timeSlot.admin")

//auth
router.post("/credintials", logIP, credentials)
router.post("/verifyOTP", logIP, verifyOTP)
router.post("/twoSV", auth, logIP, twoSV)
router.post("/forgotPassword", auth, logIP, forgotPassword)
router.post("/forgotPasscode", logIP, forgotPasscode)
router.post("/resendOTP", logIP, resendOTP)
router.get("/getip", getIP)

//logistic
router.get("/fetchLogistic", auth, logIP, fetchLogistic)
router.post("/getLogistic", auth, logIP, getLogistic)
router.post("/updateLogistic", auth, logIP, updateLogistic)
router.post("/createLogistic", auth, logIP, createLogistic)
router.post("/logisticOrders", fetchlogisticOrders)
router.post("/deleteUnapprovedLogistic", auth, logIP, deleteUnapprovedLogistic)

//user
router.get("/fetchUsers", auth, logIP, fetchUsers)
router.post("/editUser", auth, logIP, editUser)
router.post("/getUser", auth, logIP, getUser)
router.post("/UserOrders", auth, logIP, fetchAllUserOrders)
router.post("/createUser", auth, logIP, createUser)
router.post("/sendemail", auth, logIP, sendBulkEmails)
// router.get("/viewFeedbacks", auth, logIP, viewFeedbacks)

//vendors
router.get("/fetchVendors", auth, logIP, fetchAllVendor)
router.post("/getVendor", auth, logIP, getVendor)
router.post("/editVendor", auth, logIP, editVendor)
router.post("/createVendor", auth, logIP, createvendor)
router.post("/vendorOrders", auth, logIP, fetchVendorOrders)
router.post("/deleteUnapprovedVendor", auth, logIP, deleteUnapprovedVendor)

// payments
// router.get('/getPayments', getPayments)

// bank
router.post("/createBankDetails", auth, logIP, createBankDetails)
router.post("/fetchBankDetails", auth, logIP, fetchBankDetails)

//orders
router.get("/fetchOrders", auth, logIP, viewOrders)
router.get("/getOrder", auth, logIP, getOrder)
router.put("/updateOrder", auth, logIP, updateOrder)
router.get("/getCancelledOrders", auth, logIP, getCancelledOrders)
router.post("/createOrder", auth, logIP, createOrder)
router.post("/fetchOrdersByDateRange", fetchOrdersByDateRange)
router.post("/fetchOrdersByMonthRange", fetchOrdersByMonthRange)
router.get("/order", getTodaysOrders)
router.post("/monthlyIncome", fetchmonthlyIncome)
router.post("/updateOrderStatus", updateOrderStatus)
router.post("/initiateRefund",auth, logIP, initiateRefund)

// dashboard
router.get("/day", auth, logIP, day);
router.get("/totalOrdersCompleted", auth, logIP, totalOrdersCompleted)

//service
router.post("/addService", auth, logIP, createService)
router.get("/getService", auth, logIP, fetchServices)
router.post("/getServiceDetails", auth, logIP, getServiceDetails)
router.post('/addItem', auth, logIP, addItemToService)
router.post('/updateService', auth, logIP, editService)
router.post('/deleteItem', auth, logIP, deleteItem)
router.post('/deleteService', auth, logIP, deleteService)
router.post('/editItemInService', auth, logIP, editItemInService)

//settlement
router.get("/vendorSettlement", auth, logIP, vendorSettlement)
router.get("/pickupSettlement", auth, logIP, logisticPickupSettlement)
router.get("/deliverySettlement", auth, logIP, logisticDeliverySettlement)
router.post("/settleVendorAmount", auth, logIP, settleVendorAmount)
router.post("/settlePickedAmount", auth, logIP, settlePickedAmount)
router.post("/settleDeliveredAmount", auth, logIP, settleDeliveredAmount)
router.get("/history", auth, logIP, viewHistory)

//misc
router.post("/DeliveryCharge", auth, logIP, createDeliveryCharge)
router.put("/DeliveryCharge", auth, logIP, updateDeliveryCharge)
router.post("/addFAQ", auth, logIP, addFAQ)
router.put("/updateFAQ", auth, logIP, updateFAQ)
router.delete("/deleteFAQ", auth, logIP, deleteFAQ)
router.post("/additionaldetails", auth, logIP, additionaldetails)
router.get("/fetchMisc",auth, fetchMisc)
router.put("/minAmount", auth, logIP, updateMinAmount)

//feedback

//timeSlot
router.post("/createTimeSlot", auth, logIP, createTimeSlot)
router.get("/getTimeSlots", auth, logIP, getTimeSlots)
router.post("/deleteTimeSlot", auth, logIP, deleteTimeSlot)

module.exports = { adminRoutes: router }; 