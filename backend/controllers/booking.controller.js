import Booking from "../models/Booking.js";

/**
 * @desc   Create booking
 * @route  POST /api/bookings
 * @access Private
 */
export const createBooking = async (req, res) => {
  try {
    // 🇮🇳 User authentication check (mandatory in Indian booking systems)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice, // 🇮🇳 Final payable amount in INR (GST included, calculated on frontend)
    } = req.body;

    // 🇮🇳 Basic booking validation
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🇮🇳 Dates stored in DB, frontend should display DD/MM/YYYY
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 🇮🇳 Check-out must be after check-in (standard hotel rule)
    if (checkOut <= checkIn) {
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in" });
    }

    // 🇮🇳 Total price in INR (fallback safety)
    const finalPrice = totalPrice || 0;

    // 🇮🇳 Create booking record
    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,        // Adults count as per Indian hotel convention
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
    // 🇮🇳 Only logged-in user can view their bookings
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find({
      user: req.user._id,
    }).populate("room"); // 🇮🇳 Populate room details for booking summary

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get bookings by room (for availability calendar)
 * @route  GET /api/bookings/room/:roomId
 * @access Public
 */
export const getBookingsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // 🇮🇳 Used for room availability calendar (Indian hotel practice)
    const bookings = await Booking.find(
      { room: roomId },
      "checkInDate checkOutDate"
    );

    // 🇮🇳 Frontend expects simplified keys for calendar usage
    const formatted = bookings.map((b) => ({
      check_in: b.checkInDate,
      check_out: b.checkOutDate,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Get Bookings By Room Error:", error);
    res.status(500).json({ message: error.message });
  }
};
