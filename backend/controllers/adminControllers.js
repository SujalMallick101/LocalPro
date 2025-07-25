const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Bookings");

// GET /admin/users?role=provider (optional query filtering)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {}; // If role query is present, apply filter

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// PATCH /admin/users/:id/status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status" });
  }
};

// GET /admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.json({ totalUsers, totalServices, totalBookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// GET /admin/services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("providerId", "name email");
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};
