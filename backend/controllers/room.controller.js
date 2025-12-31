import Room from "../models/Room.js";

// 🔥 helper function
// 🇮🇳 Normalize room image for frontend display (common practice in Indian hotel sites)
const normalizeImages = (room) => {
  const data = room._doc ? room._doc : room;

  return {
    ...data,

    // 🇮🇳 Single image field handled by frontend
    image:
      typeof data.image === "string" && data.image.trim()
        ? data.image.trim()
        : "placeholder.svg",
  };
};

/**
 * @desc   Get all rooms
 * @route  GET /api/rooms
 * 🇮🇳 Used to display room listings with INR-based pricing on frontend
 */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    const normalizedRooms = rooms.map(normalizeImages);
    res.json(normalizedRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get single room
 * @route  GET /api/rooms/:id
 * 🇮🇳 Used on room detail page before booking
 */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(normalizeImages(room));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create room (Admin)
 * @route  POST /api/rooms
 * 🇮🇳 Admin creates room with price in INR per night
 */
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(normalizeImages(room));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Update room (Admin)
 * @route  PUT /api/rooms/:id
 * 🇮🇳 Admin updates room details, pricing, availability
 */
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(normalizeImages(room));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc   Delete room (Admin)
 * @route  DELETE /api/rooms/:id
 * 🇮🇳 Remove room from hotel inventory
 */
export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get featured rooms
 * @route  GET /api/rooms/featured
 * 🇮🇳 Used on homepage to show available rooms (Indian hotel landing pages)
 */
export const getFeaturedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ is_available: true }).limit(3);
    const normalizedRooms = rooms.map(normalizeImages);
    res.json(normalizedRooms);
  } catch (error) {
    console.error("Featured Rooms Error:", error);
    res.status(500).json({ message: error.message });
  }
};
