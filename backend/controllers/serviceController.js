const Service = require("../models/Service")

// Create a service (Admin only)
exports.createService = async (req, res) => {
    try {
        const { name, description, icon, subServices } = req.body
        const service = await Service.create({
            name,
            description,
            icon,
            subServices
        })
        res.status(201).json(service)
    }
    catch (err) {
        res.status(500).json({ message: "Failed to create service", error: err })
    }
}

// Get all services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: "Failed to get services", error: err });
    }
};

// Get single service
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: "Service not found" });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: "Failed to get service", error: err });
    }
};


// Update a service
exports.updateService = async (req, res) => {
    try {
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ message: "Service not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Failed to update service", error: err });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Service not found" });
        res.json({ message: "Service deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete service", error: err });
    }
};