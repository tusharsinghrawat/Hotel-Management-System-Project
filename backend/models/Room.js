import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: String,
    description: String,

    // ✅ FIXED: Controlled room types (VERY IMPORTANT)
    room_type: {
      type: String,
      enum: ["standard", "deluxe", "suite", "presidential"],
      required: true,
    },

    price_per_night: Number,
    capacity: Number,
    size_sqft: Number,
    amenities: [String],

    // ✅ Support multiple images (10 images)
    image_urls: {
      type: [String],
      default: [],
    },

    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
