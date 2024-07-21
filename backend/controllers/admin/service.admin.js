const Service = require('../../models/vendor/service.model');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

exports.createService = async (req, res) => {

    console.log("Req", req.body)

    const { serviceName, vendorCommission, imgData } = req.body;

    let data;

    try {
        if (imgData) {
            data = await ServiceIcon(imgData)
        }

        const newService = await Service.create({
            serviceName,
            vendorCommission,
            serviceIcon: data
        });

        res.status(201).json(newService);
    } catch (err) {
        console.error('Error creating service:', err);
        res.status(500).json({ error: 'Could not create service' });
    }
}

exports.addItemToService = async (req, res) => {
    console.log("new data adding", req.body)
    const { serviceId, itemName, unitPrice, imgData } = req.body;

    try {
        const service = await Service.findOne({ serviceId: serviceId });

        let data;

        if (imgData) {
            data = await ItemIcon(imgData)
        }

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        if (!itemName && !unitPrice) {
            return res.status(404).json({ error: 'No item details provided' });
        }
        service.items.push({
            name: itemName,
            unitPrice: unitPrice,
            itemIcon: data
        });

        await service.save();

        res.status(200).json(service);
    } catch (err) {
        res.status(500).json({
            error: 'Could not add item to service',
            message: err.message
        });
    }
}

exports.deleteItem = async (req, res) => {
    const { serviceId, itemId } = req.body;
    try {
        if (!serviceId || !itemId) {
            res.status(400).json({ error: 'complete data not found' });
        }

        const service = await Service.findOne({ serviceId: serviceId })

        if (!service) {
            res.status(400).json({ error: 'service not found' });
        }

        const itemIndex = service.items.findIndex(item => item.itemId.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in the service' });
        }

        // Remove the item from the items array
        service.items.splice(itemIndex, 1);

        // Save the updated service
        await service.save();

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getServiceDetails = async (req, res) => {
    const { serviceId } = req.body;
    try {
        const service = await Service.find({ serviceId: serviceId })

        res.status(201).json(service);
    } catch (err) {
        console.error('Error getting service:', err);
        res.status(500).json({ error: 'Could not get services' });
    }
}

exports.deleteService = async (req, res) => {
    const { serviceId } = req.body;
    console.log("serviceIscsdd", serviceId);

    try {
        console.log(serviceId)
        const service = await Service.findOneAndDelete({ serviceId: serviceId });
        // const service = await Service.findOne(serviceId)
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        return res.json({ message: "Service deleted successfully", service });
    } catch (error) {
        return res.status(500).json({ error: 'Could not delete service', message: error.message });
    }
};


exports.editService = async (req, res) => {
    console.log("req.body", req.body);

    const { imgData, serviceName, serviceId, vendorCommission } = req.body;

    try {
        const service = await Service.findOne({ serviceId: serviceId });
        console.log("service", service)

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        if (imgData) {
            const data = await ServiceIcon(imgData);
            service.serviceIcon = data;
        }

        if (serviceName) {
            service.serviceName = serviceName;
        }
        if (vendorCommission) {
            service.vendorCommission = vendorCommission;
        }

        await service.save();

        res.json({ message: "Service updates successfully", service });
    } catch (error) {
        res.status(500).json({ error: 'Could not edit service', message: error.message });
    }
};

exports.editItemInService = async (req, res) => {
    const { serviceId, itemId, newName, newUnitPrice, imgData } = req.body;

    try {
        const service = await Service.findOne({ serviceId });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const item = service.items.find(item => item.itemId === itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found in service' });
        }

        if (imgData) {
            const data = await ItemIcon(imgData)
            item.itemIcon = data
        }

        if (newName) {
            item.name = newName;
        }
        if (newUnitPrice) {
            item.unitPrice = newUnitPrice;
        }

        await service.save();

        res.json({ message: "Service updates successfully", service });
    } catch (error) {
        res.status(500).json({ error: 'Could not edit item in service', message: error.message });
    }
};

exports.fetchServices = async (req, res) => {
    const service = await Service.find()
    try {
        res.json({ message: "Service fetched successfully", service });
    } catch (error) {
        res.status(500).json({ error: 'Could not find service', message: error.message });
    }
}

exports.fetchItem = async (req, res) => {
    const { serviceId, itemId } = req.body;

    try {
        const service = await Service.findOne({ serviceId });

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        const item = service.items.find(item => item.itemId === itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found in the specified service' });
        }

        res.json({ message: "Item fetched successfully", item });
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch item', message: error.message });
    }
};

async function ServiceIcon(icon) {
    if (!icon) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'ServiceIcon');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(icon, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    let picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);
    picPath = `${process.env.UPLOAD_URL}` + picPath.slice(5);

    return picPath;
}

async function ItemIcon(icon) {
    if (!icon) {
        return null;
    }

    const DocsDir = path.join(process.env.FILE_SAVE_PATH, 'ItemIcon');

    if (!fs.existsSync(DocsDir)) {
        fs.mkdirSync(DocsDir, { recursive: true });
    }

    const picBuffer = Buffer.from(icon, 'base64');
    const picFilename = `${uuidv4()}.jpg`;
    let picPath = path.join(DocsDir, picFilename);

    fs.writeFileSync(picPath, picBuffer);
    picPath = `${process.env.UPLOAD_URL}` + picPath.slice(5);

    return picPath;
}