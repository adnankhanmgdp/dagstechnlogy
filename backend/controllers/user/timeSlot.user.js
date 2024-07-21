const TimeSlot = require("../../models/admin/timeSlots.model");

exports.getTimeSlots = async (req, res) => {
    try {
        // Fetch and sort time slots by startTime in ascending order
        const timeSlots = await TimeSlot.find().sort({ startTime: 1 });

        return res.json({ timeSlots });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching time slots.",
            error: error.message
        });
    }
};


