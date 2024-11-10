// const jwt = require("jsonwebtoken");
// const Vendor = require("../../models/vendor/vendor.model");
// const bcrypt = require("bcryptjs");
// const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");
// const fs = require('fs');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid');

// exports.register = async (req, res) => {
//     const { phone, isNewIP, name } = req.body;
//     const ip = req.ip;
//     if (!phone) {
//         return res.status(400).json({
//             message: "No phone number provided"
//         })
//     }
//     const checkVendorPresent = await Vendor.findOne({ phone });

//     if (checkVendorPresent) {
//         return res.status(401).json({
//             success: false,
//             message: "Vendor already exists"
//         })
//     }
//     const phoneOTP = generateOTP();
//     const hashedOTP = await bcrypt.hash(phoneOTP, 10);

//     try {
//         const vendor = await Vendor.create({ phone, OTP: hashedOTP, name: name });
//         console.log(phoneOTP)
//         sendOTP(phoneOTP, phone);
//         const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
//         vendor.lastLogin = currentTime
//         if (!vendor.ip.includes(ip)) {
//             vendor.ip.push(ip);
//             await vendor.save();
//         }
//         console.log(vendor.vendorId)
//         return res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//             vendor,
//             vendorId: vendor.vendorId
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create Vendor",
//             error: error.message
//         });
//     }
// }

// exports.verifyOTP = async (req, res) => {
//     const { phone, otp } = req.body;
//     if (!phone || !otp) {
//         return res.status(400).json({
//             message: "Phone number and OTP are required"
//         });
//     }

//     try {
//         const vendor = await Vendor.findOne({ phone });
//         if (!vendor) {
//             return res.status(404).json({
//                 message: "Vendor not found"
//             });
//         }
//         const otpMatch = await bcrypt.compare(otp, vendor.OTP);
//         if (!otpMatch) {
//             return res.status(401).json({
//                 message: "Invalid OTP"
//             });
//         }
//         const lastLoginTime = new Date(vendor.lastLogin);
//         const currentTime = new Date(Date.now() + (330 * 60000));
//         const timeDiff = Math.abs(currentTime - lastLoginTime);
//         const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
//         console.log(minutesDiff)
//         if (minutesDiff > 5) {
//             return res
//                 .status(401)
//                 .json({ success: false, message: "OTP expired" });
//         }
//         const token = jwt.sign(
//             { phone: vendor.phone, id: vendor._id },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "1d",
//             }
//         );
//         return res.status(200).json({
//             success: true,
//             message: "OTP verified successfully",
//             token
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to verify OTP",
//             error: error.message
//         });
//     }
// }

// exports.login = async (req, res) => {
//     try {
//         const { phone } = req.body;
//         const ip = req.ip;
//         const vendor = await Vendor.findOne({ phone });
//         if (!vendor) {
//             return res.status(404).json({
//                 message: "Please register first"
//             });
//         }
//         const phoneOTP = generateOTP();
//         const hashedOTP = await bcrypt.hash(phoneOTP, 10);
//         vendor.OTP = hashedOTP;
//         await vendor.save();

//         sendOTP(phoneOTP, phone);
//         console.log(phoneOTP)
//         const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
//         vendor.lastLogin = currentTime
//         await vendor.save();
//         if (!vendor.ip.includes(ip)) {
//             vendor.ip.push(ip);
//             await vendor.save();
//         }
//         return res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//             Vendor
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to send OTP",
//             error: error.message
//         });
//     }
// }

// exports.fetchProfile = async (req, res) => {
//     try {
//         const { phone } = req.body

//         const vendor = await Vendor.findOne({ phone })

//         res.status(200).json({
//             message: "vendor fetched successfully",
//             vendor
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch profile",
//             error: error.message
//         });
//     }
// }

// exports.updateProfile = async (req, res) => {
//     const { phone } = req.body;
//     try {
//         const updatedVendor = await Vendor.findOneAndUpdate(
//             { phone: phone },
//             req.body,
//             { new: true }
//         );
//         if (!updatedVendor) {
//             return res.status(404).json({ message: 'Vendor not found' });
//         }
//         res.status(200).json({
//             message: "Vendor Updated successfully",
//             updatedVendor
//         });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// exports.updateDocs = async (req, res) => {
//     const { phone, docs, ...updates } = req.body;
//     try {
//         let document;
//         const updatedVendor = await Vendor.findOneAndUpdate(
//             { phone: phone },
//             updates,
//             { new: true }
//         );
//         if (docs) {
//             document = Docs(docs)
//         }
//         if (!updatedVendor) {
//             return res.status(404).json({ message: 'Vendor not found' });
//         }
//         const iconPath = `${process.env.UPLOAD_URL}` + data.slice(5);

//         res.status(200).json({
//             message: "Vendor Updated successfully",
//             updatedVendor,
//             document: iconPath
//         });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// async function Docs(docs) {
//     if (!docs) {
//         return null;
//     }

//     const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'docs');

//     if (!fs.existsSync(DocsDir)) {
//         fs.mkdirSync(DocsDir, { recursive: true });
//     }

//     const picBuffer = Buffer.from(docs, 'base64');
//     const picFilename = `${uuidv4()}.jpg`;
//     const picPath = path.join(DocsDir, picFilename);

//     fs.writeFileSync(picPath, picBuffer);

//     return picPath;
// }

// exports.switchAvailability = async (req, res) => {
//     try {
//         const { phone } = req.body;
//         const vendor = await Vendor.findOne(phone)
//         if (!vendor) {
//             return res.status(404).json({ error: 'vendorId not found' });
//         }
//         vendor.availability = !vendor.availability;
//         await vendor.save()
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

const jwt = require("jsonwebtoken");
const Vendor = require("../../models/vendor/vendor.model");
const BankDetails = require('../../models/vendor/bankDetails.model');
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const documentUpdateRequestTemplate = require("../../Tempelates/documentUpdateRequestTemplate");
const verifyingDetails = require("../../Tempelates/verifyingDetails");
const mailSender = require("../../utils/admin/mailSender");

exports.register = async (req, res) => {
    const { phone, name } = req.body;
    const ip = req.ip;

    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        });
    }

    // Check if a vendor with the same phone exists
    const checkVendorPresent = await Vendor.findOne({ phone });

    if (checkVendorPresent) {
        if (checkVendorPresent.status === false) {
            // Vendor exists with status false, delete and create a new one
            await Vendor.deleteOne({ phone });
        } else {
            // Vendor exists and is active
            return res.status(401).json({
                success: false,
                message: "Vendor already exists"
            });
        }
    }

    // const checkEmailPresent = await Vendor.findOne({ email });
    // if(checkEmailPresent){
    //     return res.status(401).json({
    //         success: false,
    //         message: "Email already exists"
    //     });
    // }

    // Generate OTP and hash it
    const phoneOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(phoneOTP, 10);

    try {
        // Create a new vendor with status false (inactive)
        const vendor = await Vendor.create({ phone, OTP: hashedOTP, name, status: false });
        sendOTP(phoneOTP, phone);
        // console.log("Vendor OTP", phoneOTP);
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        vendor.lastLogin = currentTime;
        if (!vendor.ip.includes(ip)) {
            vendor.ip.push(ip);
            await vendor.save();
        }
        // console.log("Vendor ID", vendor.vendorId);
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully. Please verify your OTP.",
            vendor,
            vendorId: vendor.vendorId
        });
    } catch (error) {
        // console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Failed to create Vendor",
            error: error.message
        });
    }
};


exports.verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status(400).json({
            message: "Phone number and OTP are required"
        });
    }

    try {
        const vendor = await Vendor.findOne({ phone });
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }
        const otpMatch = await bcrypt.compare(otp, vendor.OTP);
        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        const lastLoginTime = new Date(vendor.lastLogin);
        const currentTime = new Date(Date.now() + (330 * 60000));
        const timeDiff = Math.abs(currentTime - lastLoginTime);
        const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
        // console.log(vendor)
        if (minutesDiff > 5) {
            return res
                .status(401)
                .json({ success: false, message: "OTP expired" });
        }
        const token = jwt.sign(
            { phone: vendor.phone, id: vendor._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        if (vendor.verificationStatus == "pending") {
            const emailBody = documentUpdateRequestTemplate(vendor.name);
            await mailSender(vendor.email, 'Vendor Registered', emailBody);
        }

        vendor.status = true;
        await vendor.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP",
            error: error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { phone } = req.body;
        const ip = req.ip;
        const vendor = await Vendor.findOne({ phone });
        if (!vendor) {
            return res.status(404).json({
                message: "Please register first"
            });
        }

        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        vendor.OTP = hashedOTP;
        await vendor.save();

        sendOTP(phoneOTP, phone);
        console.log(phoneOTP)
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        vendor.lastLogin = currentTime
        await vendor.save();
        if (!vendor.ip.includes(ip)) {
            vendor.ip.push(ip);
            await vendor.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            Vendor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
}

exports.fetchProfile = async (req, res) => {
    try {
        const { phone } = req.body;
        console.log(phone);
        const vendor = await Vendor.findOne({ phone });

        let bankDetails = await BankDetails.findOne({ bankId: vendor.vendorId });

        if (!bankDetails) {
            // Create a new BankDetails document with blank fields
            bankDetails = new BankDetails({
                accountHolderName: "",
                bankName: "",
                accountNumber: "",
                IFSC: "",
                branch: "",
                address: "",
                bankId: vendor.vendorId,
                city: "",
                bankFor: ""
            });
            await bankDetails.save();
        }

        res.status(200).json({
            message: "Vendor fetched successfully",
            vendor,
            bankDetails
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
}


exports.updateProfile = async (req, res) => {
    const { phone, docs } = req.body;
    try {
        let document;
        const email = req.body.email;

        // Check if email is provided and exists in the database
        if (email) {
            const emailExists = await Vendor.findOne({ email: email });
            if (emailExists && emailExists.phone != phone) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        const updatedVendor = await Vendor.findOneAndUpdate(
            { phone: phone },
            req.body,
            { new: true }
        );
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if (docs) {
            document = await Profile(docs)
            const vendorProfile = `${process.env.UPLOAD_URL}` + document.slice(5);

            updatedVendor.profilePic = vendorProfile
            await updatedVendor.save();
        }

        res.status(200).json({
            message: "Vendor Updated successfully",
            updatedVendor
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function Profile(docs) {
    if (!docs) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'VendorDocs');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(docs, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    const picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);

    return picPath;
}

exports.updateDocs = async (req, res) => {
    const { phone, docs } = req.body;
    try {
        let document;
        const updatedVendor = await Vendor.findOneAndUpdate(
            { phone: phone },
            req.body,
            { new: true }
        );
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        if (docs && docs != 'test docs not needed') {
            document = await Docs(docs)
            const vendorDoc = `${process.env.UPLOAD_URL}` + document.slice(5);
            updatedVendor.document = vendorDoc;
            // console.log(document)
        }

        await updatedVendor.save();

        const emailBody = verifyingDetails(updatedVendor.name);
        await mailSender(updatedVendor.email, 'Registration Confirmation', emailBody);

        res.status(200).json({
            message: "Vendor Updated successfully",
            updatedVendor
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function Docs(docs) {
    if (!docs) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'VendorDocs');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(docs, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    const picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);

    return picPath;
}

exports.switchAvailability = async (req, res) => {
    try {
        const { phone } = req.body;
        const vendor = await Vendor.findOne(phone)
        if (!vendor) {
            return res.status(404).json({ error: 'vendorId not found' });
        }
        vendor.availability = !vendor.availability;
        await vendor.save()
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
