const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    profilePic: {
        type: String
    },
    docType: {
        type: String
    },
    document: {
        type: String
    },
    verificationStatus: {
        type: String,
        default: 'pending'  // 1 - pending 2- active 3- rejected 4- inactive
    },
    OTP: {
        type: String
    },
    capacity: {
        type: Number
    },
    availability: {
        type: Boolean,
        default: true
    },
    geoCoordinates: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    },
    currentActiveOrders: {
        type: Number,
        default: 0
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    orders: [{
        type: String
    }],
    lastLogin: {
        type: Date
    },
    ip: [{
        type: String
    }],
    createdOn: {
        type: Date,
    }
}, { versionKey: false });

VendorSchema.pre('save', async function (next) {
    try {
        if (!this.vendorId) {
            const highestVendor = await mongoose.model('Vendor').findOne({}, { vendorId: 1 }, { sort: { vendorId: -1 } });
            let newVendorId = 'VE000001';

            if (highestVendor) {
                const lastVendorIdNumber = parseInt(highestVendor.vendorId.replace(/[^\d]/g, ''), 10);
                const nextVendorIdNumber = lastVendorIdNumber + 1;
                const vendorIdLength = 6;

                newVendorId = `VE${String(nextVendorIdNumber).padStart(vendorIdLength, '0')}`;
            }

            this.vendorId = newVendorId;
        }
        next();
    } catch (error) {
        next(error);
    }
});



module.exports = mongoose.model("Vendor", VendorSchema);


