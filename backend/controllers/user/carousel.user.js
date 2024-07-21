const Carousel = require('../../models/admin/carousel')

exports.fetchCarousel = async (req, res) => {
    try {
        const carousel = await Carousel.find({})
        res.json({
            message: "Carousel fetched Successfully",
            carousel,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
