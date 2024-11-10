const Order = require('../../models/user/order.model');
const Vendor = require('../../models/vendor/vendor.model');
const User = require('../../models/user/user.model');
const Logistic = require('../../models/logistic/delivery.model');
const BankDetails = require('../../models/vendor/bankDetails.model');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require("uuid");
const approvalConfirmationTemplate = require('../../Tempelates/approved');
const mailSender = require('../../utils/admin/mailSender');
const rejectionNotificationTemplate = require('../../Tempelates/rejectDocs');

exports.fetchAllVendor = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        return res.status(200).json({
            vendors,
            message: "Vendors fetched successfully"
        })
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to find vendors",
                error: error.message,
            });
    }
}

exports.getVendor = async (req, res) => {
    try {
        const { vendorId } = req.body;

        const vendor = await Vendor.find({ vendorId })
        return res.status(200).json({
            mesage: "vendor fetched sucessfully",
            vendor
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find vendor",
            error: error.message,
        });
    }
}

exports.Vendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await Vendor.findOne({ vendorId: id })
        return res.status(200).json({
            mesage: "vendor fetched sucessfully",
            vendor
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find vendor",
            error: error.message,
        });
    }
}

exports.editVendor = async (req, res) => {
    const { vendorId } = req.body;
    console.log(vendorId);

    const {
        accountHolderName,
        IFSC,
        accountNumber,
        bankId,
        verificationStatus
    } = req.body;

    // Initialize variables for bank details
    let bankName = '';
    let branch = '';
    let address = '';
    let city = '';

    try {
        // Fetch bank details using the IFSC code if provided
        if (IFSC) {
            try {
                const response = await axios.get(`https://ifsc.razorpay.com/${IFSC}`);
                bankName = response.data.BANK || '';
                branch = response.data.BRANCH || '';
                address = response.data.ADDRESS || '';
                city = response.data.CITY || '';
            } catch (error) {
                console.error('Error fetching IFSC details:', error.message);
                // Handle errors from the IFSC API
            }
        }

        // Update vendor details
        const updatedVendor = await Vendor.findOneAndUpdate(
            { vendorId: vendorId },
            req.body,
            { new: true }
        );

        // Update or create bank details
        let updateBankDetails = await BankDetails.findOneAndUpdate(
            { bankId: vendorId },
            {
                accountHolderName,
                bankName: bankName || (await BankDetails.findOne({ bankId: vendorId }).bankName),
                accountNumber,
                IFSC,
                branch: branch || (await BankDetails.findOne({ bankId: vendorId }).branch),
                address: address || (await BankDetails.findOne({ bankId: vendorId }).address),
                bankId: vendorId,
                city
            },
            { new: true }
        );

        if (!updateBankDetails) {
            updateBankDetails = await BankDetails.create({
                accountHolderName,
                bankName,
                accountNumber,
                IFSC,
                branch,
                address,
                bankId: vendorId,
                city
            });
        }

        if (verificationStatus == "active") {
            const emailBody = approvalConfirmationTemplate(updatedVendor.name);
            await mailSender(updatedVendor.email, 'Vendor Approved', emailBody);
        }
        if (verificationStatus == "inactive") {
            const emailBody = rejectionNotificationTemplate(updatedVendor.name);
            await mailSender(updatedVendor.email, 'Vendor Rejected', emailBody);
        }

        res.status(200).json({
            message: "Vendor updated successfully",
            updatedVendor,
            updateBankDetails
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteUnapprovedVendor = async (req, res) => {
    try {

        const { vendorId } = req.body;
        const deleteLogistic = await Vendor.findOneAndDelete({ vendorId: vendorId });
        res.status(200).json({ message: "approval deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: "unable to delete the approval" })
    }
}

exports.createvendor = async (req, res) => {
    try {
        const { email, phone, imgData } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Please enter a mobile number." });
        }
        let existingPhone = await Vendor.findOne({ phone });
        let existingEmail;
        let data;
        if (email) {
            existingEmail = await Vendor.findOne({ email });
        }
        if (existingPhone || existingEmail) {
            return res.status(400).json({ message: "Vendor already exists." });
        }
        if (imgData) {
            data = await Docs(imgData)
        }
        const newVendor = await Vendor.create({
            email,
            phone,
            document: data
        });

        res.status(201).json({
            message: 'Vendor record created successfully',
            data: newVendor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating vendor ',
            error: error.message
        });
    }
};

async function Docs(icon) {
    if (!icon) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'VendorDocs');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(icon, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    const picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);

    return picPath;
}

exports.fetchVendorOrders = async (req, res) => {
    try {
        const { vendorId } = req.body;
        const orders = await Order.find({ vendorId })
        console.log("121212",orders)

        const uniqueUserIds = [...new Set(orders.map(order => order.userId))];
        const uniqueLogisticIds = [...new Set(orders.flatMap(order => order.logisticId))];
        console.log(uniqueLogisticIds, uniqueUserIds)

        const usersPromise = User.find({ phone: { $in: uniqueUserIds } }).exec();
        const logisticsPromise = Logistic.find({ logisticId: { $in: uniqueLogisticIds } }).exec();

        const [users, logistics] = await Promise.all([usersPromise, logisticsPromise]);

        const userMap = new Map(users.map(user => [user.phone, user]));
        const logisticMap = new Map(logistics.map(logistic => [logistic.logisticId, logistic]));

        const populatedOrders = orders.map(order => ({
            ...order.toObject(),
            user: userMap.get(order.userId),
            logistics: order.logisticId.map(id => logisticMap.get(id))
        }));

        res.json({
            message: "All Orders for vendor fetched successfully",
            populatedOrders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed ",
            error: error.message,
        });
    }
}