// const jwt = require("jsonwebtoken");
// const Logistic = require("../../models/logistic/delivery.model");
// const bcrypt = require("bcryptjs");
// const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");

// exports.register = async (req, res) => {
//     const { phone, isNewIP, name, email } = req.body;
//     const ip = req.ip;
//     if (!phone) {
//         return res.status(400).json({
//             message: "No phone number provided"
//         })
//     }
//     const checkLogisticPresent = await Logistic.findOne({ phone });

//     if (checkLogisticPresent) {
//         return res.status(401).json({
//             success: false,
//             message: "Logistic already exists"
//         })
//     }
//     const phoneOTP = generateOTP();
//     const hashedOTP = await bcrypt.hash(phoneOTP, 10);

//     try {
//         const logistic = await Logistic.create({ phone, OTP: hashedOTP, name, email });
//         sendOTP(phoneOTP, phone);
//         console.log(phone, phoneOTP)
//         const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
//         logistic.lastLogin = currentTime
//         if (!logistic.ip.includes(ip)) {
//             logistic.ip.push(ip);
//             await logistic.save();
//         }
//         return res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//             logistic
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to create Logistic",
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
//         const logistic = await Logistic.findOne({ phone });
//         if (!logistic) {
//             return res.status(404).json({
//                 message: "Logistic not found"
//             });
//         }
//         const otpMatch = await bcrypt.compare(otp, logistic.OTP);
//         if (!otpMatch) {
//             return res.status(401).json({
//                 message: "Invalid OTP"
//             });
//         }
//         const lastLoginTime = new Date(logistic.lastLogin);
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
//             { phone: logistic.phone, id: logistic._id },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "30m",
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
//         const logistic = await Logistic.findOne({ phone });
//         if (!logistic) {
//             return res.status(404).json({
//                 message: "Please register first"
//             });
//         }
//         const phoneOTP = generateOTP();
//         const hashedOTP = await bcrypt.hash(phoneOTP, 10);
//         logistic.OTP = hashedOTP;
//         await logistic.save();

//         sendOTP(phoneOTP, phone);
//         console.log(phone, phoneOTP)
//         const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
//         logistic.lastLogin = currentTime
//         await logistic.save();
//         if (!logistic.ip.includes(ip)) {
//             logistic.ip.push(ip);
//             await logistic.save();
//         }
//         return res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//             logistic
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to send OTP",
//             error: error.message
//         });
//     }
// }

// exports.updateProfile = async (req, res) => {
//     const { phone } = req.body;
//     try {
//         const updatedLogistic = await Logistic.findOneAndUpdate(
//             { phone: phone },
//             req.body,
//             { new: true }
//         );
//         if (!updatedLogistic) {
//             return res.status(404).json({ message: 'Vendor not found' });
//         }
//         res.status(200).json({
//             message: "Logistic Updated successfully",
//             updatedLogistic
//         });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// exports.updateDocs = async (req, res) => {
//     const { phone } = req.body;
//     try {
//         const updatedLogistic = await Logistic.findOneAndUpdate(
//             { phone: phone },
//             req.body,
//             { new: true }
//         );
//         if (!updatedLogistic) {
//             return res.status(404).json({ message: 'lOGISTICS not found' });
//         }
//         res.status(200).json({
//             message: "Logistic Updated successfully",
//             updatedLogistic
//         });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// exports.fetchProfile = async (req, res) => {
//     try {
//         const { phone } = req.body;
//         const logistic = await Logistic.findOne({ phone });
//         return res.json({
//             message: "Profile fetched successfully",
//             logistic
//         })
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// }

// exports.switchAvailability = async (req, res) => {
//     try {
//         const { phone } = req.body;
//         const logistic = await Logistic.findOne({ phone })
//         if (!logistic) {
//             return res.status(404).json({ error: 'Logistic not found' });
//         }
//         logistic.availability = !logistic.availability;
//         await logistic.save()
//         return res.json({
//             message: "Status updated successfully.",
//             logistic
//         })
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// exports.trackLocation = async (req, res) => {
//     try {
//         const { phone, latitude, longitude } = req.body;
//         const logistic = await Logistic.findOne({ phone })
//         console.log(logistic)
//         if (!logistic) {
//             return res.json({ message: "Delivery partner not found" });
//         }
//         logistic.geoCoordinates = { latitude, longitude };

//         logistic.activeLog.push({ latitude, longitude });

//         await logistic.save();

//         return res.json({ success: true, message: "Location tracked successfully" });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error', message: error.message });
//     }
// }


const jwt = require("jsonwebtoken");
const Logistic = require("../../models/logistic/delivery.model");
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");
const { updateLogistic } = require("../admin/logistic.admin");
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
    const checkLogisticPresent = await Logistic.findOne({ phone });

    if (checkLogisticPresent) {
        return res.status(401).json({
            success: false,
            message: "Logistic already exists"
        })
    }
    const phoneOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(phoneOTP, 10);

    try {
        const logistic = await Logistic.create({ phone, OTP: hashedOTP, name, email });
        sendOTP(phoneOTP, phone);
        console.log(phone, phoneOTP)
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        logistic.lastLogin = currentTime
        if (!logistic.ip.includes(ip)) {
            logistic.ip.push(ip);
            await logistic.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            logistic
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create Logistic",
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
        const logistic = await Logistic.findOne({ phone });
        if (!logistic) {
            return res.status(404).json({
                message: "Logistic not found"
            });
        }
        const otpMatch = await bcrypt.compare(otp, logistic.OTP);
        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        const lastLoginTime = new Date(logistic.lastLogin);
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
            { phone: logistic.phone, id: logistic._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m",
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
        const logistic = await Logistic.findOne({ phone });
        if (!logistic) {
            return res.status(404).json({
                message: "Please register first"
            });
        }
        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        logistic.OTP = hashedOTP;
        await logistic.save();

        sendOTP(phoneOTP, phone);
        console.log(phone, phoneOTP)
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        logistic.lastLogin = currentTime
        await logistic.save();
        if (!logistic.ip.includes(ip)) {
            logistic.ip.push(ip);
            await logistic.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            logistic
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
}

exports.updateProfile = async (req, res) => {
    const { phone , docs } = req.body;
    try {
        let document;
        // console.log(docs)
        const updatedLogistic = await Logistic.findOneAndUpdate(
            { phone: phone },
            req.body,
            { new: true }
        );
        if (!updatedLogistic) {
            return res.status(404).json({ message: 'Logistics not found' });
        }

        if (docs) {
            document = await Profile(docs)
        }

        const logisticProfile = `${process.env.UPLOAD_URL}` + document.slice(5);
        updatedLogistic.profilePic = logisticProfile
        await updatedLogistic.save();
        res.status(200).json({
            message: "Logistic Updated successfully",
            updatedLogistic
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function Profile(docs) {
    if (!docs) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'LogisticProfile');

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
        // console.log(docs)
        let document;
        const updatedLogistic = await Logistic.findOneAndUpdate(
            { phone: phone },
            req.body,
            { new: true }
        );
        
        if (!updatedLogistic) {
            return res.status(404).json({ message: 'logistic not found' });
        }

        if (docs) {
            document = await Docs(docs)
        }

        const logisticDoc = `${process.env.UPLOAD_URL}` + document.slice(5);
        updatedLogistic.document = logisticDoc
        await updatedLogistic.save();
        res.status(200).json({
            message: "Logistic Updated successfully",
            updatedLogistic
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function Docs(docs) {
    if (!docs) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'LogisticDoc');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(docs, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    const picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);

    return picPath;
}

exports.fetchProfile = async (req, res) => {
    try {
        const { phone } = req.body;
        const logistic = await Logistic.findOne({ phone });
        return res.json({
            message: "Profile fetched successfully",
            logistic
        })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.switchAvailability = async (req, res) => {
    try {
        const { logisticId } = req.body;
        const logistic = await Logistic.findOne({ logisticId })
        if (!logistic) {
            return res.status(404).json({ error: 'Logistic not found' });
        }
        logistic.availability = !logistic.availability;
        await logistic.save()
        return res.json({
            message: "Status updated successfully.",
            logistic
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.trackLocation = async (req, res) => {
    try {
        const { logisticId, latitude, longitude } = req.body;
        const logistic = await Logistic.findOne({ logisticId })
        console.log(logistic)
        if (!logistic) {
            return res.json({ message: "Delivery partner not found" });
        }
        logistic.geoCoordinates = { latitude, longitude };

        logistic.activeLog.push({ latitude, longitude });

        await logistic.save();

        return res.json({ success: true, message: "Location tracked successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}