const jwt = require("jsonwebtoken");
const User = require("../../models/user/user.model");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');
const { generateOTP, sendOTP } = require("../../utils/admin/generateOTP");
const Notification = require('../../models/user/notifications.model')

exports.register = async (req, res) => {
    const { phone, name } = req.body;
    const ip = req.ip;
    const address = [];
    const email = "";
    const profilePic = "";

    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        });
    }

    // Check if user with the same phone exists
    const checkUserPresent = await User.findOne({ phone });

    if (checkUserPresent) {
        if (checkUserPresent.status === false) {
            // User exists with status false, delete and create a new one
            await User.deleteOne({ phone });

            const phoneOTP = generateOTP();
            const hashedOTP = await bcrypt.hashSync(phoneOTP, 10);

            try {
                const user = await User.create({ phone, name, OTP: hashedOTP, userId: phone, address, email, profilePic });
                console.log("user otp", phoneOTP);
                sendOTP(phoneOTP, phone);
                const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
                user.lastLogin = currentTime;
                if (!user.ip.includes(ip)) {
                    user.ip.push(ip);
                    await user.save();
                }
                return res.status(200).json({
                    success: true,
                    message: "OTP sent successfully",
                    user
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to create user",
                    error: error.message
                });
            }
        } else {
            // User exists and is active
            return res.status(401).json({
                success: false,
                message: "User already exists"
            });
        }
    } else {
        // No user exists with the given phone
        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hashSync(phoneOTP, 10);

        try {
            const user = await User.create({ phone, name, OTP: hashedOTP, userId: phone, address, email, profilePic });
            console.log("user otp", phoneOTP);
            sendOTP(phoneOTP, phone);
            const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
            user.lastLogin = currentTime;
            if (!user.ip.includes(ip)) {
                user.ip.push(ip);
                await user.save();
            }
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                user
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user",
                error: error.message
            });
        }
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
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const otpMatch = await bcrypt.compare(otp, user.OTP);
        if (!otpMatch) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        const lastLoginTime = new Date(user.lastLogin);
        const currentTime = new Date(Date.now() + (330 * 60000));
        const timeDiff = Math.abs(currentTime - lastLoginTime);
        const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
        // console.log(minutesDiff)
        if (minutesDiff > 5) {
            return res
                .status(401)
                .json({ success: false, message: "OTP expired" });
        }
        const token = jwt.sign(
            { phone: user.phone, id: user._id, name: user.name },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );
        if (user.status === false) {
            await Notification.create({
                id: user.phone,
                title: "Welcome to DAGS! Now you can clean your laundry effortlessly.",
                subtitle: "Enjoy our quick and convenient laundry services.",
                notificationFor: "user"
            });
        }
        user.status = true;
        await user.save();
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
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                message: "Please register first"
            });
        }
        const phoneOTP = generateOTP();
        const hashedOTP = await bcrypt.hash(phoneOTP, 10);
        user.OTP = hashedOTP;
        await user.save();
        console.log(user, phoneOTP)
        sendOTP(phoneOTP, phone);
        console.log(phone, phoneOTP)
        const currentTime = new Date(Date.now() + (330 * 60000)).toISOString();
        user.lastLogin = currentTime
        await user.save();
        if (!user.ip.includes(ip)) {
            user.ip.push(ip);
            await user.save();
        }
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
}

exports.resendOTP = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({
            message: "No phone number provided"
        });
    }

    try {
        // Check if the user exists and is inactive
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate a new OTP and hash it
        const newOTP = generateOTP();
        const hashedOTP = await bcrypt.hashSync(newOTP, 10);

        // Update the user's OTP in the database
        user.OTP = hashedOTP;
        await user.save();

        // Send the new OTP to the user
        sendOTP(newOTP, phone);

        return res.status(200).json({
            success: true,
            message: "New OTP sent successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP",
            error: error.message
        });
    }
};

exports.addAddress = async (req, res) => {
    const { phone, latitude, longitude, address, pincode } = req.body;
    // console.log(latitude, longitude)
    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (latitude && longitude) {
            user.geoCoordinates.latitude = latitude;
            user.geoCoordinates.longitude = longitude;
        }
        if (pincode) {
            user.pincode = pincode;
        }
        if (address) {
            user.address.push(address);
        }
        await user.save();

        return res.status(200).json({ message: "Address added successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateAddress = async (req, res) => {
    const { phone, index, address } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (index < 0 || index >= user.address.length) {
            return res.status(400).json({ message: "Invalid address index" });
        }

        user.address[index] = address;
        await user.save();

        res.status(200).json({
            message: "Address updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json("Internal Server error", error);
    }
};

exports.fetchAddress = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone: phone })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            address: user.address
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateUser = async (req, res) => {
    const { phone, profilePic, ...updates } = req.body;
    try {

        const existingUser = await User.findOne({ phone: phone });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const email = req.body.email;

        // Check if email is provided and exists in the database
        if (email) {
            const emailExists = await User.findOne({ email: email });
            if (emailExists && emailExists.phone != phone) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        
        const imagePath = path.join(process.env.FILE_SAVE_PATH, `${phone}.jpg`);
        if (profilePic) {
            fs.writeFileSync(imagePath, profilePic, 'base64');
            const document = `${process.env.UPLOAD_URL}` + imagePath.slice(5);
            updates.profilePic = document;
        }
        
        const updatedUser = await User.findOneAndUpdate(
            { phone: phone },
            updates,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: "User Updated successfully",
            updatedUser
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

exports.fetchProfile = async (req, res) => {
    try {
        const { phone } = req.body
        const user = await User.findOne({ phone: phone })

        res.status(200).json({
            message: "user fetched successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
}
