const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema({
    img: {
        type: String
    },
    serviceId: {
        type: String
    },
    description: {
        type: String
    },
    route: {
        type: String
    }
}, { versionKey: false });

module.exports = mongoose.model("Carousel", CarouselSchema);
