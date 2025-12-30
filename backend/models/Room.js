import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: String,
    description: String,

    room_type: {
      type: String,
      enum: ["standard", "deluxe", "suite", "presidential"],
      required: true,
    },

    price_per_night: Number,
    capacity: Number,
    size_sqft: Number,
    amenities: [String],

    // ✅ FRONTEND IMAGE FIELD (ONLY CHANGE)
    image: {
      type: String,
      default: "placeholder.svg",
      trim: true,
    },

    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
