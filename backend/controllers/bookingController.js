const Booking = require('../models/Bookings')

//customer books a service
exports.createBooking = async (req, res) => {
    try {
        const { providerId, serviceId, subServiceName, scheduledDate, scheduledTime, address } = req.body
        const booking = await Booking.create({
            customerId: req.user.userId,
            providerId,
            serviceId,
            subServiceName,
            scheduledDate,
            scheduledTime,
            address
        })
        res.status(201).json(booking)
    }
    catch (err) {
        res.status(500).json({ message: "Booking failed", error: err });
    }

}

// Provider updates status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Allow only the provider to update
    if (booking.providerId.toString() !== req.user.userId)
      return res.status(403).json({ message: "Access denied" });

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking", error: err });
  }
};

// Get bookings by role
exports.getMyBookings = async (req, res) => {
  try {
    const filter =
      req.user.role === "customer"
        ? { customerId: req.user.userId }
        : { providerId: req.user.userId };

    const bookings = await Booking.find(filter)
      .populate("serviceId", "name")
      .populate("customerId", "name email")
      .populate("providerId", "name email");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err });
  }
};