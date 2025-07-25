const Service = require("../models/Service");

// ✅ Create a service (Provider only)
exports.createService = async (req, res) => {
  try {
    const { name, category, description, price } = req.body;
    console.log(req.user)

    // Validate required fields
    if (!name || !category || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Debug: Check if req.user is populated
    console.log("Authenticated User:", req.user);

    const service = await Service.create({
      name,
      category,
      description,
      price: Number(price),
      providerId: req.user.userId,
      isBlocked: false
    });

    res.status(201).json(service);
  } catch (err) {
    console.error("Error creating service:", err); // Add this for visibility
    res.status(500).json({ message: "Failed to create service", error: err.message });
  }
};


// ✅ Get all services
exports.getServices = async (req, res) => {
  try {
    const role = req.user?.role || "guest"; // customer or guest
    const filter = role === "admin" ? {} : { isBlocked: false };

    const services = await Service.find(filter).populate("providerId", "name email");

    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Failed to get services", error: err.message });
  }
};


// ✅ Get single service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("providerId", "name email");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to get service", error: err.message });
  }
};

// ✅ Update a service (Admin only)
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update service", error: err.message });
  }
};

// ✅ Delete a service (Admin only)
exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete service", error: err.message });
  }
};
