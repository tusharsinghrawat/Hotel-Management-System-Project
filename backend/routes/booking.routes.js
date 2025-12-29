import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create new booking (User)
 */
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      specialRequests,
    } = req.body;

    // ✅ Required fields check
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice: totalPrice || 0,
      status: "confirmed",
      specialRequests: specialRequests || "",
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking Route Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/bookings/my
 * @desc    Get logged-in user's bookings
 */
router.get("/my", protect, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (Admin)
 */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking status (Admin)
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = req.body.status || booking.status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
