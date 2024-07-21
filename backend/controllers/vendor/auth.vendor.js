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
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
    const { phone, isNewIP, name, email } = req.body;
    const ip = req.ip;
    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        })
    }
    const checkVendorPresent = await Vendor.findOne({ phone });

    if (checkVendorPresent) {
        return res.status(401).json({
            success: false,
            message: "Vendor already exists"
        })
    }
    const phoneOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(phoneOTP, 10);

    try {
        const vendor = await Vendor.create({ phone, OTP: hashedOTP, name: name, email });
        console.log(phoneOTP)
        sendOTP(phoneOTP, phone);
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        vendor.lastLogin = currentTime
        if (!vendor.ip.includes(ip)) {
            vendor.ip.push(ip);
            await vendor.save();
        }
        console.log(vendor.vendorId)
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            vendor,
            vendorId: vendor.vendorId
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create Vendor",
            error: error.message
        });
    }
}

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
        console.log(minutesDiff)
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
        const { phone } = req.body
        console.log(phone)
        const vendor = await Vendor.findOne({ phone })

        res.status(200).json({
            message: "vendor fetched successfully",
            vendor
        })

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
            console.log(document)
        }

        await updatedVendor.save();

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
