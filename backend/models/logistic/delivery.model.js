const mongoose = require("mongoose");

const DeliveryPartnerSchema = new mongoose.Schema({
    logisticId: {
        type: String
    },
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String
    },
    profilePic: {
        type: String,
        default: ""
    },
    OTP: {
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
        default: 'pending'    // 1 - pending 2- active 3- rejected 4- inactive
    },
    currentActiveOrder: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 30
    },
    availability: {
        type: Boolean,
        default: false
    },
    geoCoordinates: {
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
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
        type: String,
    }],
    lastLogin: {
        type: Date
    },
    locationLog: [{
        type: String
    }],
    ip: [{
        type: String
    }],
    activeLog: [{
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    }],
    createdOn: {
        type: Date
    } //add array of location history 
}, { versionKey: false });

DeliveryPartnerSchema.pre('save', async function (next) {
    try {
        if (!this.logisticId) {
            const highestPartner = await mongoose.model('Logistic').findOne({}, { logisticId: 1 }, { sort: { 'logisticId': -1 } });
            let newLogisticId = 'L0000001';

            if (highestPartner) {
                const lastLogisticIdNumber = parseInt(highestPartner.logisticId.replace(/[^\d]/g, ''), 10);
                const nextLogisticIdNumber = lastLogisticIdNumber + 1;
                const logisticIdLength = highestPartner.logisticId.length - 1;

                newLogisticId = `L${String(nextLogisticIdNumber).padStart(logisticIdLength, '0')}`;
            }

            this.logisticId = newLogisticId;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Logistic", DeliveryPartnerSchema);
