import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    room_type: String,
    price_per_night: Number,
    capacity: Number,
    size_sqft: Number,
    amenities: [String],

    // ✅ UPDATED: Support multiple images (10 images)
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
