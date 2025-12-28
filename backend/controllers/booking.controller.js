import Booking from "../models/Booking.js";

/**
 * @desc   Create booking
 * @route  POST /api/bookings
 * @access Private
 */
export const createBooking = async (req, res) => {
  try {
    const {
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
    } = req.body;

    if (!room || !checkInDate || !checkOutDate || !guests || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = await Booking.create({
      user: req.user._id, // from auth middleware
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
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
    const bookings = await Booking.find({ user: req.user._id }).populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
