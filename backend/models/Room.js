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

    // ✅ FINAL FIX: image_urls validation + cleanup
    image_urls: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every(
            (img) =>
              typeof img === "string" &&
              img.trim() !== "" &&
              img !== "/rooms"
          );
        },
        message: "Image URLs cannot be empty or invalid",
      },
    },

    is_available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ AUTO-CLEAN before save/update
roomSchema.pre("save", function (next) {
  if (Array.isArray(this.image_urls)) {
    this.image_urls = this.image_urls
      .map((img) => img.trim())
      .filter((img) => img && img !== "/rooms");
  }
  next();
});

export default mongoose.model("Room", roomSchema);
