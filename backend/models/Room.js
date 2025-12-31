import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    // 🇮🇳 Room name (Indian hotel naming convention)
    name: String,

    // 🇮🇳 Room description (amenities, view, floor, etc.)
    description: String,

    // 🇮🇳 Common room categories used in Indian hotels
    room_type: {
      type: String,
      enum: ["standard", "deluxe", "suite", "presidential"],
      required: true,
    },

    // 🇮🇳 Price per night in INR (GST excluded, added during billing)
    price_per_night: Number,

    // 🇮🇳 Maximum number of guests (adults)
    capacity: Number,

    // 🇮🇳 Room size in square feet (commonly used in India)
    size_sqft: Number,

    // 🇮🇳 Facilities like AC, WiFi, TV, Breakfast, Parking
    amenities: [String],

    // 🇮🇳 Room image for frontend display
    image: {
      type: String,
      default: "placeholder.svg",
      trim: true,
    },

    // 🇮🇳 Room availability status
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
