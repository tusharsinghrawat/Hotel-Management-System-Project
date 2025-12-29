import Booking from "../models/Booking.js";

/**
 * @desc   Create booking
 * @route  POST /api/bookings
 * @access Private
 */
export const createBooking = async (req, res) => {
  try {
    // ✅ Auth safety check
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
    } = req.body;

    // ✅ Required fields check (totalPrice optional)
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Date validation
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }

    // ✅ Safe price (frontend may not send it)
    const finalPrice = totalPrice || 0;

    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      totalPrice: finalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get user bookings
 * @route  GET /api/bookings/my
 * @access Private
 */
export const getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find({
      user: req.user._id,
    }).populate("room");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
