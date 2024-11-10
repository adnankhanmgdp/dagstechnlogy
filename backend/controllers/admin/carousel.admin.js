const Carousel = require('../../models/admin/carousel')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

exports.createCarousel = async (req, res) => {
    console.log(req.body)
    try {
        const { img, description, route, serviceId } = req.body;

        // Validation checks
        if (!img || !route || !description) {
            return res.json({
                message: "Please provide all the fields"
            })
        }

        let imgData = await storeData(img)

        const carousel = await Carousel.create({
            img: imgData,
            description: description,
            route: route,
            serviceId
        })

        res.json({
            message: "Carousel Created Successfully",
            carousel
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

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

exports.deleteCarousel = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCarousel = await Carousel.findByIdAndDelete(id);

        if (!deletedCarousel) {
            return res.status(404).json({ message: "Carousel not found" });
        }

        res.status(200).json({
            message: "Carousel deleted successfully",
            carousel: deletedCarousel
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

async function storeData(data) {
    if (!data) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'CarouselData');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(data, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    let picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);
    picPath = `${process.env.UPLOAD_URL}` + picPath.slice(5);

    return picPath;
}