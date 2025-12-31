import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    // 🇮🇳 Dates stored in DB, frontend should display as DD/MM/YYYY
    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    // 🇮🇳 Number of guests (Adults count as per Indian hotel standard)
    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    // 🇮🇳 Final payable amount in INR (GST included)
    totalPrice: {
      type: Number,
      default: 0,
    },

    // 🇮🇳 Indian hotel booking lifecycle
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed",
    },

    // 🇮🇳 Special requests like early check-in, late check-out, extra mattress
    specialRequests: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
