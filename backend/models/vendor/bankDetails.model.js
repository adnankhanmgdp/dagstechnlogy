const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
    accountHolderName: {
        type: String,
    },
    bankName: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    IFSC: {
        type: String,
    },
    branch: {
        type: String,
    },
    address: {
        type: String
    },
    bankId: {
        type: String
    },
    city: {
        type: String
    },
    bankFor: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
