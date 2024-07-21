const Misc = require('../../models/logistic/miscellaneous');

exports.createDeliveryCharge = async (req, res) => {
    try {
        const { dist } = req.body;
        const existingMisc = await Misc.findOne();
        if (existingMisc) {
            return res.status(400).json({
                message: "Charges already created"
            });
        }
        const newMisc = await Misc.create({
            dist: {
                five: dist.five,
                ten: dist.ten,
                twenty: dist.twenty,
                thirty: dist.thirty
            }
        });

        res.status(201).json(newMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDeliveryCharge = async (req, res) => {
    try {
        const { five, ten, twenty, thirty } = req.body;

        let update = {};
        if (five !== undefined) update['dist.five'] = five;
        if (ten !== undefined) update['dist.ten'] = ten;
        if (twenty !== undefined) update['dist.twenty'] = twenty;
        if (thirty !== undefined) update['dist.thirty'] = thirty;

        // Update the document
        const existingMisc = await Misc.findOneAndUpdate({}, { $set: update }, { new: true });


        res.status(200).json(existingMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addFAQ = async (req, res) => {
    try {
        const { question, answer } = req.body;

        const updatedMisc = await Misc.findOneAndUpdate(
            {},
            { $push: { faq: { question, answer } } },
            { new: true, upsert: true }
        );

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateFAQ = async (req, res) => {
    try {
        const { faqId, question, answer } = req.body;

        const updatedMisc = await Misc.findOneAndUpdate(
            { "faq._id": faqId },
            {
                $set: {
                    "faq.$.question": question,
                    "faq.$.answer": answer
                }
            },
            { new: true }
        );

        if (!updatedMisc) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteFAQ = async (req, res) => {
    try {
        const { faqId } = req.body;

        const updatedMisc = await Misc.findOneAndUpdate(
            {},
            { $pull: { faq: { _id: faqId } } },
            { new: true }
        );

        if (!updatedMisc) {
            return res.status(404).json({ message: 'FAQ not found' });
        }

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.additionaldetails = async (req, res) => {
    console.log(req.body);
    try {
        const { tnc, shippingPolicy, privacyPolicy, refundPolicy, tax } = req.body;

        const updateFields = {};
        if (tnc) updateFields.tnc = tnc;
        if (shippingPolicy) updateFields.shippingPolicy = shippingPolicy;
        if (privacyPolicy) updateFields.privacyPolicy = privacyPolicy;
        if (refundPolicy) updateFields.refundPolicy = refundPolicy;
        if (tax) updateFields.tax = tax;

        const updatedMisc = await Misc.findOneAndUpdate({}, updateFields, {
            new: true, // Return the updated document
            upsert: true // Create a new document if one doesn't exist
        });

        res.status(200).json(updatedMisc);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.fetchMisc = async (req, res) => {
    try {
        const charges = await Misc.findOne({})
        return res.json({
            charges: charges
        })
    } catch (error) {
        res.status(500).json({ message: "Error fetching misc.", error: error.message });
    }
}

exports.updateMinAmount = async (req, res) => {
    try {
        const { minAmount } = req.body
        if (!minAmount) {
            return res.status(400).json({
                message: "Please provide valid details"
            })
        }
        const updatedMisc = await Misc.findOneAndUpdate(
            {}, // Filter to find the document
            { $set: { minOrderAmount: minAmount } }, // Update operation
            { new: true, upsert: true } // Options: return the updated document, create if not found
        );
        return res.json({ updatedMisc })
    } catch (error) {
        res.status(500).json({ message: "Error updating min amount.", error: error.message });
    }
}

exports.updatePlatformFee = async (req, res) => {
    try {
        const { fee } = req.body
        if (!('fee' in req.body)) {
            return res.status(400).json({
                message: "Please provide valid details"
            });
        }
        const updatedMisc = await Misc.findOneAndUpdate(
            {}, // Filter to find the document
            { $set: { platformFee: fee } }, // Update operation
            { new: true, upsert: true } // Options: return the updated document, create if not found
        );
        return res.json({ updatedMisc })
    } catch (error) {
        res.status(500).json({ message: "Error updating min amount.", error: error.message });
    }
}