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
const BankDetails = require('../../models/vendor/bankDetails.model');
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");
const { updateLogistic } = require("../admin/logistic.admin");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const verifyingDetails = require("../../Tempelates/verifyingDetails");
const documentUpdateRequestTemplate = require("../../Tempelates/documentUpdateRequestTemplate");
const mailSender = require("../../utils/admin/mailSender");

exports.register = async (req, res) => {
    const { phone, name, email } = req.body;
    const ip = req.ip;

    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        });
    }

    // Check if a logistic with the same phone exists
    const checkLogisticPresent = await Logistic.findOne({ phone });

    if (checkLogisticPresent) {
        if (checkLogisticPresent.status === false) {
            // Logistic exists with status false, delete and create a new one
            await Logistic.deleteOne({ phone });
        } else {
            // Logistic exists and is active
            return res.status(401).json({
                success: false,
                message: "Logistic already exists"
            });
        }
    }

    const checkEmailPresent = await Logistic.findOne({ email });
    if(checkEmailPresent){
        return res.status(401).json({
            success: false,
            message: "Email already exists"
        });
    }

    // Generate OTP and hash it
    const phoneOTP = generateOTP();
    const hashedOTP = await bcrypt.hash(phoneOTP, 10);

    try {
        // Create a new logistic with status false (inactive)
        const logistic = await Logistic.create({ phone, OTP: hashedOTP, name, email, status: false });
        sendOTP(phoneOTP, phone);
        console.log("logistic phone", phone, "otp", phoneOTP);
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        logistic.lastLogin = currentTime;
        if (!logistic.ip.includes(ip)) {
            logistic.ip.push(ip);
            await logistic.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully. Please verify your OTP.",
            logistic
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create Logistic",
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
        const logistic = await Logistic.findOne({ phone });
        console.log(logistic)
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

        if (logistic.verificationStatus == "pending") {
            console.log("hi")
            const emailBody = documentUpdateRequestTemplate(logistic.name);
            await mailSender(logistic.email, 'Logistic Registered', emailBody);
        }
        logistic.status = true;
        await logistic.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token
        });
    } catch (error) {
        console.log(error.message)
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
        // console.log("helow")
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
    const { phone, docs } = req.body;
    try {
        let document;

        const email = req.body.email;

        // Check if email is provided and exists in the database
        if (email) {
            const emailExists = await Logistic.findOne({ email: email });
            if (emailExists && emailExists.phone != phone) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
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

        const emailBody = verifyingDetails(updatedLogistic.name);
        await mailSender(updatedLogistic.email, 'Registration Confirmation', emailBody);

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
        // console.log(logistic)
        let bankDetails = await BankDetails.findOne({ bankId: logistic.logisticId });

        if (!bankDetails) {
            // Create a new BankDetails document with blank fields
            bankDetails = new BankDetails({
                accountHolderName: "",
                bankName: "",
                accountNumber: "",
                IFSC: "",
                branch: "",
                address: "",
                bankId: logistic.logisticId,
                city: "",
                bankFor: ""
            });
            await bankDetails.save();
        }
        return res.json({
            message: "Profile fetched successfully",
            logistic,
            bankDetails
        })
    } catch (err) {
        console.log(err)
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