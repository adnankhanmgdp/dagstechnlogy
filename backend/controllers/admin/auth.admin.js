const Admin = require("../../models/admin/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");

let otps = {};
let resendedPhoneOTP = {};  // New variable for resended OTP

exports.credentials = async (req, res) => {
    try {
        const { email, password, isNewIP } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Missing Fields" });
        }

        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const phone = admin.phone;
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (isPasswordCorrect) {
            const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
            admin.lastLogin = currentTime;
            await admin.save();

            if (isNewIP) {
                const phoneOTP = generateOTP();
                otps[phone] = { otp: phoneOTP, timestamp: Date.now() };
                sendOTP(phoneOTP, phone);
                console.log(phoneOTP, phone);
                res
                    .status(200)
                    .json({
                        success: true,
                        message: "OTP sent successfully",
                        isNewIP,
                        phone
                    });
            } else {
                const token = jwt.sign(
                    { email: admin.email, id: admin._id },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "30m",
                    }
                );

                const options = {
                    expires: new Date(Date.now() + 30 * 60 * 1000),
                    httpOnly: true,
                };
                res.cookie("token", token, options).status(200).json({
                    success: true,
                    token,
                    phone
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: `Login Failure Please Try Again`,
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { OTP, phone } = req.body;
        console.log("hiiii", req.body)
        // console.log(`Verifying OTP`, OTP, phone);

        // console.log("otps[phone]", otps[phone])
        // console.log("resendedPhoneOTP[phone]",resendedPhoneOTP[phone])

        const sessionData = otps[phone] ? otps[phone] : resendedPhoneOTP[phone]; // Check both variables for OTP
        if (!sessionData) {
            return res
                .status(400)
                .json({ success: false, message: "Session not found" });
        }

        const admin = await Admin.findOne({});
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (OTP !== sessionData.otp) {
            return res
                .status(401)
                .json({ success: false, message: "OTP verification failed" });
        }

        const currentTime = Date.now();
        const timeDiff = Math.abs(currentTime - sessionData.timestamp);
        const minutesDiff = Math.ceil(timeDiff / (1000 * 60));

        if (minutesDiff > 5) {
            return res
                .status(401)
                .json({ success: false, message: "OTP expired" });
        }

        const token = jwt.sign(
            { email: admin.email, id: admin._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );

        const options = {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            message: "OTP verification successful",
        });

        // Clear OTP after successful verification
        delete otps[phone];
        delete resendedPhoneOTP[phone]; // Clear resended OTP as well
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "OTP verification failed. Please try again.",
        });
    }
};

exports.twoSV = async (req, res) => {
    const { isNewIP, passcode, phone } = req.body;
    const ip = req.ip;

    try {
        const admin = await Admin.findOne({ phone: phone });
        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin not found" });
        }

        if (admin.passcode !== passcode) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid passcode" });
        }

        if (isNewIP) {
            if (!admin.ip.includes(ip)) {
                admin.ip.push(ip);
                await admin.save();
            }
        }

        return res.status(200).json(admin);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify passcode",
            error: error.message,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { password, cpassword, phone } = req.body;
    console.log(req.body)
    if (password !== cpassword) {
        return res.status(401).json({
            success: false,
            message: "Password and confirm Password do not match"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.findOne({});
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while resetting password",
            error: error.message
        });
    }
};

exports.resendOTP = async (req, res) => {
    // const { email } = req.body;

    // if (!email) {
    //     return res
    //         .status(400)
    //         .json({ success: false, message: "Missing Fields" });
    // }

    const admin = await Admin.findOne({});
    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }

    const phone = admin.phone;
    try {
        const newOTP = generateOTP();
        console.log(newOTP)
        resendedPhoneOTP[phone] = { otp: newOTP, timestamp: Date.now() }; // Store in new variable
        sendOTP(newOTP, phone);
        // console.log("newOTP",newOTP);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "OTP resend failed. Please try again.",
        });
    }
};

exports.forgotPasscode = async (req, res) => {
    const { passcode, cpasscode, phone } = req.body;

    if (passcode !== cpasscode) {
        return res.status(401).json({
            success: false,
            message: "Passcode and confirm Passcode do not match"
        });
    }

    try {
        const admin = await Admin.findOne({ phone });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        admin.passcode = passcode;
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Passcode reset successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while resetting passcode"
        });
    }
};

exports.getIP = async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        res.send(`Your ip address is ${ip}`)
    } catch (error) {
        res.send("Internal Server Error")
    }
}

exports.phone = async (req, res) => {
    try {
        const admin = await Admin.findOne({})
        res.json({
            phone: admin.phone
        })
    } catch (error) {
        res.json("Internal Server Error")
    }
}