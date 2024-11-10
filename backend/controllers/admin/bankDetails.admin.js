const BankDetails = require('../../models/vendor/bankDetails.model');
const axios = require('axios');

exports.createBankDetails = async (req, res) => {
    try {
        const {
            accountHolderName,
            IFSC,
            accountNumber,
            bankId
        } = req.body;


        if (!accountHolderName || !IFSC || !accountNumber || !bankId) {
            return res.status(400).json({ message: "All required fields are not provided." });
        }

        // Initialize branch and address
        let bankName = '';
        let branch = '';
        let address = '';

        // Fetch bank details using the IFSC code
        try {
            const response = await axios.get(`https://ifsc.razorpay.com/${IFSC}`);
            bankName = response.data.BANK || '';
            branch = response.data.BRANCH || '';
            address = response.data.ADDRESS || '';
            console.log(res)
        } catch (error) {
            // Handle errors from IFSC API
            console.error('Error fetching IFSC details:', error.message);
        }


        // Check if the bank details already exist
        const existingBankDetails = await BankDetails.findOne({ bankId });

        if (existingBankDetails) {
            // Update existing bank details
            const updatedBankDetails = await BankDetails.findOneAndUpdate(
                { bankId },
                {
                    accountHolderName,
                    bankName: bankName || existingBankDetails.bankName,
                    accountNumber,
                    IFSC,
                    branch: branch || existingBankDetails.branch,
                    address: address || existingBankDetails.address
                },
                { new: true } // Return the updated document
            );

            return res.json({
                message: "Bank details updated successfully.",
                data: updatedBankDetails
            });
        } else {
            // Create new bank details
            const newBankDetails = await BankDetails.create({
                accountHolderName,
                bankName,
                accountNumber,
                IFSC,
                branch,
                address,
                bankId
            });

            return res.status(201).json({ message: "Bank details created successfully.", data: newBankDetails });
        }
    } catch (error) {
        res.status(500).json({ message: "Error processing bank details.", error: error.message });
    }
};

exports.fetchBankDetails = async (req, res) => {
    try {
        const { bankId } = req.body;

        // Check if bankId is provided
        if (!bankId) {
            return res.status(400).json({ message: "bankId is required." });
        }

        const bankDetails = await BankDetails.findOne({ bankId });

        // Check if bank details were found
        if (!bankDetails) {
            return res.status(404).json({ message: "Bank details not found." });
        }

        return res.json({
            message: "Fetch bank details successfully",
            bankDetails
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching bank details.", error: error.message });
    }
};

exports.editBank = async (req, res) => {
    try {
        const { bankId, accountHolderName, bankName, accountNumber, IFSC, branch, address, bankFor } = req.body;

        if (!bankId) {
            return res.status(400).json({ message: "bankId is required." });
        }

        const updateData = { accountHolderName, bankName, accountNumber, IFSC, branch, address, bankFor };

        // Filter out undefined values in updateData
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const updatedBankDetails = await BankDetails.updateBankDetailsByBankId(bankId, updateData);

        if (!updatedBankDetails) {
            return res.status(404).json({ message: "Bank details not found." });
        }

        return res.json({
            message: "Bank details updated successfully",
            bankDetails: updatedBankDetails
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating bank details.", error: error.message });
    }
};
