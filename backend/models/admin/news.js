const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    email: {
        type: String,
    }
});

module.exports = mongoose.model("News", NewsSchema);